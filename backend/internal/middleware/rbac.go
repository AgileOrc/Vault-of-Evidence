package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"vault-of-evidence/backend/internal/domain"
)

// RequireRole: allowlist model — deny by default, grant explicitly.
// Lebih aman dari denylist: role baru default ke no-access.
//
// Usage:
//
//	RequireRole(domain.RoleAdmin)                              → admin only
//	RequireRole(domain.RoleAdmin, domain.RolePentester)        → admin + pentester
func RequireRole(allowed ...domain.UserRole) gin.HandlerFunc {
	allowSet := make(map[domain.UserRole]struct{}, len(allowed))
	for _, r := range allowed {
		allowSet[r] = struct{}{}
	}

	return func(c *gin.Context) {
		role, ok := GetUserRole(c)
		if !ok {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "context unavailable"})
			return
		}
		if _, permitted := allowSet[role]; !permitted {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "permission denied"})
			return
		}
		c.Next()
	}
}
