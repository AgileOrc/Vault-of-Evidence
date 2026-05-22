package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/time/rate"

	// Modul admin dihapus karena role global sudah tidak ada
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

	// Inisialisasi adminHandler dihapus

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

	// ─── ROUTING LAYERS ───────────────────────────────────────────────────────

	api := router.Group("/api/v1")

	// 1. Auth Routes
	authRoutes := api.Group("/auth")
	authRoutes.Use(authLimiter.Middleware())
	authHandler.RegisterRoutes(authRoutes, authMw)

	// 2. Project Routes Group
	projectRoutes := api.Group("/projects")
	projectRoutes.Use(authMw)
	{
		projectRoutes.GET("", projectHandler.GetAll)
		projectRoutes.POST("", projectHandler.Create)

		// Sub-Group khusus untuk aksi yang membutuhkan ID Proyek (:id)
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
				
			// singleProject.POST("/invite", middleware.RequireProjectRole(db, "id", domain.RolePM), projectHandler.InviteMember)

// 3. Findings Sub-Group
			findingRoutes := singleProject.Group("/findings")
			{
				// Read (Semua Boleh)
				findingRoutes.GET("",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
					findingHandler.GetByProject)
				findingRoutes.GET("/:finding_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RoleDev, domain.RolePentester),
					findingHandler.GetByID)
				
				// Create (HANYA PM) <--- Pentester dicabut haknya dari sini
				findingRoutes.POST("",
					middleware.RequireProjectRole(db, "id", domain.RolePM),
					findingHandler.Create)
				
				// Update (PM, Pentester, Dev) -> Filternya ada di service.go
				findingRoutes.PUT("/:finding_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM, domain.RolePentester, domain.RoleDev),
					findingHandler.Update)
				
				// Delete (HANYA PM)
				findingRoutes.DELETE("/:finding_id",
					middleware.RequireProjectRole(db, "id", domain.RolePM),
					findingHandler.Delete)

				// 4. Evidence Sub-Group
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

	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("[SERVER] Listening on %s (mode: %s)", addr, cfg.GinMode)
	if err := router.Run(addr); err != nil {
		log.Fatalf("[FATAL] Server: %v", err)
	}
}