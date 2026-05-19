package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

type ipClient struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// RateLimiter per-IP, token bucket.
// Untuk production horizontal scaling → ganti dengan Redis-backed limiter.
type RateLimiter struct {
	mu      sync.Mutex
	clients map[string]*ipClient
	r       rate.Limit
	burst   int
}

func NewRateLimiter(r rate.Limit, burst int) *RateLimiter {
	rl := &RateLimiter{clients: make(map[string]*ipClient), r: r, burst: burst}
	go rl.cleanup()
	return rl
}

func (rl *RateLimiter) getLimiter(ip string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	if c, ok := rl.clients[ip]; ok {
		c.lastSeen = time.Now()
		return c.limiter
	}
	l := rate.NewLimiter(rl.r, rl.burst)
	rl.clients[ip] = &ipClient{limiter: l, lastSeen: time.Now()}
	return l
}

func (rl *RateLimiter) cleanup() {
	for range time.NewTicker(5 * time.Minute).C {
		rl.mu.Lock()
		for ip, c := range rl.clients {
			if time.Since(c.lastSeen) > 10*time.Minute {
				delete(rl.clients, ip)
			}
		}
		rl.mu.Unlock()
	}
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !rl.getLimiter(c.ClientIP()).Allow() {
			c.Header("Retry-After", "60")
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "too many requests, try again in 60 seconds",
			})
			return
		}
		c.Next()
	}
}
