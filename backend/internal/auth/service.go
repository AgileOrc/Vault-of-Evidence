package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/password"
)

var (
	ErrEmailExists    = errors.New("email already registered")
	ErrUsernameExists = errors.New("username already taken")
	ErrInvalidCreds   = errors.New("invalid credentials")
	ErrUserNotFound   = errors.New("user not found")
	ErrInvalidToken   = errors.New("invalid or expired reset token")
)

type Service interface {
	Signup(req *domain.SignupRequest) (*domain.User, error)
	Login(req *domain.LoginRequest) (*domain.User, error)
	ChangePassword(userID, currentPw, newPw string) error
	GetUserByID(id string) (*domain.User, error)
	ForgotPassword(email string) (string, error)
	ResetPassword(rawToken, newPassword string) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Signup(req *domain.SignupRequest) (*domain.User, error) {
	if s.repo.EmailExists(req.Email) {
		return nil, ErrEmailExists
	}
	if s.repo.UsernameExists(req.Username) {
		return nil, ErrUsernameExists
	}

	hash, err := password.Hash(req.Password)
	if err != nil {
		return nil, fmt.Errorf("signup: hash: %w", err)
	}

	user := &domain.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hash,
	}

	if err := s.repo.CreateUser(user); err != nil {
		return nil, fmt.Errorf("signup: db: %w", err)
	}
	return user, nil
}

func (s *service) Login(req *domain.LoginRequest) (*domain.User, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("login: db: %w", err)
	}

	if user == nil {
		_ = password.Verify(req.Password, "$argon2id$v=19$m=65536,t=1,p=4$ZHVtbXlzYWx0ZHVtbXk$ZHVtbXloYXNoZHVtbXloYXNo")
		return nil, ErrInvalidCreds
	}

	if err := password.Verify(req.Password, user.PasswordHash); err != nil {
		return nil, ErrInvalidCreds
	}
	return user, nil
}

func (s *service) ChangePassword(userID, currentPw, newPw string) error {
	user, err := s.repo.FindByID(userID)
	if err != nil || user == nil {
		return ErrUserNotFound
	}
	if err := password.Verify(currentPw, user.PasswordHash); err != nil {
		return ErrInvalidCreds
	}
	newHash, err := password.Hash(newPw)
	if err != nil {
		return fmt.Errorf("change-password: hash: %w", err)
	}
	return s.repo.UpdatePasswordHash(userID, newHash)
}

// Service baru untuk Endpoint /me
func (s *service) GetUserByID(id string) (*domain.User, error) {
	return s.repo.FindByID(id)
}

func (s *service) ForgotPassword(email string) (string, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", fmt.Errorf("forgot-password: db: %w", err)
	}
	// Security: jangan reveal apakah email terdaftar atau tidak
	if user == nil {
		return "", nil
	}

	// Generate 32 byte random token
	rawBytes := make([]byte, 32)
	if _, err := rand.Read(rawBytes); err != nil {
		return "", fmt.Errorf("forgot-password: rand: %w", err)
	}
	rawToken := hex.EncodeToString(rawBytes)

	// Hash token sebelum simpan ke DB (security best practice)
	hash := sha256.Sum256([]byte(rawToken))
	tokenHash := hex.EncodeToString(hash[:])

	resetToken := &domain.PasswordResetToken{
		UserID:    user.ID,
		TokenHash: tokenHash,
		ExpiresAt: time.Now().UTC().Add(15 * time.Minute),
		Used:      false,
	}

	if err := s.repo.CreateResetToken(resetToken); err != nil {
		return "", fmt.Errorf("forgot-password: save token: %w", err)
	}

	return rawToken, nil
}

func (s *service) ResetPassword(rawToken, newPassword string) error {
	// Hash raw token untuk dicocokkan dengan DB
	hash := sha256.Sum256([]byte(rawToken))
	tokenHash := hex.EncodeToString(hash[:])

	resetToken, err := s.repo.FindResetToken(tokenHash)
	if err != nil {
		return fmt.Errorf("reset-password: db: %w", err)
	}
	if resetToken == nil {
		return ErrInvalidToken
	}

	// Hash password baru
	newHash, err := password.Hash(newPassword)
	if err != nil {
		return fmt.Errorf("reset-password: hash: %w", err)
	}

	// Update password user
	if err := s.repo.UpdatePasswordHash(resetToken.UserID.String(), newHash); err != nil {
		return fmt.Errorf("reset-password: update pw: %w", err)
	}

	// Tandai token sudah dipakai
	if err := s.repo.MarkResetTokenUsed(resetToken.ID.String()); err != nil {
		return fmt.Errorf("reset-password: mark used: %w", err)
	}

	return nil
}
