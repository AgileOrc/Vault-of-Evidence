package password

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"

	"golang.org/x/crypto/argon2"
)

const (
	argonMemory      uint32 = 64 * 1024
	argonIterations  uint32 = 1
	argonParallelism uint8  = 4
	saltLength              = 16
	keyLength               = 32
)

var (
	ErrInvalidHash = errors.New("invalid password hash")
	ErrMismatch    = errors.New("password does not match")
)

type params struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	salt        []byte
	hash        []byte
}

func Hash(plain string) (string, error) {
	salt := make([]byte, saltLength)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return "", fmt.Errorf("password: salt: %w", err)
	}

	hash := argon2.IDKey([]byte(plain), salt, argonIterations, argonMemory, argonParallelism, keyLength)
	return fmt.Sprintf(
		"$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s",
		argonMemory,
		argonIterations,
		argonParallelism,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	), nil
}

func Verify(plain, encodedHash string) error {
	p, err := parse(encodedHash)
	if err != nil {
		return err
	}

	hash := argon2.IDKey([]byte(plain), p.salt, p.iterations, p.memory, p.parallelism, uint32(len(p.hash)))
	if subtle.ConstantTimeCompare(hash, p.hash) != 1 {
		return ErrMismatch
	}
	return nil
}

func parse(encodedHash string) (*params, error) {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 || parts[1] != "argon2id" || parts[2] != "v=19" {
		return nil, ErrInvalidHash
	}

	var p params
	for _, field := range strings.Split(parts[3], ",") {
		key, value, ok := strings.Cut(field, "=")
		if !ok {
			return nil, ErrInvalidHash
		}

		n, err := strconv.ParseUint(value, 10, 32)
		if err != nil {
			return nil, ErrInvalidHash
		}

		switch key {
		case "m":
			p.memory = uint32(n)
		case "t":
			p.iterations = uint32(n)
		case "p":
			if n > 255 {
				return nil, ErrInvalidHash
			}
			p.parallelism = uint8(n)
		default:
			return nil, ErrInvalidHash
		}
	}

	if p.memory == 0 || p.iterations == 0 || p.parallelism == 0 {
		return nil, ErrInvalidHash
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil || len(salt) == 0 {
		return nil, ErrInvalidHash
	}
	hash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil || len(hash) == 0 {
		return nil, ErrInvalidHash
	}

	p.salt = salt
	p.hash = hash
	return &p, nil
}
