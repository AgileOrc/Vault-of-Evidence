package notification

import (
	"vault-of-evidence/backend/internal/domain"

	"github.com/google/uuid"
)

type Service interface {
	GetByUser(userID uuid.UUID) ([]domain.Notification, error)
	MarkRead(id, userID uuid.UUID) error
	MarkAllRead(userID uuid.UUID) error
	Delete(id, userID uuid.UUID) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) GetByUser(userID uuid.UUID) ([]domain.Notification, error) {
	return s.repo.FindByUser(userID)
}

func (s *service) MarkRead(id, userID uuid.UUID) error {
	return s.repo.MarkRead(id, userID)
}

func (s *service) MarkAllRead(userID uuid.UUID) error {
	return s.repo.MarkAllRead(userID)
}

func (s *service) Delete(id, userID uuid.UUID) error {
	return s.repo.Delete(id, userID)
}
