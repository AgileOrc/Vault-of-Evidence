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
	rg.POST("/createNewPassword", h.ResetPasswordWithToken)

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

	h.jwtManager.ClearAuthCookie(c.Writer)
	c.JSON(http.StatusOK, gin.H{"message": "password changed, please log in again"})
}

// Handler baru untuk Endpoint /me
func (h *Handler) GetMe(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, err := h.service.GetUserByID(userID.String())
	if err != nil || user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"name":  user.Username,
		"email": user.Email,
	})
}

// Handler untuk Lupa Password — Frontend: POST /api/v1/auth/resetPassword
func (h *Handler) ForgotPassword(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rawToken, err := h.service.ForgotPassword(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process request"})
		return
	}

	// Security: selalu return 200 terlepas email terdaftar atau tidak
	response := gin.H{"message": "If that email is registered, a reset link has been sent."}
	if rawToken != "" {
		// DEV ONLY: sertakan token di response karena belum ada email service
		response["dev_token"] = rawToken
		response["dev_reset_url"] = "http://localhost:5173/CreateNewPassword?token=" + rawToken
	}
	c.JSON(http.StatusOK, response)
}

// Handler untuk Buat Password Baru — Frontend: POST /api/v1/auth/createNewPassword
func (h *Handler) ResetPasswordWithToken(c *gin.Context) {
	// Frontend mengirim {token, password}, bukan {token, new_password}
	var req struct {
		Token    string `json:"token"    binding:"required,min=32"`
		Password string `json:"password" binding:"required,min=12,max=128"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.ResetPassword(req.Token, req.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired reset link."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password has been reset. Please sign in."})
}
