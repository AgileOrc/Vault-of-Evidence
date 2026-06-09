package worklist

import (
	"errors"
	"fmt"
	"github.com/google/uuid"
	"vault-of-evidence/backend/internal/domain"
)

var ErrNotFound = errors.New("worklist not found")

type Service interface {
	Create(projectID string, req *domain.CreateWorklistRequest) (*domain.Worklist, error)
	GetByProject(projectID string) ([]domain.Worklist, error)
	GetByID(id string) (*domain.Worklist, error)
	Update(id string, req *domain.UpdateWorklistRequest) (*domain.Worklist, error)
	Delete(id string) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Create(projectID string, req *domain.CreateWorklistRequest) (*domain.Worklist, error) {
	pid, err := uuid.Parse(projectID)
	if err != nil {
		return nil, fmt.Errorf("invalid project id")
	}
	w := &domain.Worklist{
		ProjectID:   pid,
		Name:        req.Name,
		Description: req.Description,
		Status:      domain.WorklistOpen,
	}
	if err := s.repo.Create(w); err != nil {
		return nil, err
	}
	return w, nil
}

func (s *service) GetByProject(projectID string) ([]domain.Worklist, error) {
	return s.repo.FindByProjectID(projectID)
}

func (s *service) GetByID(id string) (*domain.Worklist, error) {
	w, err := s.repo.FindByID(id)
	if err != nil { return nil, err }
	if w == nil { return nil, ErrNotFound }
	return w, nil
}

func (s *service) Update(id string, req *domain.UpdateWorklistRequest) (*domain.Worklist, error) {
	w, err := s.repo.FindByID(id)
	if err != nil || w == nil { return nil, ErrNotFound }

	if req.Name != "" { w.Name = req.Name }
	if req.Description != "" { w.Description = req.Description }
	if req.Status != "" { w.Status = req.Status }

	if err := s.repo.Update(w); err != nil {
		return nil, err
	}
	return w, nil
}

func (s *service) Delete(id string) error {
	w, err := s.repo.FindByID(id)
	if err != nil || w == nil { return ErrNotFound }
	return s.repo.Delete(id)
}