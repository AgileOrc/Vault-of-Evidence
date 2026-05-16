package repository

import (
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"vault-of-evidence/backend/internal/model"
)

var DB *gorm.DB

func InitDB() {
	var err error
	// Use SQLite database in the local folder "vault.db"
	DB, err = gorm.Open(sqlite.Open("vault.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Automigrate the schemas
	err = DB.AutoMigrate(&model.User{}, &model.Finding{}, &model.Task{})
	if err != nil {
		log.Fatal("Failed to migrate database schema:", err)
	}

	log.Println("✅ Database connected and migrated successfully!")
}
