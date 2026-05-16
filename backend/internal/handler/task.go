package handler

import (
	"net/http"

	"vault-of-evidence/backend/internal/model"
	"vault-of-evidence/backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func GetTasks(c *gin.Context) {
	var tasks []model.Task
	if err := repository.DB.Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tasks"})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

func CreateTask(c *gin.Context) {
	var task model.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Default status if empty
	if task.Status == "" {
		task.Status = "To Do"
	}

	if err := repository.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}
