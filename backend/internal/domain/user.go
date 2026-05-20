package domain

import (
	"time"

	"github.com/google/uuid"
)

type UserRole string

const (
	RoleAdmin     UserRole = "admin"
	RolePentester UserRole = "pentester"
	RoleClient    UserRole = "client"
)

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Username string    `gorm:"type:varchar(50);uniqueIndex;not null"          json:"username"`
	Email    string    `gorm:"type:varchar(255);uniqueIndex;not null"         json:"email"`
	// json:"-" → hash TIDAK PERNAH muncul di response JSON, bahkan kalau handler salah serialize
	PasswordHash string    `gorm:"type:text;not null"                             json:"-"`
	Role         UserRole  `gorm:"type:varchar(20);not null;default:'pentester'"  json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

type SignupRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50,alphanum"`
	Email    string `json:"email"    binding:"required,email,max=255"`
	Password string `json:"password" binding:"required,min=12,max=128"` // min=12 → resist brute force
}

type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password"     binding:"required,min=12,max=128"`
}

// UpdateRoleRequest dipakai admin untuk promote/demote user.
// Role tidak boleh di-set oleh user sendiri — hanya admin via endpoint khusus.
type UpdateRoleRequest struct {
	Role UserRole `json:"role" binding:"required,oneof=admin pentester client"`
}

// ── Response DTO ──────────────────────────────────────────────────────────────

type UserResponse struct {
	ID        uuid.UUID `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Role      UserRole  `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Username:  u.Username,
		Email:     u.Email,
		Role:      u.Role,
		CreatedAt: u.CreatedAt,
	}
}

// ── Admin Request DTOs ────────────────────────────────────────────────────────

type UpdateUserRoleRequest struct {
	Role UserRole `json:"role" binding:"required,oneof=admin pentester client"`
}
