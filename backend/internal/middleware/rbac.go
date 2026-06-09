package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	
	"vault-of-evidence/backend/internal/domain"
)

// RequireProjectRole mengecek jabatan spesifik user di dalam sebuah proyek.
// paramName adalah nama parameter ID proyek di URL (misalnya "id" atau "project_id").
func RequireProjectRole(db *gorm.DB, paramName string, allowed ...domain.ProjectRole) gin.HandlerFunc {
	allowSet := make(map[domain.ProjectRole]struct{}, len(allowed))
	for _, r := range allowed {
		allowSet[r] = struct{}{}
	}

	return func(c *gin.Context) {
		// 1. Siapa yang sedang login? (Ambil ID-nya)
		userID, ok := GetUserID(c)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
			return
		}

		// 2. Proyek mana yang sedang dia coba akses? (Ambil ID proyek dari URL)
		projectIDStr := c.Param(paramName)
		projectID, err := uuid.Parse(projectIDStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid project ID format in URL"})
			return
		}

		// 3. Cek daftar hadir (tabel project_members) di Database!
		var member domain.ProjectMember
		if err := db.Where("project_id = ? AND user_id = ?", projectID, userID).First(&member).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// Ditolak karena tidak terdaftar di proyek ini
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "you do not have access to this project"})
				return
			}
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "database error while verifying permissions"})
			return
		}

		// 4. Cek apakah jabatannya sesuai dengan yang diizinkan untuk fitur ini
		if _, permitted := allowSet[member.Role]; !permitted {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "your role in this project does not permit this action"})
			return
		}

		// (Opsional) Simpan role proyek ini ke dalam memori jika Handler membutuhkannya nanti
		c.Set("ctx_project_role", member.Role)

		c.Next() // Silakan masuk!
	}
}