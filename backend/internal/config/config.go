package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	ServerPort          string
	GinMode             string
	DBHost              string
	DBPort              string
	DBUser              string
	DBPassword          string
	DBName              string
	DBSSLMode           string
	JWTSecret           string
	JWTExpiryHours      int
	AllowedOrigin       string
	EvidenceStoragePath string
	MaxUploadSizeMB     int64
}

func Load() (*Config, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if len(jwtSecret) < 32 {
		return nil, fmt.Errorf("JWT_SECRET must be at least 32 characters")
	}

	jwtExpiry, err := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "8"))
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_EXPIRY_HOURS: %w", err)
	}

	maxUpload, err := strconv.ParseInt(getEnv("MAX_UPLOAD_SIZE_MB", "10"), 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid MAX_UPLOAD_SIZE_MB: %w", err)
	}

	return &Config{
		ServerPort:          getEnv("SERVER_PORT", "8080"),
		GinMode:             getEnv("GIN_MODE", "debug"),
		DBHost:              getEnv("DB_HOST", "localhost"),
		DBPort:              getEnv("DB_PORT", "5432"),
		DBUser:              getEnv("DB_USER", "postgres"),
		DBPassword:          os.Getenv("DB_PASSWORD"),
		DBName:              getEnv("DB_NAME", "voe_db"),
		DBSSLMode:           getEnv("DB_SSLMODE", "disable"),
		JWTSecret:           jwtSecret,
		JWTExpiryHours:      jwtExpiry,
		AllowedOrigin:       getEnv("ALLOWED_ORIGIN", "http://localhost:5173"),
		EvidenceStoragePath: getEnv("EVIDENCE_STORAGE_PATH", "./storage/evidence"),
		MaxUploadSizeMB:     maxUpload,
	}, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
