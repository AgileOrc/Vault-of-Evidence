package auth

import (
	"errors"
	"net/http"

	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/middleware"
	jwtpkg "vault-of-evidence/backend/internal/pkg/jwt"

	"github.com/gin-gonic/gin"
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
	
	// Reset password (public - tidak butuh login)
	rg.POST("/resetPassword", h.ForgotPassword)
	rg.POST("/createNewPassword", h.ResetPassword)

	// Butuh login
	rg.POST("/change-password", authMw, h.ChangePassword)
	rg.GET("/me", authMw, h.GetMe)
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
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "user created", "user": user.ToResponse()})
}

func (h *Handler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.Login(&req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	if err := h.jwtManager.SetAuthCookie(c.Writer, user.ID, user.Username); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to set session"})
		return
	}

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

	h.jwtManager.ClearAuthCookie(c.Writer)
	c.JSON(http.StatusOK, gin.H{"message": "password changed, please log in again"})
}

func (h *Handler) GetMe(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	user, err := h.service.GetUserByID(userID.String())
	if err != nil || user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, user.ToResponse())
}

func (h *Handler) ForgotPassword(c *gin.Context) {
	var req domain.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.service.ForgotPassword(&req)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Email records not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate reset link"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "reset link successfully generated"})
}

func (h *Handler) ResetPassword(c *gin.Context) {
	var req domain.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.ResetPassword(&req); err != nil {
		if errors.Is(err, ErrInvalidToken) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "token is invalid or has expired"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to reset password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "password updated successfully"})
}