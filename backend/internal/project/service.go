package project

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/pagination"
)

var ErrNotFound = errors.New("project not found")

type Service interface {
	Create(req *domain.CreateProjectRequest, createdBy uuid.UUID) (*domain.Project, error)
	GetAll(params pagination.Params) ([]domain.Project, int64, error)
	GetByID(id string) (*domain.Project, error)
	Update(id string, req *domain.UpdateProjectRequest) (*domain.Project, error)
	Delete(id string) error
	InviteMember(projectID, pmID uuid.UUID, req domain.InviteMemberRequest) error // <--- TAMBAHKAN INI
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

func (s *service) GetAll(params pagination.Params) ([]domain.Project, int64, error) {
	return s.repo.FindAll(params)
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

func (s *service) InviteMember(projectID, pmID uuid.UUID, req domain.InviteMemberRequest) error {
	// 1. Cari user di database berdasarkan email yang diinput PM
	user, err := s.repo.FindUserByUsername(req.Username)
	if err != nil {
		return errors.New("user with this username not found")
	}

	// 2. Cek apakah user ini ternyata sudah ada di dalam proyek
	exists, err := s.repo.CheckMemberExists(projectID, user.ID)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("user is already a member of this project")
	}

	// 3. Susun data anggota baru
	member := &domain.ProjectMember{
		ProjectID:  projectID,
		UserID:     user.ID,
		Role:       req.Role, // Akan berisi "dev" atau "pentester"
		AssignedBy: pmID,     // ID PM yang mengundang
	}

	// 4. Minta repository untuk menyimpannya
	return s.repo.AddMember(member)
}