package project

import (
	"errors"
	"net/http"
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/middleware"
	"vault-of-evidence/backend/internal/pkg/pagination"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type NotificationService interface {
	CreateInvite(targetUserID, projectID, inviterID uuid.UUID, projectName, inviterName, role string) error
	HasPendingInvite(projectID, userID uuid.UUID) (bool, error)
}

type Handler struct {
	service  Service
	notifSvc NotificationService
}

func NewHandler(service Service, notifSvc NotificationService) *Handler {
	return &Handler{service: service, notifSvc: notifSvc}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("", h.GetAll)
	rg.POST("", h.Create)

	// WAJIB DI ATAS /:id
	rg.GET("/dashboard/summary", h.GetDashboardSummary)

	rg.GET("/:id", h.GetByID)
	rg.PUT("/:id", h.Update)
	rg.DELETE("/:id", h.Delete)
}

func (h *Handler) GetAll(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	params := pagination.ParseFromContext(c)
	projects, total, err := h.service.GetAll(params, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch projects"})
		return
	}
	c.JSON(http.StatusOK, pagination.NewResponse(projects, params, total))
}

func (h *Handler) Create(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	var req domain.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	p, err := h.service.Create(&req, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create project"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": p})
}

func (h *Handler) GetByID(c *gin.Context) {
	p, err := h.service.GetByID(c.Param("id"))
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch project"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": p})
}

func (h *Handler) Update(c *gin.Context) {
	var req domain.UpdateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	p, err := h.service.Update(c.Param("id"), &req)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update project"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": p})
}

func (h *Handler) Delete(c *gin.Context) {
	if err := h.service.Delete(c.Param("id")); err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete project"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "project deleted"})
}

func (h *Handler) InviteMember(c *gin.Context) {
	projectIDStr := c.Param("id")
	projectID, err := uuid.Parse(projectIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid project ID format"})
		return
	}

	var req domain.InviteMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pmIDVal, exists := c.Get(middleware.CtxUserID)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	pmID := pmIDVal.(uuid.UUID)

	targetUser, err := h.service.InviteMember(projectID, pmID, req)
	if err != nil {
		if err.Error() == "user with this username not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "user is already a member of this project" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to invite member"})
		return
	}

	hasPending, err := h.notifSvc.HasPendingInvite(projectID, targetUser.ID)
	if err == nil && hasPending {
		c.JSON(http.StatusConflict, gin.H{"error": "user already has a pending invitation to this project"})
		return
	}

	p, err := h.service.GetByID(projectIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch project info"})
		return
	}

	inviterName, _ := c.Get(middleware.CtxUsername)
	inviterNameStr, _ := inviterName.(string)

	if err := h.notifSvc.CreateInvite(targetUser.ID, projectID, pmID, p.Name, inviterNameStr, string(req.Role)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to send invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Invitation sent",
		"username": req.Username,
		"role":     req.Role,
	})
}

func (h *Handler) GetDashboardSummary(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	summary, err := h.service.GetDashboardSummary(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch dashboard stats"})
		return
	}

	c.JSON(http.StatusOK, summary)
}
