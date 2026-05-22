package auth

import (
	"errors"
	"fmt"

	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/password"
)

var (
	ErrEmailExists    = errors.New("email already registered")
	ErrUsernameExists = errors.New("username already taken")
	ErrInvalidCreds   = errors.New("invalid credentials")
	ErrUserNotFound   = errors.New("user not found")
)

type Service interface {
	Signup(req *domain.SignupRequest) (*domain.User, error)
	Login(req *domain.LoginRequest) (*domain.User, error)
	ChangePassword(userID, currentPw, newPw string) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Signup(req *domain.SignupRequest) (*domain.User, error) {
	// Cek duplikasi dulu sebelum Argon2id (operasi mahal) — fail fast
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

	// User enumeration prevention:
	// Return error YANG SAMA baik untuk "email tidak ada" maupun "password salah".
	// Attacker tidak bisa tahu apakah email terdaftar atau tidak.
	if user == nil {
		// Tetap jalankan Verify walaupun user tidak ada → constant-time response
		// Tanpa ini, response time lebih cepat untuk email yang tidak ada → timing leak
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
