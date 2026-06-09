package domain

import (
	"time"

	"github.com/google/uuid"
)

type Severity string
type FindingStatus string

const (
	SeverityCritical      Severity = "critical"
	SeverityHigh          Severity = "high"
	SeverityMedium        Severity = "medium"
	SeverityLow           Severity = "low"
	SeverityInformational Severity = "informational"
)

const (
	FindingStatusOpen   FindingStatus = "open"
	FindingStatusFixed  FindingStatus = "fixed"
	FindingStatusClosed FindingStatus = "closed"
)

type Finding struct {
	ID                uuid.UUID     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProjectID         uuid.UUID     `gorm:"type:uuid;not null;index"                       json:"project_id"`
	WorklistID        *uuid.UUID    `gorm:"type:uuid;index"                                json:"worklist_id,omitempty"`
	Title             string        `gorm:"type:varchar(255);not null"                     json:"title"`
	Description       string        `gorm:"type:text"                                      json:"description"`
	Severity          Severity      `gorm:"type:varchar(20);not null"                      json:"severity"`
	Status            FindingStatus `gorm:"type:varchar(20);not null;default:'open'"       json:"status"`
	Notes             string        `gorm:"type:text"                                      json:"notes"`
	CVSSScore         float64       `gorm:"type:decimal(4,1);default:0.0"                  json:"cvss_score"`
	CVSSVector        string        `gorm:"type:varchar(255)"                              json:"cvss_vector"`
	WSTGCode          string        `gorm:"type:varchar(100)"                              json:"wstg_code"`
	Contributor       string        `gorm:"type:varchar(255)"                              json:"contributor"`
	AffectedEndpoints string        `gorm:"type:text"                                      json:"affected_endpoints"`
	ReproductionSteps string        `gorm:"type:text"                                      json:"reproduction_steps"`
	Impact            string        `gorm:"type:text"                                      json:"impact"`
	Remediation       string        `gorm:"type:text"                                      json:"remediation"`
	Evidence          []Evidence    `gorm:"foreignKey:FindingID"                           json:"evidence,omitempty"`
	CreatedAt         time.Time     `json:"created_at"`
	UpdatedAt         time.Time     `json:"updated_at"`
}
type CreateFindingRequest struct {
	WorklistID        *uuid.UUID `json:"worklist_id,omitempty"`
	Title             string     `json:"title"              binding:"required,min=3,max=255"`
	Description       string     `json:"description"`
	Severity          Severity   `json:"severity"           binding:"required,oneof=critical high medium low informational"`
	CVSSScore         float64    `json:"cvss_score"         binding:"min=0,max=10"`
	CVSSVector        string     `json:"cvss_vector"`
	WSTGCode          string     `json:"wstg_code"`
	Contributor       string     `json:"contributor"`
	AffectedEndpoints string     `json:"affected_endpoints"`
	ReproductionSteps string     `json:"reproduction_steps"`
	Impact            string     `json:"impact"`
	Remediation       string     `json:"remediation"`
}

type UpdateFindingRequest struct {
	Title             string   `json:"title"       binding:"omitempty,min=3,max=255"`
	Description       string   `json:"description" binding:"omitempty,min=10"`
	Severity          Severity `json:"severity"    binding:"omitempty,oneof=critical high medium low informational"`
	Status            FindingStatus `json:"status"      binding:"omitempty,oneof=open fixed closed"` 
	Notes             string        `json:"notes"       binding:"omitempty"`                         	
	CVSSScore         float64  `json:"cvss_score"  binding:"omitempty,min=0,max=10"`
	AffectedEndpoints string   `json:"affected_endpoints"`
	ReproductionSteps string   `json:"reproduction_steps"`
	Impact            string   `json:"impact"`
	Remediation       string   `json:"remediation"`
}
