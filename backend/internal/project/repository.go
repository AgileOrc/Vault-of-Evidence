package project

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/pagination"
)

type Repository interface {
	Create(project *domain.Project) error
	FindAll(params pagination.Params) ([]domain.Project, int64, error)
	FindByID(id string) (*domain.Project, error)
	Update(project *domain.Project) error
	Delete(id string) error
	IsMember(projectID, userID string) (bool, error)
	AddMember(member *domain.ProjectMember) error
	RemoveMember(projectID, userID string) error
	GetMembers(projectID string) ([]domain.ProjectMember, error)
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(p *domain.Project) error {
	if err := r.db.Create(p).Error; err != nil {
		return fmt.Errorf("project.repo: create: %w", err)
	}
	return nil
}

func (r *repository) FindAll(params pagination.Params) ([]domain.Project, int64, error) {
	var projects []domain.Project
	var total int64

	// COUNT dulu — query terpisah lebih efisien dari COUNT(*) OVER()
	if err := r.db.Model(&domain.Project{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("CreatedBy").
		Order("created_at DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&projects).Error; err != nil {
		return nil, 0, err
	}

	return projects, total, nil
}

// IDOR check — dipakai sebelum izinkan pentester akses finding
func (r *repository) IsMember(projectID, userID string) (bool, error) {
	var count int64
	err := r.db.Model(&domain.ProjectMember{}).
		Where("project_id = ? AND user_id = ?", projectID, userID).
		Count(&count).Error
	return count > 0, err
}

func (r *repository) AddMember(member *domain.ProjectMember) error {
	// ON CONFLICT DO NOTHING — idempotent, assign dua kali tidak error
	return r.db.Exec(
		`INSERT INTO project_members (project_id, user_id, assigned_by, assigned_at)
		 VALUES (?, ?, ?, NOW())
		 ON CONFLICT (project_id, user_id) DO NOTHING`,
		member.ProjectID, member.UserID, member.AssignedBy,
	).Error
}

func (r *repository) RemoveMember(projectID, userID string) error {
	return r.db.
		Where("project_id = ? AND user_id = ?", projectID, userID).
		Delete(&domain.ProjectMember{}).Error
}

func (r *repository) GetMembers(projectID string) ([]domain.ProjectMember, error) {
	var members []domain.ProjectMember
	err := r.db.Preload("User").
		Where("project_id = ?", projectID).
		Find(&members).Error
	return members, err
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
