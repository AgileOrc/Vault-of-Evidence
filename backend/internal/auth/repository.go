package auth

import (
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
	"vault-of-evidence/backend/internal/domain"
)

type Repository interface {
	CreateUser(user *domain.User) error
	FindByEmail(email string) (*domain.User, error)
	FindByID(id string) (*domain.User, error)
	UpdatePasswordHash(userID, hash string) error
	EmailExists(email string) bool
	UsernameExists(username string) bool
	CreateResetToken(token *domain.PasswordResetToken) error
	FindResetToken(tokenHash string) (*domain.PasswordResetToken, error)
	MarkResetTokenUsed(id string) error
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) CreateUser(user *domain.User) error {
	if err := r.db.Create(user).Error; err != nil {
		return fmt.Errorf("auth.repo: create user: %w", err)
	}
	return nil
}

func (r *repository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) FindByID(id string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("id = ?", id).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) UpdatePasswordHash(userID, hash string) error {
	return r.db.Model(&domain.User{}).Where("id = ?", userID).
		Update("password_hash", hash).Error
}

func (r *repository) EmailExists(email string) bool {
	var count int64
	r.db.Model(&domain.User{}).Where("email = ?", email).Count(&count)
	return count > 0
}

func (r *repository) UsernameExists(username string) bool {
	var count int64
	r.db.Model(&domain.User{}).Where("username = ?", username).Count(&count)
	return count > 0
}

func (r *repository) CreateResetToken(token *domain.PasswordResetToken) error {
	return r.db.Create(token).Error
}

func (r *repository) FindResetToken(tokenHash string) (*domain.PasswordResetToken, error) {
	var token domain.PasswordResetToken
	err := r.db.Preload("User").
		Where("token_hash = ? AND used = ? AND expires_at > ?", tokenHash, false, time.Now().UTC()).
		First(&token).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (r *repository) MarkResetTokenUsed(id string) error {
	return r.db.Model(&domain.PasswordResetToken{}).Where("id = ?", id).
		Update("used", true).Error
}
