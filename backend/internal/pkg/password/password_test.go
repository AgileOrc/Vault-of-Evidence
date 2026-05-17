package password

import (
	"errors"
	"strings"
	"testing"
)

func TestHashAndVerify(t *testing.T) {
	hash, err := Hash("correct horse battery staple")
	if err != nil {
		t.Fatalf("Hash returned error: %v", err)
	}
	if !strings.HasPrefix(hash, "$argon2id$v=19$") {
		t.Fatalf("Hash used unexpected format: %q", hash)
	}

	if err := Verify("correct horse battery staple", hash); err != nil {
		t.Fatalf("Verify rejected the correct password: %v", err)
	}

	if err := Verify("wrong password", hash); !errors.Is(err, ErrMismatch) {
		t.Fatalf("Verify returned %v, want ErrMismatch", err)
	}
}

func TestVerifyRejectsInvalidHash(t *testing.T) {
	if err := Verify("password", "not-a-phc-hash"); !errors.Is(err, ErrInvalidHash) {
		t.Fatalf("Verify returned %v, want ErrInvalidHash", err)
	}
}
