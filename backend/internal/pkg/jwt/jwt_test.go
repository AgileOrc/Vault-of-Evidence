package jwt

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSetAuthCookie(t *testing.T) {
	// Debug mode
	mDebug := NewManager("super_secret_key_1234567890123456", 8, false)
	wDebug := httptest.NewRecorder()
	mDebug.SetAuthCookie(wDebug, "fake-token")
	
	cDebug := wDebug.Result().Cookies()[0]
	if cDebug.Secure {
		t.Errorf("expected Secure=false in debug mode")
	}
	if cDebug.SameSite != http.SameSiteLaxMode {
		t.Errorf("expected SameSiteLaxMode in debug mode, got %v", cDebug.SameSite)
	}

	// Release mode
	mRelease := NewManager("super_secret_key_1234567890123456", 8, true)
	wRelease := httptest.NewRecorder()
	mRelease.SetAuthCookie(wRelease, "fake-token")
	
	cRelease := wRelease.Result().Cookies()[0]
	if !cRelease.Secure {
		t.Errorf("expected Secure=true in release mode")
	}
	if cRelease.SameSite != http.SameSiteNoneMode {
		t.Errorf("expected SameSiteNoneMode in release mode, got %v", cRelease.SameSite)
	}
}
