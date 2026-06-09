package finding

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"vault-of-evidence/backend/internal/domain"
	"vault-of-evidence/backend/internal/pkg/pagination"
)

var ErrNotFound = errors.New("finding not found")

type Service interface {
	Create(projectID string, req *domain.CreateFindingRequest) (*domain.Finding, error)
	GetByProject(projectID string, params pagination.Params) ([]domain.Finding, int64, error)
	GetByWorklist(worklistID string, params pagination.Params) ([]domain.Finding, int64, error)
	GetByID(id string) (*domain.Finding, error)
	
	
	Update(id string, req *domain.UpdateFindingRequest, role domain.ProjectRole) (*domain.Finding, error)
	
	Delete(id string) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Create(projectID string, req *domain.CreateFindingRequest) (*domain.Finding, error) {
	pid, err := uuid.Parse(projectID)
	if err != nil {
		return nil, fmt.Errorf("finding.service: invalid project id")
	}
	f := &domain.Finding{
		ProjectID:         pid,
		WorklistID:        req.WorklistID,
		Title:             req.Title,
		Description:       req.Description,
		Severity:          req.Severity,
		CVSSScore:         req.CVSSScore,
		CVSSVector:        req.CVSSVector,
		WSTGCode:          req.WSTGCode,
		Contributor:       req.Contributor,
		AffectedEndpoints: req.AffectedEndpoints,
		ReproductionSteps: req.ReproductionSteps,
		Impact:            req.Impact,
		Remediation:       req.Remediation,
	}
	if err := s.repo.Create(f); err != nil {
		return nil, fmt.Errorf("finding.service: create: %w", err)
	}
	return f, nil
}

func (s *service) GetByProject(projectID string, params pagination.Params) ([]domain.Finding, int64, error) {
	return s.repo.FindByProjectID(projectID, params)
}

func (s *service) GetByWorklist(worklistID string, params pagination.Params) ([]domain.Finding, int64, error) {
	return s.repo.FindByWorklistID(worklistID, params)
}

func (s *service) GetByID(id string) (*domain.Finding, error) {
	f, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if f == nil {
		return nil, ErrNotFound
	}
	return f, nil
}

func (s *service) Update(id string, req *domain.UpdateFindingRequest, role domain.ProjectRole) (*domain.Finding, error) {
	f, err := s.repo.FindByID(id)
	if err != nil || f == nil {
		return nil, ErrNotFound
	}

	// ─── FILTER BERDASARKAN ROLE (FIELD-LEVEL SECURITY) ───────────────────────────────

	if role == domain.RoleDev {
		// DEVELOPER: Hanya boleh mengubah Status dan Notes
		if req.Status != "" {
			f.Status = req.Status // Status diubah terlebih dahulu
		}
		
		// Cek syarat Notes: Hanya boleh diisi jika statusnya (yang baru atau lama) adalah "closed"
		if req.Notes != "" {
			if f.Status == domain.FindingStatusClosed {
				f.Notes = req.Notes
			} else {
				// Lempar error jika Dev mencoba mengisi notes tanpa menutup bug-nya
				return nil, errors.New("developer is only allowed to write notes when the status is 'closed'")
			}
		}

	} else if role == domain.RolePentester {
		// PENTESTER: Read & Update detail teknis bug
		if req.Title != "" { f.Title = req.Title }
		if req.Description != "" { f.Description = req.Description }
		if req.Severity != "" { f.Severity = req.Severity }
		if req.CVSSScore > 0 { f.CVSSScore = req.CVSSScore }
		if req.AffectedEndpoints != "" { f.AffectedEndpoints = req.AffectedEndpoints }
		if req.ReproductionSteps != "" { f.ReproductionSteps = req.ReproductionSteps }
		if req.Impact != "" { f.Impact = req.Impact }
		if req.Remediation != "" { f.Remediation = req.Remediation }
		if req.Status != "" { f.Status = req.Status }

	} else if role == domain.RolePM {
		// PM: CRUD Penuh
		if req.Title != "" { f.Title = req.Title }
		if req.Description != "" { f.Description = req.Description }
		if req.Severity != "" { f.Severity = req.Severity }
		if req.CVSSScore > 0 { f.CVSSScore = req.CVSSScore }
		if req.AffectedEndpoints != "" { f.AffectedEndpoints = req.AffectedEndpoints }
		if req.ReproductionSteps != "" { f.ReproductionSteps = req.ReproductionSteps }
		if req.Impact != "" { f.Impact = req.Impact }
		if req.Remediation != "" { f.Remediation = req.Remediation }
		if req.Status != "" { f.Status = req.Status }
		if req.Notes != "" { f.Notes = req.Notes }
	}

	if err := s.repo.Update(f); err != nil {
		return nil, fmt.Errorf("finding.service: update: %w", err)
	}
	return f, nil
}

func (s *service) Delete(id string) error {
	f, err := s.repo.FindByID(id)
	if err != nil || f == nil {
		return ErrNotFound
	}
	return s.repo.Delete(id)
}
