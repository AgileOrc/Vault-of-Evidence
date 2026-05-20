// Package pagination menyediakan utilitas limit/offset pagination yang aman.
//
// SECURITY: Hard cap pada MaxLimit mencegah DoS via resource exhaustion.
// Tanpa ini, client bisa request GET /findings?limit=1000000 dan
// exhaust memory + DB connection pool sekaligus.
package pagination

import (
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	DefaultPage  = 1
	DefaultLimit = 20
	MaxLimit     = 100 // Hard cap — tidak bisa di-override oleh client
)

// Params adalah parsed + sanitized pagination parameters.
type Params struct {
	Page   int
	Limit  int
	Offset int
}

// Meta adalah metadata yang dikembalikan ke client bersama data.
type Meta struct {
	CurrentPage int   `json:"current_page"`
	PerPage     int   `json:"per_page"`
	TotalItems  int64 `json:"total_items"`
	TotalPages  int   `json:"total_pages"`
	HasNext     bool  `json:"has_next"`
	HasPrev     bool  `json:"has_prev"`
}

// Response adalah wrapper standar untuk semua paginated endpoint.
type Response struct {
	Data interface{} `json:"data"`
	Meta Meta        `json:"meta"`
}

// ParseFromContext mengekstrak dan memvalidasi ?page= dan ?limit= dari query string.
// Nilai yang invalid atau di luar batas di-clamp ke default — tidak return error.
// Ini intentional: client yang kirim limit=999999 tidak perlu dikasih error,
// cukup di-cap ke MaxLimit.
func ParseFromContext(c *gin.Context) Params {
	page := parsePositiveInt(c.Query("page"), DefaultPage)
	limit := parsePositiveInt(c.Query("limit"), DefaultLimit)

	// Enforce hard cap — client tidak bisa minta lebih dari MaxLimit
	if limit > MaxLimit {
		limit = MaxLimit
	}

	// Page minimum 1
	if page < 1 {
		page = 1
	}

	offset := (page - 1) * limit

	return Params{
		Page:   page,
		Limit:  limit,
		Offset: offset,
	}
}

// BuildMeta menghitung metadata pagination dari total items dan params.
func BuildMeta(params Params, totalItems int64) Meta {
	totalPages := int(math.Ceil(float64(totalItems) / float64(params.Limit)))
	if totalPages == 0 {
		totalPages = 1
	}

	return Meta{
		CurrentPage: params.Page,
		PerPage:     params.Limit,
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		HasNext:     params.Page < totalPages,
		HasPrev:     params.Page > 1,
	}
}

// NewResponse membungkus data dan meta menjadi response standar.
func NewResponse(data interface{}, params Params, totalItems int64) Response {
	return Response{
		Data: data,
		Meta: BuildMeta(params, totalItems),
	}
}

func parsePositiveInt(s string, fallback int) int {
	if s == "" {
		return fallback
	}
	n, err := strconv.Atoi(s)
	if err != nil || n <= 0 {
		return fallback
	}
	return n
}