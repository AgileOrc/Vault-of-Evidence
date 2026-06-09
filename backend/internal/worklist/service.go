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
	GetByID(projectID, id string) (*domain.Worklist, error)
	Update(projectID, id string, req *domain.UpdateWorklistRequest) (*domain.Worklist, error)
	Delete(projectID, id string) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Create(projectID string, req *domain.CreateWorklistRequest) (*domain.Worklist, error) {
	pid, err := uuid.Parse(projectID)
	if err != nil {
		return nil, fmt.Errorf("invalid project id")
	}
	status := domain.WorklistNotStarted
	if req.Status != "" {
		status = req.Status
	}
	w := &domain.Worklist{
		ProjectID:   pid,
		Name:        req.Name,
		Code:        req.Code,
		Description: req.Description,
		Status:      status,
	}
	if err := s.repo.Create(w); err != nil {
		return nil, err
	}
	return w, nil
}

func (s *service) GetByProject(projectID string) ([]domain.Worklist, error) {
	return s.repo.FindByProjectID(projectID)
}

func (s *service) GetByID(projectID, id string) (*domain.Worklist, error) {
	w, err := s.repo.FindByID(id)
	if err != nil { return nil, err }
	if w == nil || w.ProjectID.String() != projectID { return nil, ErrNotFound }
	return w, nil
}

func (s *service) Update(projectID, id string, req *domain.UpdateWorklistRequest) (*domain.Worklist, error) {
	w, err := s.repo.FindByID(id)
	if err != nil || w == nil || w.ProjectID.String() != projectID { return nil, ErrNotFound }

	if req.Name != "" { w.Name = req.Name }
	if req.Code != "" { w.Code = req.Code }
	if req.Description != "" { w.Description = req.Description }
	if req.Status != "" { w.Status = req.Status }

	if err := s.repo.Update(w); err != nil {
		return nil, err
	}
	return w, nil
}

func (s *service) Delete(projectID, id string) error {
	w, err := s.repo.FindByID(id)
	if err != nil || w == nil || w.ProjectID.String() != projectID { return ErrNotFound }
	return s.repo.Delete(id)
}