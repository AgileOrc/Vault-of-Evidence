package auth

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/middleware"
	jwtpkg "vault-of-evidence/backend/internal/pkg/jwt"
)

type Handler struct {
	service    Service
	jwtManager *jwtpkg.Manager
}

func NewHandler(service Service, jwtManager *jwtpkg.Manager) *Handler {
	return &Handler{service: service, jwtManager: jwtManager}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMw gin.HandlerFunc) {
	rg.POST("/signup", h.Signup)
	rg.POST("/login", h.Login)
	rg.POST("/logout", h.Logout)
	rg.POST("/change-password", authMw, h.ChangePassword)
}

func (h *Handler) Signup(c *gin.Context) {
	var req domain.SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.Signup(&req)
	if err != nil {
		switch {
		case errors.Is(err, ErrEmailExists):
			c.JSON(http.StatusConflict, gin.H{"error": "email already registered"})
		case errors.Is(err, ErrUsernameExists):
			c.JSON(http.StatusConflict, gin.H{"error": "username already taken"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "registration failed"})
		}
		return
	}

	token, err := h.jwtManager.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token generation failed"})
		return
	}

	h.jwtManager.SetAuthCookie(c.Writer, token)
	c.JSON(http.StatusCreated, gin.H{"message": "account created", "user": user.ToResponse()})
}

func (h *Handler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.Login(&req)
	if err != nil {
		if errors.Is(err, ErrInvalidCreds) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "login failed"})
		return
	}

	token, err := h.jwtManager.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token generation failed"})
		return
	}

	h.jwtManager.SetAuthCookie(c.Writer, token)
	c.JSON(http.StatusOK, gin.H{"message": "login successful", "user": user.ToResponse()})
}

func (h *Handler) Logout(c *gin.Context) {
	h.jwtManager.ClearAuthCookie(c.Writer)
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

func (h *Handler) ChangePassword(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	var req domain.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.ChangePassword(userID.String(), req.CurrentPassword, req.NewPassword); err != nil {
		switch {
		case errors.Is(err, ErrInvalidCreds):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "current password incorrect"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "password change failed"})
		}
		return
	}

	// Invalidate session setelah password change — paksa login ulang
	h.jwtManager.ClearAuthCookie(c.Writer)
	c.JSON(http.StatusOK, gin.H{"message": "password changed, please log in again"})
}
