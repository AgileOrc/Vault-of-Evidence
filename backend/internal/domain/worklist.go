package domain

import (
	"time"

	"github.com/google/uuid"
)

type WorklistStatus string

const (
	WorklistNotStarted WorklistStatus = "not started"
	WorklistInProgress WorklistStatus = "in progress"
	WorklistCompleted  WorklistStatus = "completed"
)

type Worklist struct {
	ID          uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProjectID   uuid.UUID      `gorm:"type:uuid;not null;index"                       json:"project_id"`
	Name        string         `gorm:"type:varchar(255);not null"                     json:"name"`
	Code        string         `gorm:"type:varchar(100)" json:"code"`
	Description string         `gorm:"type:text"                                      json:"description"`
	Status      WorklistStatus `gorm:"type:varchar(20);not null;default:'not started'" json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`

	Findings []Finding `gorm:"foreignKey:WorklistID"                          json:"findings,omitempty"`
}

type CreateWorklistRequest struct {
	Name        string `json:"name"        binding:"required,min=3,max=255"`
	Code        string `json:"code"        binding:"omitempty,max=100"`
	Description string `json:"description" binding:"max=5000"`
}

type UpdateWorklistRequest struct {
	Name        string         `json:"name"        binding:"omitempty,min=3,max=255"`
	Code        string         `json:"code"        binding:"omitempty,max=100"`
	Description string         `json:"description" binding:"omitempty,max=5000"`
	Status      WorklistStatus `json:"status"      binding:"omitempty,oneof='not started' 'in progress' completed"`
}
