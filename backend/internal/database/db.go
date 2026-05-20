package database

import (
	"fmt"
	"log"
	"time"

	"vault-of-evidence/backend/internal/config"
	"vault-of-evidence/backend/internal/domain"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewPostgresConnection(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:      logger.Default.LogMode(logger.Warn),
		PrepareStmt: true, // Semua query otomatis jadi prepared statement → SQL injection impossible
	})
	if err != nil {
		return nil, fmt.Errorf("failed to open DB: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("[DB] Connected to PostgreSQL")
	return db, nil
}

// Ganti fungsi AutoMigrate yang lama dengan ini:
func AutoMigrate(db *gorm.DB) error {
	if err := db.Exec("CREATE EXTENSION IF NOT EXISTS pgcrypto").Error; err != nil {
		return fmt.Errorf("pgcrypto: %w", err)
	}

	if err := db.AutoMigrate(
		&domain.User{},
		&domain.Project{},
		&domain.ProjectMember{},     // NEW
		&domain.PasswordResetToken{}, // NEW
		&domain.Finding{},
		&domain.Evidence{},
	); err != nil {
		return fmt.Errorf("automigrate: %w", err)
	}

	log.Println("[DB] Migration complete")
	return nil
}
