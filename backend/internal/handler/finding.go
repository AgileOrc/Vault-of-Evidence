package handler

import (
	"net/http"

	"vault-of-evidence/backend/internal/model"
	"vault-of-evidence/backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func GetFindings(c *gin.Context) {
	var findings []model.Finding
	if err := repository.DB.Find(&findings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve findings"})
		return
	}
	c.JSON(http.StatusOK, findings)
}

func CreateFinding(c *gin.Context) {
	var finding model.Finding
	if err := c.ShouldBindJSON(&finding); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Default status if empty
	if finding.Status == "" {
		finding.Status = "Open"
	}

	if err := repository.DB.Create(&finding).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create finding"})
		return
	}

	c.JSON(http.StatusCreated, finding)
}
