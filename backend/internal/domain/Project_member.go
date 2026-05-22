package domain

import (
	"time"

	"github.com/google/uuid"
)

// ── Project Roles ─────────────────────────────────────────────────────────────
type ProjectRole string

const (
	RolePM        ProjectRole = "pm"
	RoleDev       ProjectRole = "dev"
	RolePentester ProjectRole = "pentester"
)

type ProjectMember struct {
	ProjectID  uuid.UUID   `gorm:"type:uuid;primaryKey"           json:"project_id"`
	UserID     uuid.UUID   `gorm:"type:uuid;primaryKey"           json:"user_id"`
	Role       ProjectRole `gorm:"type:varchar(20);not null"      json:"role"` // <-- INI YANG PALING PENTING
	AssignedBy uuid.UUID   `gorm:"type:uuid;not null"             json:"assigned_by"`
	AssignedAt time.Time   `gorm:"not null;default:now()"         json:"assigned_at"`

	Project Project `gorm:"foreignKey:ProjectID" json:"project,omitempty"`
	User    User    `gorm:"foreignKey:UserID"    json:"user,omitempty"`
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

// DTO untuk PM saat ingin mengundang teman ke proyek
type InviteMemberRequest struct {
	Username string      `json:"username" binding:"required"` 
	Role     ProjectRole `json:"role"     binding:"required,oneof=pm dev pentester"`
}

type RemoveMemberRequest struct {
	UserID string `json:"user_id" binding:"required,uuid"`
}