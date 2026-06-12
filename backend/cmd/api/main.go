package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/time/rate"

	"vault-of-evidence/backend/internal/auth"
	"vault-of-evidence/backend/internal/config"
	"vault-of-evidence/backend/internal/database"
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/evidence"
	"vault-of-evidence/backend/internal/finding"
	"vault-of-evidence/backend/internal/middleware"
	"vault-of-evidence/backend/internal/notification"
	jwtpkg "vault-of-evidence/backend/internal/pkg/jwt"
	"vault-of-evidence/backend/internal/project"
	"vault-of-evidence/backend/internal/worklist"
)

func main() {
	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("[FATAL] Config: %v", err)
	}

	gin.SetMode(cfg.GinMode)

	db, err := database.NewPostgresConnection(cfg)
	if err != nil {
		log.Fatalf("[FATAL] DB: %v", err)
	}
	if err := database.AutoMigrate(db); err != nil {
		log.Fatalf("[FATAL] Migration: %v", err)
	}

	isProduction := cfg.GinMode == gin.ReleaseMode
	jwtManager := jwtpkg.NewManager(cfg.JWTSecret, cfg.JWTExpiryHours, isProduction)

	authRepo := auth.NewRepository(db)
	authSvc := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authSvc, jwtManager)

	projectRepo := project.NewRepository(db)
	projectSvc := project.NewService(projectRepo)
	projectHandler := project.NewHandler(projectSvc)

	worklistRepo := worklist.NewRepository(db)
	worklistSvc := worklist.NewService(worklistRepo)
	worklistHandler := worklist.NewHandler(worklistSvc)

	findingRepo := finding.NewRepository(db)
	findingSvc := finding.NewService(findingRepo)
	findingHandler := finding.NewHandler(findingSvc)

	evidenceRepo := evidence.NewRepository(db)
	evidenceSvc := evidence.NewService(evidenceRepo)
	evidenceHandler := evidence.NewHandler(evidenceSvc, cfg.EvidenceStoragePath, cfg.MaxUploadSizeMB)

	notificationRepo := notification.NewRepository(db)
	notificationSvc := notification.NewService(notificationRepo)
	notificationHandler := notification.NewHandler(notificationSvc)

	authLimiter := middleware.NewRateLimiter(rate.Every(20*time.Second), 3)

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.SecurityHeaders())

	if err := router.SetTrustedProxies([]string{"127.0.0.1"}); err != nil {
		log.Fatalf("[FATAL] Proxy: %v", err)
	}

	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", cfg.AllowedOrigin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	authMw := middleware.AuthRequired(jwtManager)

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "voe-backend"})
	})

	api := router.Group("/api/v1")

	authRoutes := api.Group("/auth")
	{
		authRoutes.POST("/signup", authLimiter.Middleware(), authHandler.Signup)
		authRoutes.POST("/login", authLimiter.Middleware(), authHandler.Login)
		authRoutes.POST("/resetPassword", authLimiter.Middleware(), authHandler.ForgotPassword)
		authRoutes.POST("/createNewPassword", authLimiter.Middleware(), authHandler.ResetPassword)

		authRoutes.POST("/logout", authHandler.Logout)
		authRoutes.POST("/change-password", authMw, authHandler.ChangePassword)
		authRoutes.GET("/me", authMw, authHandler.GetMe)
	}

	projectRoutes := api.Group("/projects")
	projectRoutes.Use(authMw)
	{
		projectRoutes.GET("", projectHandler.GetAll)
		projectRoutes.POST("", projectHandler.Create)

		projectRoutes.GET("/dashboard/summary", projectHandler.GetDashboardSummary)

		singleProject := projectRoutes.Group("/:id")
		{
			singleProject.GET("",
				middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
				projectHandler.GetByID)

			singleProject.PUT("",
				middleware.RequireProjectRole(db, "id", domain.RolePM),
				projectHandler.Update)

			singleProject.DELETE("",
				middleware.RequireProjectRole(db, "id", domain.RolePM),
				projectHandler.Delete)

			singleProject.POST("/members",
				middleware.RequireProjectRole(db, "id", domain.RolePM),
				projectHandler.InviteMember)

			singleProject.DELETE("/members/:user_id",
				middleware.RequireProjectRole(db, "id", domain.RolePM),
				projectHandler.RemoveMember)

			worklistRoutes := singleProject.Group("/worklists")
			{
				worklistRoutes.GET("",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
					worklistHandler.GetByProject)

				worklistRoutes.GET("/:worklist_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
					worklistHandler.GetByID)

				worklistRoutes.POST("",
					middleware.RequireProjectRole(db, "id", domain.RolePM),
					worklistHandler.Create)

				worklistRoutes.PUT("/:worklist_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM),
					worklistHandler.Update)

				worklistRoutes.DELETE("/:worklist_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM),
					worklistHandler.Delete)

				// Nested routes untuk finding di dalam sebuah worklist: /projects/:id/worklists/:worklist_id/findings
				worklistFindingsRoutes := worklistRoutes.Group("/:worklist_id/findings")
				{
					worklistFindingsRoutes.GET("",
						middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
						findingHandler.GetByWorklist)

					worklistFindingsRoutes.POST("",
						middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RolePentester),
						findingHandler.Create)

					worklistFindingsRoutes.GET("/:finding_id",
						middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
						findingHandler.GetByID)

					worklistFindingsRoutes.PUT("/:finding_id",
						middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
						findingHandler.Update)

					worklistFindingsRoutes.DELETE("/:finding_id",
						middleware.RequireProjectRole(db, "id", domain.RolePM),
						findingHandler.Delete)

					worklistEvidenceRoutes := worklistFindingsRoutes.Group("/:finding_id/evidence")
					{
						worklistEvidenceRoutes.GET("",
							middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
							evidenceHandler.GetByFinding)

						worklistEvidenceRoutes.GET("/:evidence_id/download",
							middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
							evidenceHandler.Download)

						worklistEvidenceRoutes.POST("",
							middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RolePentester),
							evidenceHandler.Upload)

						worklistEvidenceRoutes.DELETE("/:evidence_id",
							middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RolePentester),
							evidenceHandler.Delete)
					}
				}
			}

			findingRoutes := singleProject.Group("/findings")
			{
				findingRoutes.GET("",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
					findingHandler.GetByProject)

				findingRoutes.GET("/:finding_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
					findingHandler.GetByID)

				findingRoutes.POST("",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RolePentester),
					findingHandler.Create)

				findingRoutes.PUT("/:finding_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RolePentester, domain.RoleDev),
					findingHandler.Update)

				findingRoutes.DELETE("/:finding_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM),
					findingHandler.Delete)

				evidenceRoutes := findingRoutes.Group("/:finding_id/evidence")
				{
					evidenceRoutes.GET("",
						middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
						evidenceHandler.GetByFinding)

					evidenceRoutes.GET("/:evidence_id/download",
						middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
						evidenceHandler.Download)

					evidenceRoutes.POST("",
						middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RolePentester),
						evidenceHandler.Upload)

					evidenceRoutes.DELETE("/:evidence_id",
						middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RolePentester),
						evidenceHandler.Delete)
				}
			}
		}
	}

	notificationRoutes := api.Group("/notifications")
	notificationRoutes.Use(authMw)
	{
		notificationRoutes.GET("", notificationHandler.GetAll)
		notificationRoutes.PUT("/read-all", notificationHandler.MarkAllRead)
		notificationRoutes.PUT("/:id/read", notificationHandler.MarkRead)
		notificationRoutes.DELETE("/:id", notificationHandler.Delete)
	}

	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("[SERVER] Listening on %s (mode: %s)", addr, cfg.GinMode)

	if err := router.Run(addr); err != nil {
		log.Fatalf("[FATAL] Server: %v", err)
	}
}
