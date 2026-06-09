package worklist

import (
	"errors"
	"fmt"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"vault-of-evidence/backend/internal/domain"
)

type Repository interface {
	Create(w *domain.Worklist) error
	FindByProjectID(projectID string) ([]domain.Worklist, error)
	FindByID(id string) (*domain.Worklist, error)
	Update(w *domain.Worklist) error
	Delete(id string) error
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(w *domain.Worklist) error {
	if err := r.db.Create(w).Error; err != nil {
		return fmt.Errorf("worklist.repo: create: %w", err)
	}
	return nil
}

func (r *repository) FindByProjectID(projectID string) ([]domain.Worklist, error) {
	var worklists []domain.Worklist
	if err := r.db.Where("project_id = ?", projectID).Order("created_at DESC").Find(&worklists).Error; err != nil {
		return nil, err
	}
	return worklists, nil
}

func (r *repository) FindByID(id string) (*domain.Worklist, error) {
	var w domain.Worklist
	err := r.db.Preload("Findings").Where("id = ?", id).First(&w).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &w, err
}

func (r *repository) Update(w *domain.Worklist) error {
	return r.db.Save(w).Error
}

func (r *repository) Delete(id string) error {
	uid, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	return r.db.Delete(&domain.Worklist{}, "id = ?", uid).Error
}