package domain

import (
	"time"

	"github.com/google/uuid"
)

// PasswordResetToken menyimpan token reset password.
//
// SECURITY DESIGN — Kenapa token di-hash sebelum disimpan?
//
// Analoginya sama dengan password:
// Kalau database bocor (SQL injection, backup leak, insider threat),
// attacker yang dapat raw token bisa langsung reset password siapapun.
// Dengan menyimpan SHA-256(token), attacker hanya dapat hash — tidak berguna
// tanpa raw token yang hanya ada di email user.
//
// Flow:
//   1. Generate raw token (32 bytes crypto/rand) → kirim ke email user
//   2. SHA-256(raw token) → simpan di DB
//   3. User klik link dengan raw token
//   4. Server SHA-256(raw token dari request) → bandingkan dengan DB
//   5. Match → izinkan reset, delete token
type PasswordResetToken struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index"                       json:"-"`
	// TokenHash: SHA-256 dari raw token — BUKAN raw token itu sendiri
	TokenHash string    `gorm:"type:varchar(64);uniqueIndex;not null"          json:"-"`
	// ExpiresAt: 15 menit dari created — enforced di application layer DAN bisa di-index
	ExpiresAt time.Time `gorm:"not null;index"                                 json:"-"`
	Used      bool      `gorm:"not null;default:false"                         json:"-"`
	CreatedAt time.Time `json:"-"`

	User User `gorm:"foreignKey:UserID" json:"-"`
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	// Token: raw token dari URL (bukan hash)
	Token       string `json:"token"        binding:"required,min=32"`
	NewPassword string `json:"new_password" binding:"required,min=12,max=128"`
}