package finding

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"vault-of-evidence/backend/internal/domain"
)

type Handler struct{ service Service }

func NewHandler(service Service) *Handler { return &Handler{service: service} }

// Routes di-register di bawah /projects/:id/findings
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("", h.GetByProject)
	rg.POST("", h.Create)
	rg.GET("/:finding_id", h.GetByID)
	rg.PUT("/:finding_id", h.Update)
	rg.DELETE("/:finding_id", h.Delete)
}

func (h *Handler) GetByProject(c *gin.Context) {
	findings, err := h.service.GetByProject(projectIDParam(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch findings"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": findings})
}

func (h *Handler) Create(c *gin.Context) {
	var req domain.CreateFindingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	f, err := h.service.Create(projectIDParam(c), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create finding"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": f})
}

func projectIDParam(c *gin.Context) string {
	if projectID := c.Param("project_id"); projectID != "" {
		return projectID
	}
	return c.Param("id")
}

func (h *Handler) GetByID(c *gin.Context) {
	f, err := h.service.GetByID(c.Param("finding_id"))
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "finding not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch finding"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": f})
}

func (h *Handler) Update(c *gin.Context) {
	var req domain.UpdateFindingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	f, err := h.service.Update(c.Param("finding_id"), &req)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "finding not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update finding"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": f})
}

func (h *Handler) Delete(c *gin.Context) {
	if err := h.service.Delete(c.Param("finding_id")); err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "finding not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete finding"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "finding deleted"})
}
