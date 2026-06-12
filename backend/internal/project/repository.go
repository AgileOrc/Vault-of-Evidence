package project

import (
	"fmt"
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/pagination"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(project *domain.Project) error
	FindAll(params pagination.Params, userID uuid.UUID) ([]domain.Project, int64, error)
	FindByID(id string) (*domain.Project, error)
	Update(project *domain.Project) error
	Delete(id string) error

	// Fitur Project Members
	AddMember(member *domain.ProjectMember) error
	AddMemberWithNotification(member *domain.ProjectMember, notification *domain.Notification) error
	RemoveMember(projectID, userID uuid.UUID) error
	FindUserByID(id uuid.UUID) (*domain.User, error)
	FindUserByUsernameOrEmail(identifier string) (*domain.User, error)
	CheckMemberExists(projectID, userID uuid.UUID) (bool, error)

	// Fitur Dashboard
	GetDashboardSummary(userID uuid.UUID) (map[string]interface{}, error)
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(project *domain.Project) error {
	return r.db.Create(project).Error
}

func (r *repository) FindAll(params pagination.Params, userID uuid.UUID) ([]domain.Project, int64, error) {
	var projects []domain.Project
	var total int64

	query := r.db.Model(&domain.Project{}).
		Joins("JOIN project_members ON project_members.project_id = projects.id").
		Where("project_members.user_id = ?", userID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Preload("Members").Preload("Worklists").Preload("Findings").
		Order("projects.created_at DESC").
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
	projectID, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("invalid project id: %w", err)
	}

	return r.db.Transaction(func(tx *gorm.DB) error {
		findingIDs := tx.Model(&domain.Finding{}).
			Select("id").
			Where("project_id = ?", projectID)

		if err := tx.Where("finding_id IN (?)", findingIDs).Delete(&domain.Evidence{}).Error; err != nil {
			return fmt.Errorf("delete evidence: %w", err)
		}

		if err := tx.Where("project_id = ?", projectID).Delete(&domain.Finding{}).Error; err != nil {
			return fmt.Errorf("delete findings: %w", err)
		}

		if err := tx.Where("project_id = ?", projectID).Delete(&domain.Worklist{}).Error; err != nil {
			return fmt.Errorf("delete worklists: %w", err)
		}

		if err := tx.Where("project_id = ?", projectID).Delete(&domain.Notification{}).Error; err != nil {
			return fmt.Errorf("delete notifications: %w", err)
		}

		if err := tx.Where("project_id = ?", projectID).Delete(&domain.ProjectMember{}).Error; err != nil {
			return fmt.Errorf("delete project members: %w", err)
		}

		res := tx.Where("id = ?", projectID).Delete(&domain.Project{})
		if res.Error != nil {
			return fmt.Errorf("delete project: %w", res.Error)
		}
		if res.RowsAffected == 0 {
			return ErrNotFound
		}
		return nil
	})
}

func (r *repository) AddMember(member *domain.ProjectMember) error {
	return r.db.Create(member).Error
}

func (r *repository) AddMemberWithNotification(member *domain.ProjectMember, notification *domain.Notification) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(member).Error; err != nil {
			return err
		}
		return tx.Create(notification).Error
	})
}

func (r *repository) RemoveMember(projectID, userID uuid.UUID) error {
	return r.db.Where("project_id = ? AND user_id = ?", projectID, userID).Delete(&domain.ProjectMember{}).Error
}

func (r *repository) FindUserByID(id uuid.UUID) (*domain.User, error) {
	var user domain.User
	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) FindUserByUsernameOrEmail(identifier string) (*domain.User, error) {
	var user domain.User
	if err := r.db.Where("username = ? OR email = ?", identifier, identifier).First(&user).Error; err != nil {
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

	type DashboardFinding struct {
		domain.Finding
		ProjectName  string `json:"project_name"`
		WorklistName string `json:"worklist_name"`
	}
	var dashboardFindings []DashboardFinding

	r.db.Table("findings").
		Select("findings.*, projects.name as project_name, COALESCE(worklists.name, '') as worklist_name").
		Joins("JOIN project_members ON project_members.project_id = findings.project_id").
		Joins("JOIN projects ON projects.id = findings.project_id").
		Joins("LEFT JOIN worklists ON worklists.id = findings.worklist_id").
		Where("project_members.user_id = ?", userID).
		Order("findings.created_at DESC").Limit(5).Find(&dashboardFindings)

	r.db.Table("findings").
		Joins("JOIN project_members ON project_members.project_id = findings.project_id").
		Where("project_members.user_id = ? AND findings.status = ? AND findings.severity IN (?, ?)", userID, "open", "critical", "high").Count(&criticalHighCount)

	return map[string]interface{}{
		"totalProjects":     totalProjects,
		"activeProjects":    activeProjects,
		"criticalHighCount": criticalHighCount,
		"recentProjects":    recentProjects,
		"recentFindings":    dashboardFindings,
	}, nil
}
