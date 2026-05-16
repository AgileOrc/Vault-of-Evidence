package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"vault-of-evidence/backend/internal/handler"
	"vault-of-evidence/backend/internal/repository"
)

func main() {
	// 1. Initialize SQLite Database
	repository.InitDB()

	// 2. Setup Gin Router
	r := gin.Default()

	// 3. Configure CORS (allow frontend to communicate)
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	// 4. Register Routes
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Vault API is running!"})
	})

	api := r.Group("/api")
	{
		// Findings Routes
		api.GET("/findings", handler.GetFindings)
		api.POST("/findings", handler.CreateFinding)

		// Tasks (Worklist) Routes
		api.GET("/tasks", handler.GetTasks)
		api.POST("/tasks", handler.CreateTask)
	}

	// 5. Start Server
	log.Println("Starting server on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
