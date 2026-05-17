package evidence

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"vault-of-evidence/backend/internal/middleware"
)

type Handler struct {
	service     Service
	storagePath string
	maxSizeMB   int64
}

func NewHandler(service Service, storagePath string, maxSizeMB int64) *Handler {
	return &Handler{service: service, storagePath: storagePath, maxSizeMB: maxSizeMB}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("", h.GetByFinding)
	rg.POST("", h.Upload)
	rg.GET("/:evidence_id/download", h.Download)
	rg.DELETE("/:evidence_id", h.Delete)
}

func (h *Handler) Upload(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	// Gin membatasi ukuran di sini juga (double-check sebelum baca file)
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, h.maxSizeMB*1024*1024)

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}
	defer file.Close()

	ev, err := h.service.Upload(UploadInput{
		FindingID:   c.Param("finding_id"),
		UploadedBy:  userID,
		File:        file,
		Header:      header,
		StoragePath: h.storagePath,
		MaxSizeMB:   h.maxSizeMB,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": ev})
}

func (h *Handler) GetByFinding(c *gin.Context) {
	evs, err := h.service.GetByFinding(c.Param("finding_id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch evidence"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": evs})
}

func (h *Handler) Download(c *gin.Context) {
	// Path file di-resolve dari DB — BUKAN dari user input.
	// Path traversal tidak mungkin karena tidak ada string user yang masuk ke filepath.
	ev, err := h.service.GetByID(c.Param("evidence_id"))
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "evidence not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch evidence"})
		return
	}

	// Set MIME type dari DB record (divalidasi saat upload) — bukan dari file extension
	c.Header("Content-Type", ev.MimeType)
	c.Header("Content-Disposition", "attachment; filename=\""+ev.FileName+"\"")
	c.Header("X-Content-Type-Options", "nosniff")
	c.File(ev.FilePath)
}

func (h *Handler) Delete(c *gin.Context) {
	if err := h.service.Delete(c.Param("evidence_id")); err != nil {
		if errors.Is(err, ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "evidence not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete evidence"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "evidence deleted"})
}
