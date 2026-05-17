package domain

import (
	"time"

	"github.com/google/uuid"
)

type Severity string

const (
	SeverityCritical      Severity = "critical"
	SeverityHigh          Severity = "high"
	SeverityMedium        Severity = "medium"
	SeverityLow           Severity = "low"
	SeverityInformational Severity = "informational"
)

type Finding struct {
	ID                uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProjectID         uuid.UUID  `gorm:"type:uuid;not null;index"                       json:"project_id"`
	Title             string     `gorm:"type:varchar(255);not null"                     json:"title"`
	Description       string     `gorm:"type:text"                                      json:"description"`
	Severity          Severity   `gorm:"type:varchar(20);not null"                      json:"severity"`
	CVSSScore         float64    `gorm:"type:decimal(4,1);default:0.0"                  json:"cvss_score"`
	AffectedEndpoints string     `gorm:"type:text"                                      json:"affected_endpoints"`
	ReproductionSteps string     `gorm:"type:text"                                      json:"reproduction_steps"`
	Impact            string     `gorm:"type:text"                                      json:"impact"`
	Remediation       string     `gorm:"type:text"                                      json:"remediation"`
	Evidence          []Evidence `gorm:"foreignKey:FindingID"                           json:"evidence,omitempty"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

type CreateFindingRequest struct {
	Title             string   `json:"title"              binding:"required,min=3,max=255"`
	Description       string   `json:"description"        binding:"required,min=10"`
	Severity          Severity `json:"severity"           binding:"required,oneof=critical high medium low informational"`
	CVSSScore         float64  `json:"cvss_score"         binding:"min=0,max=10"`
	AffectedEndpoints string   `json:"affected_endpoints"`
	ReproductionSteps string   `json:"reproduction_steps"`
	Impact            string   `json:"impact"`
	Remediation       string   `json:"remediation"`
}

type UpdateFindingRequest struct {
	Title             string   `json:"title"       binding:"omitempty,min=3,max=255"`
	Description       string   `json:"description" binding:"omitempty,min=10"`
	Severity          Severity `json:"severity"    binding:"omitempty,oneof=critical high medium low informational"`
	CVSSScore         float64  `json:"cvss_score"  binding:"omitempty,min=0,max=10"`
	AffectedEndpoints string   `json:"affected_endpoints"`
	ReproductionSteps string   `json:"reproduction_steps"`
	Impact            string   `json:"impact"`
	Remediation       string   `json:"remediation"`
}
