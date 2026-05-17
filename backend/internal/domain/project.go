package domain

import (
	"time"

	"github.com/google/uuid"
)

type ProjectStatus string

const (
	StatusPlanning  ProjectStatus = "planning"
	StatusActive    ProjectStatus = "active"
	StatusCompleted ProjectStatus = "completed"
	StatusArchived  ProjectStatus = "archived"
)

type Project struct {
	ID          uuid.UUID     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name        string        `gorm:"type:varchar(255);not null"                     json:"name"`
	Description string        `gorm:"type:text"                                      json:"description"`
	Status      ProjectStatus `gorm:"type:varchar(20);not null;default:'planning'"   json:"status"`
	StartDate   *time.Time    `gorm:"type:date"                                      json:"start_date,omitempty"`
	EndDate     *time.Time    `gorm:"type:date"                                      json:"end_date,omitempty"`
	CreatedByID uuid.UUID     `gorm:"type:uuid;not null"                             json:"created_by_id"`
	CreatedBy   User          `gorm:"foreignKey:CreatedByID"                         json:"created_by,omitempty"`
	Findings    []Finding     `gorm:"foreignKey:ProjectID"                           json:"findings,omitempty"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
}

type CreateProjectRequest struct {
	Name        string     `json:"name"        binding:"required,min=3,max=255"`
	Description string     `json:"description" binding:"max=5000"`
	StartDate   *time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
}

type UpdateProjectRequest struct {
	Name        string        `json:"name"        binding:"omitempty,min=3,max=255"`
	Description string        `json:"description" binding:"omitempty,max=5000"`
	Status      ProjectStatus `json:"status"      binding:"omitempty,oneof=planning active completed archived"`
	StartDate   *time.Time    `json:"start_date"`
	EndDate     *time.Time    `json:"end_date"`
}
