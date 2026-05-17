package domain

import (
	"time"

	"github.com/google/uuid"
)

type Evidence struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	FindingID  uuid.UUID `gorm:"type:uuid;not null;index"                       json:"finding_id"`
	FileName   string    `gorm:"type:varchar(255);not null"                     json:"file_name"` // sanitized name
	FilePath   string    `gorm:"type:text;not null"                             json:"-"`         // TIDAK expose ke client
	MimeType   string    `gorm:"type:varchar(100)"                              json:"mime_type"`
	FileSize   int64     `gorm:"not null"                                       json:"file_size"`
	UploadedBy uuid.UUID `gorm:"type:uuid;not null"                             json:"uploaded_by"`
	UploadedAt time.Time `json:"uploaded_at"`
}
