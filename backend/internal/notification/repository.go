package notification

import (
	"vault-of-evidence/backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	FindByUser(userID uuid.UUID) ([]domain.Notification, error)
	MarkRead(id, userID uuid.UUID) error
	MarkAllRead(userID uuid.UUID) error
	Delete(id, userID uuid.UUID) error
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) FindByUser(userID uuid.UUID) ([]domain.Notification, error) {
	var notifications []domain.Notification
	err := r.db.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(50).
		Find(&notifications).Error
	return notifications, err
}

func (r *repository) MarkRead(id, userID uuid.UUID) error {
	return r.db.Model(&domain.Notification{}).
		Where("id = ? AND user_id = ?", id, userID).
		Update("read", true).Error
}

func (r *repository) MarkAllRead(userID uuid.UUID) error {
	return r.db.Model(&domain.Notification{}).
		Where("user_id = ? AND read = ?", userID, false).
		Update("read", true).Error
}

func (r *repository) Delete(id, userID uuid.UUID) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).
		Delete(&domain.Notification{}).Error
}
