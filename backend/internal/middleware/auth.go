package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"vault-of-evidence/backend/internal/domain"
	jwtpkg "vault-of-evidence/backend/internal/pkg/jwt"
)

const (
	CtxUserID   = "ctx_user_id"
	CtxUsername = "ctx_username"
	CtxUserRole = "ctx_user_role"
)

func AuthRequired(jwtManager *jwtpkg.Manager) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr, err := jwtpkg.ExtractFromCookie(c.Request)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
			return
		}

		claims, err := jwtManager.ValidateToken(tokenStr)
		if err != nil {
			// Error generic — tidak bocorkan apakah token expired atau tampered
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired session"})
			return
		}

		c.Set(CtxUserID, claims.UserID)
		c.Set(CtxUsername, claims.Username)
		c.Set(CtxUserRole, claims.Role)
		c.Next()
	}
}

func GetUserID(c *gin.Context) (uuid.UUID, bool) {
	v, exists := c.Get(CtxUserID)
	if !exists {
		return uuid.Nil, false
	}
	id, ok := v.(uuid.UUID)
	return id, ok
}

func GetUserRole(c *gin.Context) (domain.UserRole, bool) {
	v, exists := c.Get(CtxUserRole)
	if !exists {
		return "", false
	}
	role, ok := v.(domain.UserRole)
	return role, ok
}
