package finding

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/pagination"
)

type Repository interface {
	Create(finding *domain.Finding) error
	FindByProjectID(projectID string, params pagination.Params) ([]domain.Finding, int64, error)
	FindByID(id string) (*domain.Finding, error)
	Update(finding *domain.Finding) error
	Delete(id string) error
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(f *domain.Finding) error {
	if err := r.db.Create(f).Error; err != nil {
		return fmt.Errorf("finding.repo: create: %w", err)
	}
	return nil
}

func (r *repository) FindByProjectID(projectID string, params pagination.Params) ([]domain.Finding, int64, error) {
	var findings []domain.Finding
	var total int64

	query := r.db.Model(&domain.Finding{}).Where("project_id = ?", projectID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Order("created_at DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&findings).Error; err != nil {
		return nil, 0, err
	}

	return findings, total, nil
}

func (r *repository) FindByID(id string) (*domain.Finding, error) {
	var f domain.Finding
	err := r.db.Preload("Evidence").Where("id = ?", id).First(&f).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &f, err
}

func (r *repository) Update(f *domain.Finding) error {
	return r.db.Save(f).Error
}

func (r *repository) Delete(id string) error {
	uid, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("finding.repo: invalid id: %w", err)
	}
	return r.db.Delete(&domain.Finding{}, "id = ?", uid).Error
}
