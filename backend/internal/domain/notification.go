package domain

import (
	"time"

	"github.com/google/uuid"
)

type NotificationType string

const (
	NotificationInvitation NotificationType = "invitation"
	NotificationInfo       NotificationType = "info"
)

type Notification struct {
	ID          uuid.UUID        `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID      uuid.UUID        `gorm:"type:uuid;not null;index"                       json:"user_id"`
	Type        NotificationType `gorm:"type:varchar(30);not null"                      json:"type"`
	Title       string           `gorm:"type:varchar(255);not null"                     json:"title"`
	Message     string           `gorm:"type:text"                                      json:"message"`
	Read        bool             `gorm:"not null;default:false;index"                   json:"read"`
	ProjectID   *uuid.UUID       `gorm:"type:uuid;index"                                json:"project_id,omitempty"`
	ProjectName string           `gorm:"type:varchar(255)"                              json:"project_name,omitempty"`
	Role        ProjectRole      `gorm:"type:varchar(20)"                               json:"role,omitempty"`
	InvitedByID *uuid.UUID       `gorm:"type:uuid;index"                                json:"invited_by_id,omitempty"`
	InvitedBy   string           `gorm:"type:varchar(255)"                              json:"invited_by,omitempty"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`

	User User `gorm:"foreignKey:UserID" json:"-"`
}
