package notification

import (
	"vault-of-evidence/backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(n *domain.Notification) error
	FindByUser(userID uuid.UUID) ([]domain.Notification, error)
	FindByID(id string) (*domain.Notification, error)
	Update(n *domain.Notification) error
	MarkAllRead(userID uuid.UUID) error
	UnreadCount(userID uuid.UUID) (int64, error)
	HasPendingInvite(projectID, userID uuid.UUID) (bool, error)
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(n *domain.Notification) error {
	return r.db.Create(n).Error
}

func (r *repository) FindByUser(userID uuid.UUID) ([]domain.Notification, error) {
	var notifs []domain.Notification
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&notifs).Error
	return notifs, err
}

func (r *repository) FindByID(id string) (*domain.Notification, error) {
	var n domain.Notification
	if err := r.db.Where("id = ?", id).First(&n).Error; err != nil {
		return nil, err
	}
	return &n, nil
}

func (r *repository) Update(n *domain.Notification) error {
	return r.db.Save(n).Error
}

func (r *repository) MarkAllRead(userID uuid.UUID) error {
	return r.db.Model(&domain.Notification{}).
		Where("user_id = ? AND read = false", userID).
		Update("read", true).Error
}

func (r *repository) UnreadCount(userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&domain.Notification{}).
		Where("user_id = ? AND read = false", userID).
		Count(&count).Error
	return count, err
}

func (r *repository) HasPendingInvite(projectID, userID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.Model(&domain.Notification{}).
		Where("project_id = ? AND user_id = ? AND type = 'invitation' AND status = 'pending'", projectID, userID).
		Count(&count).Error
	return count > 0, err
}
