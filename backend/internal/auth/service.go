package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"time"

	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/password"
)

var (
	ErrEmailExists    = errors.New("email already registered")
	ErrUsernameExists = errors.New("username already taken")
	ErrInvalidCreds   = errors.New("invalid credentials")
	ErrUserNotFound   = errors.New("user not found")
	ErrInvalidToken   = errors.New("token is invalid or has expired")
)

type Service interface {
	Signup(req *domain.SignupRequest) (*domain.User, error)
	Login(req *domain.LoginRequest) (*domain.User, error)
	ChangePassword(userID, currentPw, newPw string) error
	GetUserByID(id string) (*domain.User, error)
	UpdateProfile(userID string, req *domain.UpdateProfileRequest) (*domain.User, error)

	// Tambahan Fitur Logika Bisnis Reset Password
	ForgotPassword(req *domain.ForgotPasswordRequest) (string, error)
	ResetPassword(req *domain.ResetPasswordRequest) error
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

func (s *service) GetUserByID(id string) (*domain.User, error) {
	return s.repo.FindByID(id)
}

func (s *service) UpdateProfile(userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	user, err := s.repo.FindByID(userID)
	if err != nil || user == nil {
		return nil, ErrUserNotFound
	}

	if req.Username != "" && req.Username != user.Username {
		if s.repo.UsernameExists(req.Username) {
			return nil, ErrUsernameExists
		}
		user.Username = req.Username
	}
	if req.Nickname != "" {
		user.Nickname = req.Nickname
	}
	if req.Address != "" {
		user.Address = req.Address
	}
	if req.ContactNumber != "" {
		user.ContactNumber = req.ContactNumber
	}

	if err := s.repo.UpdateUser(user); err != nil {
		return nil, fmt.Errorf("auth.service: update profile: %w", err)
	}
	return user, nil
}

// Tahap 1: Generate Token Aman dan Catat ke Console Terminal
func (s *service) ForgotPassword(req *domain.ForgotPasswordRequest) (string, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", ErrUserNotFound
	}

	// Generate 32 bytes secure crypto raw token
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	rawToken := hex.EncodeToString(b)

	// Sesuai rancangan keamanan: SHA-256 hash raw token sebelum masuk database
	hash := sha256.Sum256([]byte(rawToken))
	tokenHash := hex.EncodeToString(hash[:])

	resetToken := &domain.PasswordResetToken{
		UserID:    user.ID,
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(15 * time.Minute),
		Used:      false,
	}

	if err := s.repo.CreateResetToken(resetToken); err != nil {
		return "", err
	}

	// KARENA BELUM ADA SMTP EMAIL: Cetak link token di log terminal backend agar bisa kamu copy-paste saat uji coba!
	log.Printf("\n[SECURITY AUDIT] Password Reset Triggered for: %s\nSimulate clicking this link in frontend:\nhttp://localhost:5173/CreateNewPassword?token=%s\n", user.Email, rawToken)

	return rawToken, nil
}

// Tahap 2: Validasi Token dari URL dan Perbarui Password Hash
func (s *service) ResetPassword(req *domain.ResetPasswordRequest) error {
	// Konversi raw token request menjadi SHA-256 untuk dicocokkan dengan DB
	hash := sha256.Sum256([]byte(req.Token))
	tokenHash := hex.EncodeToString(hash[:])

	tokenRecord, err := s.repo.FindResetTokenByHash(tokenHash)
	if err != nil {
		return err
	}
	if tokenRecord == nil || tokenRecord.ExpiresAt.Before(time.Now()) || tokenRecord.Used {
		return ErrInvalidToken
	}

	// Hash password baru menggunakan Argon2id
	newHash, err := password.Hash(req.NewPassword)
	if err != nil {
		return err
	}

	// Ganti password hash lama di database pengguna
	if err := s.repo.UpdatePasswordHash(tokenRecord.UserID.String(), newHash); err != nil {
		return err
	}

	// Tandai token telah digunakan (Pencegahan Replay Attack)
	tokenRecord.Used = true
	return s.repo.UpdateResetToken(tokenRecord)
}