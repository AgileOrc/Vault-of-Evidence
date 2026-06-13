package notification

import (
	"errors"

	"vault-of-evidence/backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrNotFound    = errors.New("notification not found")
	ErrForbidden   = errors.New("access denied")
	ErrAlreadyDone = errors.New("invitation already processed")
)

type Service interface {
	GetForUser(userID uuid.UUID) ([]domain.Notification, error)
	UnreadCount(userID uuid.UUID) (int64, error)
	CreateInvite(targetUserID, projectID, inviterID uuid.UUID, projectName, inviterName, role string) error
	HasPendingInvite(projectID, userID uuid.UUID) (bool, error)
	Accept(notifID string, userID uuid.UUID) error
	Deny(notifID string, userID uuid.UUID) error
	MarkRead(notifID string, userID uuid.UUID) error
	MarkAllRead(userID uuid.UUID) error
}

type service struct {
	repo Repository
	db   *gorm.DB
}

func NewService(repo Repository, db *gorm.DB) Service { return &service{repo: repo, db: db} }

func (s *service) GetForUser(userID uuid.UUID) ([]domain.Notification, error) {
	return s.repo.FindByUser(userID)
}

func (s *service) UnreadCount(userID uuid.UUID) (int64, error) {
	return s.repo.UnreadCount(userID)
}

func (s *service) CreateInvite(targetUserID, projectID, inviterID uuid.UUID, projectName, inviterName, role string) error {
	n := &domain.Notification{
		UserID:    targetUserID,
		Type:      "invitation",
		Title:     inviterName + " invited you to " + projectName,
		Message:   "You've been invited to join " + projectName + " as " + role,
		ProjectID: &projectID,
		InviterID: &inviterID,
		Role:      &role,
		Status:    "pending",
	}
	return s.repo.Create(n)
}

func (s *service) HasPendingInvite(projectID, userID uuid.UUID) (bool, error) {
	return s.repo.HasPendingInvite(projectID, userID)
}

func (s *service) Accept(notifID string, userID uuid.UUID) error {
	n, err := s.repo.FindByID(notifID)
	if err != nil {
		return ErrNotFound
	}
	if n.UserID != userID {
		return ErrForbidden
	}
	if n.Status != "pending" {
		return ErrAlreadyDone
	}
	if n.ProjectID == nil || n.Role == nil {
		return errors.New("invalid invitation data")
	}

	inviterID := uuid.Nil
	if n.InviterID != nil {
		inviterID = *n.InviterID
	}

	member := domain.ProjectMember{
		ProjectID:  *n.ProjectID,
		UserID:     userID,
		Role:       domain.ProjectRole(*n.Role),
		AssignedBy: inviterID,
	}
	if err := s.db.Create(&member).Error; err != nil {
		return err
	}

	n.Status = "accepted"
	n.Read = true
	return s.repo.Update(n)
}

func (s *service) Deny(notifID string, userID uuid.UUID) error {
	n, err := s.repo.FindByID(notifID)
	if err != nil {
		return ErrNotFound
	}
	if n.UserID != userID {
		return ErrForbidden
	}
	if n.Status != "pending" {
		return ErrAlreadyDone
	}
	n.Status = "denied"
	n.Read = true
	return s.repo.Update(n)
}

func (s *service) MarkRead(notifID string, userID uuid.UUID) error {
	n, err := s.repo.FindByID(notifID)
	if err != nil {
		return ErrNotFound
	}
	if n.UserID != userID {
		return ErrForbidden
	}
	n.Read = true
	return s.repo.Update(n)
}

func (s *service) MarkAllRead(userID uuid.UUID) error {
	return s.repo.MarkAllRead(userID)
}
