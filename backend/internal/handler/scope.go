package handler

import (
	"net/http"

	"vault-of-evidence/backend/internal/model"
	"vault-of-evidence/backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func GetScopes(c *gin.Context) {
	var scopes []model.Scope
	if err := repository.DB.Find(&scopes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve scopes"})
		return
	}
	c.JSON(http.StatusOK, scopes)
}

func CreateScope(c *gin.Context) {
	var scope model.Scope
	if err := c.ShouldBindJSON(&scope); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := repository.DB.Create(&scope).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create scope"})
		return
	}

	c.JSON(http.StatusCreated, scope)
}

func DeleteScope(c *gin.Context) {
	id := c.Param("id")

	if err := repository.DB.Delete(&model.Scope{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete scope"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Scope deleted successfully"})
}
