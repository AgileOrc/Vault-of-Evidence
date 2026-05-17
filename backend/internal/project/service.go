package project

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"vault-of-evidence/backend/internal/domain"
)

var ErrNotFound = errors.New("project not found")

type Service interface {
	Create(req *domain.CreateProjectRequest, createdBy uuid.UUID) (*domain.Project, error)
	GetAll() ([]domain.Project, error)
	GetByID(id string) (*domain.Project, error)
	Update(id string, req *domain.UpdateProjectRequest) (*domain.Project, error)
	Delete(id string) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Create(req *domain.CreateProjectRequest, createdBy uuid.UUID) (*domain.Project, error) {
	p := &domain.Project{
		Name:        req.Name,
		Description: req.Description,
		Status:      domain.StatusPlanning,
		StartDate:   req.StartDate,
		EndDate:     req.EndDate,
		CreatedByID: createdBy,
	}
	if err := s.repo.Create(p); err != nil {
		return nil, fmt.Errorf("project.service: create: %w", err)
	}
	return p, nil
}

func (s *service) GetAll() ([]domain.Project, error) {
	return s.repo.FindAll()
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
