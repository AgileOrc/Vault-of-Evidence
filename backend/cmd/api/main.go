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
	jwtpkg "vault-of-evidence/backend/internal/pkg/jwt"
	"vault-of-evidence/backend/internal/project"
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

	findingRepo := finding.NewRepository(db)
	findingSvc := finding.NewService(findingRepo)
	findingHandler := finding.NewHandler(findingSvc)

	evidenceRepo := evidence.NewRepository(db)
	evidenceSvc := evidence.NewService(evidenceRepo)
	evidenceHandler := evidence.NewHandler(evidenceSvc, cfg.EvidenceStoragePath, cfg.MaxUploadSizeMB)

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
		c.Header("Access-Control-Allow-Headers", "Content-Type")
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
	authRoutes.Use(authLimiter.Middleware())
	authHandler.RegisterRoutes(authRoutes, authMw)

	projectRoutes := api.Group("/projects")
	projectRoutes.Use(authMw)
	{
		projectRoutes.GET("", projectHandler.GetAll)
		projectRoutes.GET("/:id", projectHandler.GetByID)
		projectRoutes.POST("",
			middleware.RequireRole(domain.RoleAdmin, domain.RolePentester),
			projectHandler.Create)
		projectRoutes.PUT("/:id",
			middleware.RequireRole(domain.RoleAdmin, domain.RolePentester),
			projectHandler.Update)
		projectRoutes.DELETE("/:id",
			middleware.RequireRole(domain.RoleAdmin),
			projectHandler.Delete)

		findingRoutes := projectRoutes.Group("/:id/findings")
		{
			findingRoutes.GET("", findingHandler.GetByProject)
			findingRoutes.GET("/:finding_id", findingHandler.GetByID)
			findingRoutes.POST("",
				middleware.RequireRole(domain.RoleAdmin, domain.RolePentester),
				findingHandler.Create)
			findingRoutes.PUT("/:finding_id",
				middleware.RequireRole(domain.RoleAdmin, domain.RolePentester),
				findingHandler.Update)
			findingRoutes.DELETE("/:finding_id",
				middleware.RequireRole(domain.RoleAdmin, domain.RolePentester),
				findingHandler.Delete)

			evidenceRoutes := findingRoutes.Group("/:finding_id/evidence")
			{
				evidenceRoutes.GET("", evidenceHandler.GetByFinding)
				evidenceRoutes.GET("/:evidence_id/download", evidenceHandler.Download)
				evidenceRoutes.POST("",
					middleware.RequireRole(domain.RoleAdmin, domain.RolePentester),
					evidenceHandler.Upload)
				evidenceRoutes.DELETE("/:evidence_id",
					middleware.RequireRole(domain.RoleAdmin, domain.RolePentester),
					evidenceHandler.Delete)
			}
		}
	}

	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("[SERVER] Listening on %s (mode: %s)", addr, cfg.GinMode)
	if err := router.Run(addr); err != nil {
		log.Fatalf("[FATAL] Server: %v", err)
	}
}
