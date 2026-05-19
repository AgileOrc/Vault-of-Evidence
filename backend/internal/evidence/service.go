package evidence

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gabriel-vasile/mimetype"
	"github.com/google/uuid"
	"vault-of-evidence/backend/internal/domain"
)

var ErrNotFound = errors.New("evidence not found")

// Allowlist MIME types berdasarkan magic bytes — bukan dari extension atau Content-Type header.
// Extension bisa dimanipulasi (file.php diubah jadi file.png).
// Magic bytes adalah identifikasi nyata dari file content.
var allowedMIMEs = map[string]bool{
	"image/png":        true,
	"image/jpeg":       true,
	"image/gif":        true,
	"image/webp":       true,
	"application/pdf":  true,
	"text/plain":       true,
	"application/json": true,
	"video/mp4":        true,
}

// Regex untuk sanitasi filename — hanya izinkan karakter aman
var safeFilenameRe = regexp.MustCompile(`[^a-zA-Z0-9._-]`)

type UploadInput struct {
	FindingID   string
	UploadedBy  uuid.UUID
	File        multipart.File
	Header      *multipart.FileHeader
	StoragePath string
	MaxSizeMB   int64
}

type Service interface {
	Upload(input UploadInput) (*domain.Evidence, error)
	GetByFinding(findingID string) ([]domain.Evidence, error)
	GetByID(id string) (*domain.Evidence, error)
	Delete(id string) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) Upload(input UploadInput) (*domain.Evidence, error) {
	// 1. Enforce file size limit
	maxBytes := input.MaxSizeMB * 1024 * 1024
	if input.Header.Size > maxBytes {
		return nil, fmt.Errorf("file size exceeds %dMB limit", input.MaxSizeMB)
	}

	// 2. Detect MIME dari magic bytes (bukan dari header atau extension)
	// mimetype library membaca byte signature pertama file → tidak bisa ditipu
	detected, err := mimetype.DetectReader(input.File)
	if err != nil {
		return nil, fmt.Errorf("evidence: mime detection failed: %w", err)
	}
	if !allowedMIMEs[detected.String()] {
		return nil, fmt.Errorf("file type %q not allowed", detected.String())
	}

	// 3. Sanitasi filename — cegah Path Traversal (CWE-22)
	// Contoh serangan: filename = "../../etc/passwd" → dengan sanitasi jadi "....etcpasswd"
	// Lebih aman: strip semua kecuali karakter yang kita izinkan
	originalName := filepath.Base(input.Header.Filename) // strip directory components dulu
	sanitized := safeFilenameRe.ReplaceAllString(originalName, "_")
	sanitized = strings.Trim(sanitized, "._-")
	if sanitized == "" {
		sanitized = "unnamed_file"
	}
	// Batasi panjang filename
	if len(sanitized) > 200 {
		sanitized = sanitized[:200]
	}

	// 4. Generate path dengan UUID → tidak bisa ditebak/diakses langsung
	// Format: {storagePath}/{finding_id}/{uuid}_{sanitized_name}
	findingDir := filepath.Join(input.StoragePath, input.FindingID)
	if err := os.MkdirAll(findingDir, 0750); err != nil {
		return nil, fmt.Errorf("evidence: mkdir: %w", err)
	}

	fileID := uuid.New().String()
	destPath := filepath.Join(findingDir, fileID+"_"+sanitized)

	// 5. Reset reader ke awal (setelah mime detection membaca beberapa byte)
	if seeker, ok := input.File.(interface {
		Seek(int64, int) (int64, error)
	}); ok {
		if _, err := seeker.Seek(0, 0); err != nil {
			return nil, fmt.Errorf("evidence: seek: %w", err)
		}
	}

	// 6. Tulis file ke disk
	outFile, err := os.OpenFile(destPath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0640)
	if err != nil {
		return nil, fmt.Errorf("evidence: create file: %w", err)
	}
	defer outFile.Close()

	written, err := copyWithLimit(outFile, input.File, maxBytes)
	if err != nil {
		os.Remove(destPath) // cleanup on failure
		return nil, fmt.Errorf("evidence: write: %w", err)
	}

	// 7. Simpan metadata ke DB
	fid, err := uuid.Parse(input.FindingID)
	if err != nil {
		return nil, fmt.Errorf("evidence: invalid finding id")
	}

	ev := &domain.Evidence{
		FindingID:  fid,
		FileName:   sanitized,
		FilePath:   destPath, // hanya di DB, tidak pernah di-expose ke client
		MimeType:   detected.String(),
		FileSize:   written,
		UploadedBy: input.UploadedBy,
		UploadedAt: time.Now().UTC(),
	}
	if err := s.repo.Create(ev); err != nil {
		os.Remove(destPath) // cleanup kalau DB insert gagal
		return nil, fmt.Errorf("evidence: db: %w", err)
	}

	return ev, nil
}

func (s *service) GetByFinding(findingID string) ([]domain.Evidence, error) {
	return s.repo.FindByFindingID(findingID)
}

func (s *service) GetByID(id string) (*domain.Evidence, error) {
	ev, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if ev == nil {
		return nil, ErrNotFound
	}
	return ev, nil
}

func (s *service) Delete(id string) error {
	ev, err := s.repo.FindByID(id)
	if err != nil || ev == nil {
		return ErrNotFound
	}
	// Hapus file dari disk dulu, baru hapus record DB
	_ = os.Remove(ev.FilePath)
	return s.repo.Delete(id)
}

// copyWithLimit copies up to maxBytes, returns bytes written
func copyWithLimit(dst *os.File, src multipart.File, limit int64) (int64, error) {
	buf := make([]byte, 32*1024)
	var written int64
	for {
		nr, err := src.Read(buf)
		if nr > 0 {
			written += int64(nr)
			if written > limit {
				return written, fmt.Errorf("file exceeds size limit during write")
			}
			if _, werr := dst.Write(buf[:nr]); werr != nil {
				return written, werr
			}
		}
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return written, err
		}
	}
	return written, nil
}
