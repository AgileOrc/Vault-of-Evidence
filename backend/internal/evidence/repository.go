package evidence

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"vault-of-evidence/backend/internal/domain"
)

type Repository interface {
	Create(ev *domain.Evidence) error
	FindByFindingID(findingID string) ([]domain.Evidence, error)
	FindByID(id string) (*domain.Evidence, error)
	Delete(id string) error
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(ev *domain.Evidence) error {
	if err := r.db.Create(ev).Error; err != nil {
		return fmt.Errorf("evidence.repo: create: %w", err)
	}
	return nil
}

func (r *repository) FindByFindingID(findingID string) ([]domain.Evidence, error) {
	var evs []domain.Evidence
	if err := r.db.Where("finding_id = ?", findingID).
		Order("uploaded_at DESC").Find(&evs).Error; err != nil {
		return nil, err
	}
	return evs, nil
}

func (r *repository) FindByID(id string) (*domain.Evidence, error) {
	var ev domain.Evidence
	err := r.db.Where("id = ?", id).First(&ev).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &ev, err
}

func (r *repository) Delete(id string) error {
	uid, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("evidence.repo: invalid id: %w", err)
	}
	return r.db.Delete(&domain.Evidence{}, "id = ?", uid).Error
}
