package worklist

import (
	"errors"
	"net/http"
	"github.com/gin-gonic/gin"
	"vault-of-evidence/backend/internal/domain"
)

type Handler struct{ service Service }

func NewHandler(service Service) *Handler { return &Handler{service: service} }

// Di-register di bawah rute: /projects/:project_id/worklists
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("", h.GetByProject)
	rg.POST("", h.Create)
	rg.GET("/:worklist_id", h.GetByID)
	rg.PUT("/:worklist_id", h.Update)
	rg.DELETE("/:worklist_id", h.Delete)
}

func projectIDParam(c *gin.Context) string {
	if pid := c.Param("project_id"); pid != "" { return pid }
	return c.Param("id")
}

func (h *Handler) GetByProject(c *gin.Context) {
	worklists, err := h.service.GetByProject(c.Param("project_id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch worklists"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": worklists})
}

func (h *Handler) Create(c *gin.Context) {
	var req domain.CreateWorklistRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	w, err := h.service.Create(c.Param("project_id"), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create worklist"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": w})
}

func (h *Handler) GetByID(c *gin.Context) {
	w, err := h.service.GetByID(projectIDParam(c), c.Param("worklist_id"))
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "worklist not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch worklist"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": w})
}

func (h *Handler) Update(c *gin.Context) {
	var req domain.UpdateWorklistRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	w, err := h.service.Update(projectIDParam(c), c.Param("worklist_id"), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update worklist"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": w})
}

func (h *Handler) Delete(c *gin.Context) {
	if err := h.service.Delete(projectIDParam(c), c.Param("worklist_id")); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete worklist"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "worklist deleted"})
}