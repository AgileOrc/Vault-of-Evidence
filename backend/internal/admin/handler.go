package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	
	"vault-of-evidence/backend/internal/domain"
)

type AdminHandler struct {
	DB *gorm.DB
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{DB: db}
}

// 1. Melihat Semua User (Get All Users)
func (h *AdminHandler) GetAllUsers(c *gin.Context) {
	var users []domain.User
	
	// Kita tidak men-select PasswordHash demi keamanan
	if err := h.DB.Select("id", "username", "email", "role", "created_at").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	// Konversi ke format Response agar rapi
	var response []domain.UserResponse
	for _, u := range users {
		response = append(response, u.ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Users retrieved successfully",
		"data":    response,
	})
}

// 2. Mengubah Role User (Update Role)
func (h *AdminHandler) UpdateUserRole(c *gin.Context) {
	// Tangkap ID user dari URL (misal: /api/admin/users/123e4567-...)
	userIDParam := c.Param("id")
	targetUserID, err := uuid.Parse(userIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Validasi input JSON (apakah role-nya valid)
	var req domain.UpdateUserRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update role di database
	result := h.DB.Model(&domain.User{}).Where("id = ?", targetUserID).Update("role", req.Role)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User role updated successfully",
		"new_role": req.Role,
	})
}