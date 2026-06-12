package domain

import (
	"time"

	"github.com/google/uuid"
)

type Notification struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null;index"                       json:"user_id"`
	Type      string     `gorm:"type:varchar(50);not null"                      json:"type"`
	Title     string     `gorm:"type:varchar(255);not null"                     json:"title"`
	Message   string     `gorm:"type:text"                                      json:"message"`
	Read      bool       `gorm:"default:false"                                  json:"read"`
	ProjectID *uuid.UUID `gorm:"type:uuid"                                      json:"project_id,omitempty"`
	InviterID *uuid.UUID `gorm:"type:uuid"                                      json:"inviter_id,omitempty"`
	Role      *string    `gorm:"type:varchar(20)"                               json:"role,omitempty"`
	Status    string     `gorm:"type:varchar(20);default:'pending'"             json:"status"`
	CreatedAt time.Time  `json:"created_at"`
}
