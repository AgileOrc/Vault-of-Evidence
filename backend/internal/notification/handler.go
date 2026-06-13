package notification

import (
	"net/http"

	"vault-of-evidence/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

type Handler struct{ service Service }

func NewHandler(service Service) *Handler { return &Handler{service: service} }

func (h *Handler) GetAll(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	notifs, err := h.service.GetForUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch notifications"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": notifs})
}

func (h *Handler) UnreadCount(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	count, err := h.service.UnreadCount(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to count notifications"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func (h *Handler) Accept(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if err := h.service.Accept(c.Param("id"), userID); err != nil {
		switch err {
		case ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "notification not found"})
		case ErrForbidden:
			c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
		case ErrAlreadyDone:
			c.JSON(http.StatusConflict, gin.H{"error": "invitation already processed"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to accept invitation"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "invitation accepted"})
}

func (h *Handler) Deny(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if err := h.service.Deny(c.Param("id"), userID); err != nil {
		switch err {
		case ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "notification not found"})
		case ErrForbidden:
			c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
		case ErrAlreadyDone:
			c.JSON(http.StatusConflict, gin.H{"error": "invitation already processed"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to deny invitation"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "invitation denied"})
}

func (h *Handler) MarkRead(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if err := h.service.MarkRead(c.Param("id"), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to mark as read"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "marked as read"})
}

func (h *Handler) MarkAllRead(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if err := h.service.MarkAllRead(userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to mark all as read"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "all marked as read"})
}
