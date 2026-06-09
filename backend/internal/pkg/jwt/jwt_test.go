package jwt

import (
	"errors"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"vault-of-evidence/backend/internal/domain"
)

func TestGenerateValidateAndSetCookie(t *testing.T) {
	manager := NewManager(strings.Repeat("a", 32), 1, false)
	user := &domain.User{
		ID:       uuid.New(),
		Username: "tester",
	}

	token, err := manager.GenerateToken(user)
	if err != nil {
		t.Fatalf("GenerateToken returned error: %v", err)
	}

	claims, err := manager.ValidateToken(token)
	if err != nil {
		t.Fatalf("ValidateToken returned error: %v", err)
	}
	if claims.UserID != user.ID || claims.Username != user.Username {
		t.Fatalf("claims = %+v, want user %s/%s", claims, user.ID, user.Username)
	}

	response := httptest.NewRecorder()
	manager.SetAuthCookie(response, token)
	cookies := response.Result().Cookies()
	if len(cookies) != 1 || cookies[0].Name != CookieName || cookies[0].Value != token {
		t.Fatalf("unexpected auth cookie: %+v", cookies)
	}
	if !cookies[0].HttpOnly {
		t.Fatal("auth cookie must be HttpOnly")
	}
}

func TestValidateTokenRejectsTampering(t *testing.T) {
	manager := NewManager(strings.Repeat("a", 32), 1, false)
	user := &domain.User{ID: uuid.New(), Username: "tester"}

	token, err := manager.GenerateToken(user)
	if err != nil {
		t.Fatalf("GenerateToken returned error: %v", err)
	}

	tampered := token[:len(token)-1] + "x"
	if err := validateError(manager, tampered); !errors.Is(err, ErrInvalidToken) {
		t.Fatalf("ValidateToken returned %v, want ErrInvalidToken", err)
	}
}

func TestValidateTokenRejectsExpiredToken(t *testing.T) {
	manager := NewManager(strings.Repeat("a", 32), 1, false)
	token, err := manager.sign(Claims{
		UserID:    uuid.New(),
		Username:  "tester",
		IssuedAt:  time.Now().Add(-2 * time.Hour).Unix(),
		ExpiresAt: time.Now().Add(-time.Hour).Unix(),
	})
	if err != nil {
		t.Fatalf("sign returned error: %v", err)
	}

	if err := validateError(manager, token); !errors.Is(err, ErrExpiredToken) {
		t.Fatalf("ValidateToken returned %v, want ErrExpiredToken", err)
	}
}

func validateError(manager *Manager, token string) error {
	_, err := manager.ValidateToken(token)
	return err
}
