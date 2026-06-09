package project

import (
	"errors"
	"fmt"

	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/pagination"

	"github.com/google/uuid"
)

var ErrNotFound = errors.New("project not found")

type Service interface {
	Create(req *domain.CreateProjectRequest, createdBy uuid.UUID) (*domain.Project, error)
	GetAll(params pagination.Params, userID uuid.UUID) ([]domain.Project, int64, error)
	GetByID(id string) (*domain.Project, error)
	Update(id string, req *domain.UpdateProjectRequest) (*domain.Project, error)
	Delete(id string) error
	InviteMember(projectID, pmID uuid.UUID, req domain.InviteMemberRequest) error

	// Fitur Dashboard
	GetDashboardSummary(userID uuid.UUID) (map[string]interface{}, error)
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Create(req *domain.CreateProjectRequest, createdBy uuid.UUID) (*domain.Project, error) {
	p := &domain.Project{
		Name:        req.Name,
		Type:        req.Type,
		Description: req.Description,
		Status:      domain.StatusPlanning,
		StartDate:   req.StartDate,
		EndDate:     req.EndDate,
		CreatedByID: createdBy,
	}
	if err := s.repo.Create(p); err != nil {
		return nil, fmt.Errorf("project.service: create: %w", err)
	}

	// Tambahkan creator sebagai PM otomatis
	member := &domain.ProjectMember{
		ProjectID:  p.ID,
		UserID:     createdBy,
		Role:       domain.RolePM,
		AssignedBy: createdBy,
	}
	if err := s.repo.AddMember(member); err != nil {
		fmt.Printf("warning: failed to add creator as PM for project %s: %v\n", p.ID, err)
	}

	return p, nil
}

func (s *service) GetAll(params pagination.Params, userID uuid.UUID) ([]domain.Project, int64, error) {
	return s.repo.FindAll(params, userID)
}

func (s *service) GetByID(id string) (*domain.Project, error) {
	p, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, ErrNotFound
	}
	return p, nil
}

func (s *service) Update(id string, req *domain.UpdateProjectRequest) (*domain.Project, error) {
	p, err := s.repo.FindByID(id)
	if err != nil || p == nil {
		return nil, ErrNotFound
	}

	if req.Name != "" {
		p.Name = req.Name
	}
	if req.Type != "" {
		p.Type = req.Type
	}
	if req.Description != "" {
		p.Description = req.Description
	}
	if req.Status != "" {
		p.Status = req.Status
	}
	if req.StartDate != nil {
		p.StartDate = req.StartDate
	}
	if req.EndDate != nil {
		p.EndDate = req.EndDate
	}

	if err := s.repo.Update(p); err != nil {
		return nil, fmt.Errorf("project.service: update: %w", err)
	}
	return p, nil
}

func (s *service) Delete(id string) error {
	p, err := s.repo.FindByID(id)
	if err != nil || p == nil {
		return ErrNotFound
	}
	return s.repo.Delete(id)
}

func (s *service) InviteMember(projectID, pmID uuid.UUID, req domain.InviteMemberRequest) error {
	user, err := s.repo.FindUserByUsername(req.Username)
	if err != nil {
		return errors.New("user with this username not found")
	}

	exists, err := s.repo.CheckMemberExists(projectID, user.ID)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("user is already a member of this project")
	}

	member := &domain.ProjectMember{
		ProjectID:  projectID,
		UserID:     user.ID,
		Role:       req.Role,
		AssignedBy: pmID,
	}
	return s.repo.AddMember(member)
}

func (s *service) GetDashboardSummary(userID uuid.UUID) (map[string]interface{}, error) {
	return s.repo.GetDashboardSummary(userID)
}
