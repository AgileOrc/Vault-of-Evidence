# 🔐 Vault of Evidence (VoE)

> A web-based penetration testing management platform for organizing worklists, documenting findings, and storing proof-of-concept evidence in one centralized workspace.

[![Documentation](https://img.shields.io/badge/Documentation-GitBook-blue?style=flat-square&logo=gitbook)](https://app.gitbook.com/invite/MVTxKSbf30GtPhHzGKfl/bcmUr6lUPQDcN47KK3co)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Go%20%2B%20Gin-00ADD8?style=flat-square&logo=go)](./backend)

---

## 📚 Documentation

Full documentation is available on GitBook:

👉 **[Vault of Evidence Documentation](https://app.gitbook.com/invite/MVTxKSbf30GtPhHzGKfl/bcmUr6lUPQDcN47KK3co)**

---

## Prerequisites

Make sure the following are installed on your machine before getting started:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| Go | v1.21+ | https://go.dev/dl |
| Git | latest | https://git-scm.com |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AgileOrc/Vault-of-Evidence.git
cd vault-of-evidence
```

### 2. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**

### 3. Run the Backend

```bash
cd backend
go mod tidy
go run cmd/api/main.go
```

The backend API will be available at **http://localhost:8080**

To verify it's running:
```bash
curl http://localhost:8080/health
# expected: {"status":"ok"}
```

---

## Project Structure

```
vault-of-evidence/
├── frontend/               # React + TypeScript + Tailwind CSS (Vite)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css       # Tailwind v4 imports & theme
│   ├── index.html
│   └── package.json
│
├── backend/                # Go + Gin REST API
│   ├── cmd/api/
│   │   └── main.go         # entry point
│   ├── internal/
│   │   ├── handler/        # HTTP handlers
│   │   ├── service/        # business logic
│   │   ├── repository/     # database queries
│   │   └── model/          # structs and types
│   └── go.mod
│
└── docker-compose.yml
```

---

## Available Scripts

### Frontend (`/frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Backend (`/backend`)

| Command | Description |
|---------|-------------|
| `go run cmd/api/main.go` | Start API server at localhost:8080 |
| `go build ./...` | Compile the project |
| `go test ./...` | Run all tests |
| `go mod tidy` | Sync dependencies |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite |
| Backend | Go, Gin, CORS middleware |
| Database | PostgreSQL |
| Deployment | Vercel (frontend), Railway (backend + database) |

---

## 🚧 Status

Currently under active development.