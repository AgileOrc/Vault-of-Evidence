package domain

import (
	"time"

	"github.com/google/uuid"
)

// ProjectMember adalah junction table untuk relasi Many-to-Many antara Project dan User.
//
// Kenapa tidak pakai GORM many2many tag langsung?
// Explicit junction model memberi kita kontrol penuh:
// - Bisa tambah field audit (AssignedAt, AssignedBy)
// - Query langsung ke junction table tanpa magic
// - IDOR check lebih mudah diimplementasi di repository layer
type ProjectMember struct {
	ProjectID  uuid.UUID `gorm:"type:uuid;primaryKey"           json:"project_id"`
	UserID     uuid.UUID `gorm:"type:uuid;primaryKey"           json:"user_id"`
	AssignedBy uuid.UUID `gorm:"type:uuid;not null"             json:"assigned_by"`
	AssignedAt time.Time `gorm:"not null;default:now()"         json:"assigned_at"`

	// Preload associations — omitempty supaya tidak muncul kalau tidak di-preload
	Project Project `gorm:"foreignKey:ProjectID" json:"project,omitempty"`
	User    User    `gorm:"foreignKey:UserID"    json:"user,omitempty"`
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

type AssignMemberRequest struct {
	UserID string `json:"user_id" binding:"required,uuid"`
}

type RemoveMemberRequest struct {
	UserID string `json:"user_id" binding:"required,uuid"`
}