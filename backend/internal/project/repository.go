package project

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"vault-of-evidence/backend/internal/domain"
)

type Repository interface {
	Create(project *domain.Project) error
	FindAll() ([]domain.Project, error)
	FindByID(id string) (*domain.Project, error)
	Update(project *domain.Project) error
	Delete(id string) error
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(p *domain.Project) error {
	if err := r.db.Create(p).Error; err != nil {
		return fmt.Errorf("project.repo: create: %w", err)
	}
	return nil
}

func (r *repository) FindAll() ([]domain.Project, error) {
	var projects []domain.Project
	// Preload CreatedBy tapi bukan Findings (bisa banyak) — avoid N+1
	if err := r.db.Preload("CreatedBy").Order("created_at DESC").Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *repository) FindByID(id string) (*domain.Project, error) {
	var p domain.Project
	err := r.db.Preload("CreatedBy").Preload("Findings").
		Where("id = ?", id).First(&p).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *repository) Update(p *domain.Project) error {
	return r.db.Save(p).Error
}

func (r *repository) Delete(id string) error {
	uid, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("project.repo: invalid id: %w", err)
	}
	return r.db.Delete(&domain.Project{}, "id = ?", uid).Error
}
