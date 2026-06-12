package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	jwtpkg "vault-of-evidence/backend/internal/pkg/jwt"
)

const (
	CtxUserID   = "ctx_user_id"
	CtxUsername = "ctx_username"
	// CtxUserRole dihapus dari sini
)

func AuthRequired(jwtManager *jwtpkg.Manager) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr, err := jwtpkg.ExtractFromCookie(c.Request)
		if err != nil {
			// fallback: Authorization: Bearer <token>
			if h := c.GetHeader("Authorization"); strings.HasPrefix(h, "Bearer ") {
				tokenStr = strings.TrimPrefix(h, "Bearer ")
				err = nil
			}
		}
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
			return
		}

		claims, err := jwtManager.ValidateToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired session"})
			return
		}

		c.Set(CtxUserID, claims.UserID)
		c.Set(CtxUsername, claims.Username)
		// c.Set(CtxUserRole, claims.Role) <-- Dihapus
		
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

// Fungsi GetUserRole() DIHAPUS SEPENUHNYA