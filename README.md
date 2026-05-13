# Vault of Evidence

Full-stack web application built with React + TypeScript (frontend) and Go + Gin (backend).

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
git clone <repository-url>
cd vault-of-evidence
```

---

### 2. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**

---

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

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite
- **Backend**: Go, Gin, CORS middleware
- **Database**: PostgreSQL (not deployed yet)