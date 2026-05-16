# Vault of Evidence

Vault of Evidence is a comprehensive penetration testing and vulnerability tracking platform designed for security professionals. It allows you to track findings, manage worklists (kanban), compile reports, and configure testing settings in an elegant, unified interface.

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Lucide React
- **Backend:** Go, Gin Framework, GORM
- **Database:** SQLite (Local development), structured to scale to PostgreSQL (Neon) for production.

---

## Prerequisites

Make sure the following are installed on your machine before getting started:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| Go | v1.21+ | https://go.dev/dl |
| Git | latest | https://git-scm.com |

---

## 🛠️ Local Development Setup

### 1. Run the Backend (API & Database)

```bash
cd backend
go mod tidy
go run cmd/api/main.go
```
The server will initialize a `vault.db` SQLite database file and start running on **http://localhost:8080**.

---

### 2. Run the Frontend (UI)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**. Open this URL in your browser.

---

## 📌 Features

- **Dashboard:** Overview of active pentest progress, critical findings, and recent activity.
- **Findings Management:** Add, list, score (CVSS), and track vulnerabilities with endpoints, impacts, and remediation steps.
- **Worklist (Kanban):** Track pentest tasks (`To Do`, `In Progress`, `Completed`) with priorities and team assignment.
- **Reporting:** Generate and export automated pentest reports based on evidence.
- **Settings & User Profile:** Configure application defaults and user settings. 

## ☁️ Deployment Plan

- **Database:** To deploy, use Neon PostgreSQL and update the GORM dialect in `backend/cmd/api/main.go`.
- **Backend Hosting:** Deploy the Go app (e.g. Koyeb or Render).
- **Frontend Hosting:** Deploy the Vite app (e.g. Vercel or Netlify) pointing to the prod backend URL.

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