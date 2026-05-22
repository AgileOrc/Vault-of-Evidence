package project

import (
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

	// Fitur Project Members
	AddMember(member *domain.ProjectMember) error
	FindUserByUsername(username string) (*domain.User, error)
	CheckMemberExists(projectID, userID uuid.UUID) (bool, error)
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(project *domain.Project) error {
	return r.db.Create(project).Error
}

func (r *repository) FindAll(params pagination.Params) ([]domain.Project, int64, error) {
	var projects []domain.Project
	var total int64

	if err := r.db.Model(&domain.Project{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := r.db.Order("created_at DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&projects).Error

	return projects, total, err
}

func (r *repository) FindByID(id string) (*domain.Project, error) {
	var p domain.Project
	// Preload Members agar saat mengambil data proyek, daftar anggotanya ikut terbawa
	err := r.db.Preload("Members").Preload("Members.User").Where("id = ?", id).First(&p).Error
	return &p, err
}

func (r *repository) Update(project *domain.Project) error {
	return r.db.Save(project).Error
}

func (r *repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&domain.Project{}).Error
}

func (r *repository) AddMember(member *domain.ProjectMember) error {
	return r.db.Create(member).Error
}

func (r *repository) FindUserByUsername(username string) (*domain.User, error) {
	var user domain.User
	if err := r.db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) CheckMemberExists(projectID, userID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.Model(&domain.ProjectMember{}).
		Where("project_id = ? AND user_id = ?", projectID, userID).
		Count(&count).Error
	return count > 0, err
}