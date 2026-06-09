package project

import (
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/pagination"

	"github.com/google/uuid"
	"gorm.io/gorm"
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

	// Fitur Dashboard
	GetDashboardSummary(userID uuid.UUID) (map[string]interface{}, error)
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

	err := r.db.Preload("Members").Preload("Worklists").Preload("Findings").
		Order("created_at DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&projects).Error

	return projects, total, err
}

func (r *repository) FindByID(id string) (*domain.Project, error) {
	var p domain.Project
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

// Implementasi Query Dashboard
func (r *repository) GetDashboardSummary(userID uuid.UUID) (map[string]interface{}, error) {
	var totalProjects int64
	var activeProjects int64
	var criticalHighCount int64
	var recentProjects []domain.Project
	var recentFindings []domain.Finding

	r.db.Table("projects").
		Joins("JOIN project_members ON project_members.project_id = projects.id").
		Where("project_members.user_id = ?", userID).Count(&totalProjects)

	r.db.Table("projects").
		Joins("JOIN project_members ON project_members.project_id = projects.id").
		Where("project_members.user_id = ? AND (projects.status = ? OR projects.status = ?)", userID, "active", "Active").Count(&activeProjects)

	r.db.Table("projects").Select("projects.*").
		Joins("JOIN project_members ON project_members.project_id = projects.id").
		Where("project_members.user_id = ?", userID).
		Order("projects.created_at DESC").Limit(5).Find(&recentProjects)

	r.db.Table("findings").Select("findings.*").
		Joins("JOIN project_members ON project_members.project_id = findings.project_id").
		Where("project_members.user_id = ?", userID).
		Order("findings.created_at DESC").Limit(5).Find(&recentFindings)

	r.db.Table("findings").
		Joins("JOIN project_members ON project_members.project_id = findings.project_id").
		Where("project_members.user_id = ? AND findings.status = ? AND findings.severity IN (?, ?)", userID, "open", "Critical", "High").Count(&criticalHighCount)

	return map[string]interface{}{
		"totalProjects":     totalProjects,
		"activeProjects":    activeProjects,
		"criticalHighCount": criticalHighCount,
		"recentProjects":    recentProjects,
		"recentFindings":    recentFindings,
	}, nil
}
