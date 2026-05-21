package jwt

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"vault-of-evidence/backend/internal/domain"
)

const CookieName = "voe_session"

var (
	ErrMissingToken = errors.New("missing auth token")
	ErrInvalidToken = errors.New("invalid auth token")
	ErrExpiredToken = errors.New("expired auth token")
)

type Manager struct {
	secret       []byte
	expiry       time.Duration
	secureCookie bool
}

type Claims struct {
	UserID    uuid.UUID       `json:"uid"`
	Username  string          `json:"username"`
	IssuedAt  int64           `json:"iat"`
	ExpiresAt int64           `json:"exp"`
}

type header struct {
	Algorithm string `json:"alg"`
	Type      string `json:"typ"`
}

func NewManager(secret string, expiryHours int, secureCookie bool) *Manager {
	if expiryHours <= 0 {
		expiryHours = 8
	}
	return &Manager{
		secret:       []byte(secret),
		expiry:       time.Duration(expiryHours) * time.Hour,
		secureCookie: secureCookie,
	}
}

func (m *Manager) GenerateToken(user *domain.User) (string, error) {
	if user == nil {
		return "", fmt.Errorf("jwt: nil user")
	}

	now := time.Now().UTC()
	return m.sign(Claims{
		UserID:    user.ID,
		Username:  user.Username,
		IssuedAt:  now.Unix(),
		ExpiresAt: now.Add(m.expiry).Unix(),
	})
}

func (m *Manager) ValidateToken(token string) (*Claims, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, ErrInvalidToken
	}

	headerBytes, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return nil, ErrInvalidToken
	}

	var h header
	if err := json.Unmarshal(headerBytes, &h); err != nil {
		return nil, ErrInvalidToken
	}
	if h.Algorithm != "HS256" || h.Type != "JWT" {
		return nil, ErrInvalidToken
	}

	expectedSig := signBytes(m.secret, parts[0]+"."+parts[1])
	actualSig, err := base64.RawURLEncoding.DecodeString(parts[2])
	if err != nil {
		return nil, ErrInvalidToken
	}
	if !hmac.Equal(actualSig, expectedSig) {
		return nil, ErrInvalidToken
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, ErrInvalidToken
	}

	var claims Claims
	if err := json.Unmarshal(payloadBytes, &claims); err != nil {
		return nil, ErrInvalidToken
	}
	if claims.UserID == uuid.Nil || claims.Username == "" || claims.ExpiresAt == 0 {
		return nil, ErrInvalidToken
	}
	if time.Now().UTC().Unix() >= claims.ExpiresAt {
		return nil, ErrExpiredToken
	}

	return &claims, nil
}

func (m *Manager) SetAuthCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     CookieName,
		Value:    token,
		Path:     "/",
		MaxAge:   int(m.expiry.Seconds()),
		HttpOnly: true,
		Secure:   m.secureCookie,
		SameSite: http.SameSiteLaxMode,
	})
}

func (m *Manager) ClearAuthCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     CookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   m.secureCookie,
		SameSite: http.SameSiteLaxMode,
	})
}

func ExtractFromCookie(r *http.Request) (string, error) {
	cookie, err := r.Cookie(CookieName)
	if err != nil || cookie.Value == "" {
		return "", ErrMissingToken
	}
	return cookie.Value, nil
}

func (m *Manager) sign(claims Claims) (string, error) {
	h := header{Algorithm: "HS256", Type: "JWT"}

	headerBytes, err := json.Marshal(h)
	if err != nil {
		return "", fmt.Errorf("jwt: header: %w", err)
	}
	claimsBytes, err := json.Marshal(claims)
	if err != nil {
		return "", fmt.Errorf("jwt: claims: %w", err)
	}

	headerPart := base64.RawURLEncoding.EncodeToString(headerBytes)
	claimsPart := base64.RawURLEncoding.EncodeToString(claimsBytes)
	signingInput := headerPart + "." + claimsPart
	signaturePart := base64.RawURLEncoding.EncodeToString(signBytes(m.secret, signingInput))

	return signingInput + "." + signaturePart, nil
}

func signBytes(secret []byte, input string) []byte {
	mac := hmac.New(sha256.New, secret)
	_, _ = mac.Write([]byte(input))
	return mac.Sum(nil)
}
