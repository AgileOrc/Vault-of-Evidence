package model

import (
	"gorm.io/gorm"
)

// User represents a system user (Security Analyst, Admin, etc.)
type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `gorm:"uniqueIndex" json:"email"`
	Password string `json:"-"` // Don't return password in JSON
	Role     string `json:"role"`
}

// Finding represents a vulnerability or security finding
type Finding struct {
	gorm.Model
	Title        string  `json:"title"`
	Severity     string  `json:"severity"` // Critical, High, Medium, Low, Informational
	CVSS         float64 `json:"cvss"`
	Endpoints    string  `json:"endpoints"` // Comma-separated or JSON array string
	Description  string  `json:"description"`
	Reproduction string  `json:"reproduction"`
	Impact       string  `json:"impact"`
	Remediation  string  `json:"remediation"`
	Status       string  `json:"status"` // Open, In Review, Fixed
}

// Task represents a Worklist task
type Task struct {
	gorm.Model
	Title      string `json:"title"`
	Tag        string `json:"tag"`      // Planning, Reconnaissance, Active Testing, etc.
	Priority   string `json:"priority"` // Critical, High, Medium, Low
	Status     string `json:"status"`   // To Do, In Progress, Completed
	AssigneeID uint   `json:"assignee_id"`
}

// Scope represents a testing target (URL, IP, CIDR, etc.)
type Scope struct {
	gorm.Model
	Name        string `json:"name"`
	Target      string `json:"target"`
	Type        string `json:"type"` // e.g., Web, CIDR, Mobile App
	Description string `json:"description"`
}
