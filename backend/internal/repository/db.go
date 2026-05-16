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
	err = DB.AutoMigrate(&model.User{}, &model.Finding{}, &model.Task{}, &model.Scope{})
	if err != nil {
		log.Fatal("Failed to migrate database schema:", err)
	}

	seedDummyData()

	log.Println("✅ Database connected and migrated successfully!")
}

func seedDummyData() {
	// Seed Scopes
	var count int64
	DB.Model(&model.Scope{}).Count(&count)
	if count == 0 {
		DB.Create(&model.Scope{Name: "Main Web App", Target: "https://hub.vault.corp", Type: "Web App", Description: "Primary authentication hub"})
		DB.Create(&model.Scope{Name: "Internal DB Server", Target: "10.0.5.20/24", Type: "Network / CIDR", Description: "PostgreSQL databases"})
		DB.Create(&model.Scope{Name: "Android Client", Target: "com.vault.corp.app", Type: "Mobile App", Description: "Latest build v2.4.1"})
		log.Println("✅ Seeded Scopes")
	}

	// Seed Findings
	DB.Model(&model.Finding{}).Count(&count)
	if count == 0 {
		DB.Create(&model.Finding{
			Title:        "SQL Injection in Login Portal",
			Severity:     "Critical",
			CVSS:         9.8,
			Endpoints:    "POST /api/auth/login",
			Description:  "The username field is not sanitized, allowing raw SQL queries to be executed.",
			Reproduction: "1. Go to /login\n2. Enter ' OR 1=1-- in username.",
			Impact:       "An attacker can bypass authentication and access any account.",
			Remediation:  "Use prepared statements for all database queries.",
			Status:       "Open",
		})
		DB.Create(&model.Finding{
			Title:        "Missing Secure Flag on Session Cookie",
			Severity:     "Low",
			CVSS:         3.5,
			Endpoints:    "All Endpoints",
			Description:  "The session cookie is missing the Secure flag.",
			Reproduction: "1. Login to app.\n2. Intercept response, observe Set-Cookie header.",
			Impact:       "Cookie could be intercepted over unencrypted HTTP.",
			Remediation:  "Set the Secure flag on all session cookies.",
			Status:       "Fixed",
		})
		DB.Create(&model.Finding{
			Title:        "Reflected XSS on Search Page",
			Severity:     "Medium",
			CVSS:         6.1,
			Endpoints:    "GET /search?q=",
			Description:  "User input on the search parameter is reflected directly into the HTML without encoding.",
			Reproduction: "1. Navigate to /search?q=<script>alert(1)</script>",
			Impact:       "Attacker can execute arbitrary JavaScript in the victim's browser.",
			Remediation:  "HTML encode user input before reflecting it on the page.",
			Status:       "In Review",
		})
		log.Println("✅ Seeded Findings")
	}

	// Seed Tasks
	DB.Model(&model.Task{}).Count(&count)
	if count == 0 {
		DB.Create(&model.Task{Title: "Run Nmap Scans on 10.0.5.x", Tag: "Reconnaissance", Priority: "High", Status: "Completed"})
		DB.Create(&model.Task{Title: "Fuzz API endpoints on hub.vault.corp", Tag: "Active Testing", Priority: "Critical", Status: "In Progress"})
		DB.Create(&model.Task{Title: "Test password reset token expiry", Tag: "Authorization", Priority: "Medium", Status: "To Do"})
		DB.Create(&model.Task{Title: "Review source code for hardcoded secrets", Tag: "Code Review", Priority: "High", Status: "To Do"})
		log.Println("✅ Seeded Tasks")
	}
}
