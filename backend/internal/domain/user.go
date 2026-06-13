package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Username      string    `gorm:"type:varchar(50);uniqueIndex;not null"          json:"username"`
	Email         string    `gorm:"type:varchar(255);uniqueIndex;not null"         json:"email"`
	PasswordHash  string    `gorm:"type:text;not null"                             json:"-"`
	Nickname      string    `gorm:"type:varchar(100)"                              json:"nickname"`
	Address       string    `gorm:"type:varchar(255)"                              json:"address"`
	ContactNumber string    `gorm:"type:varchar(50)"                               json:"contact_number"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

type SignupRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50,alphanum"`
	Email    string `json:"email"    binding:"required,email,max=255"`
	Password string `json:"password" binding:"required,min=12,max=128"`
}

type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password"     binding:"required,min=12,max=128"`
}

// ── Response DTO ──────────────────────────────────────────────────────────────

type UserResponse struct {
	ID            uuid.UUID `json:"id"`
	Username      string    `json:"username"`
	Email         string    `json:"email"`
	Nickname      string    `json:"nickname"`
	Address       string    `json:"address"`
	ContactNumber string    `json:"contact_number"`
	CreatedAt     time.Time `json:"created_at"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:            u.ID,
		Username:      u.Username,
		Email:         u.Email,
		Nickname:      u.Nickname,
		Address:       u.Address,
		ContactNumber: u.ContactNumber,
		CreatedAt:     u.CreatedAt,
	}
}

type UpdateProfileRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	Username        string `json:"username"         binding:"omitempty,min=3,max=50,alphanum"`
	Nickname        string `json:"nickname"         binding:"omitempty,max=100"`
	Address         string `json:"address"          binding:"omitempty,max=255"`
	ContactNumber   string `json:"contact_number"   binding:"omitempty,max=50"`
}