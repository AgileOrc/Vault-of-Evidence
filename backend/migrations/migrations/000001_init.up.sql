CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(50)  UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT         NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'pentester',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_role CHECK (role IN ('admin','pentester','client'))
);

CREATE TABLE IF NOT EXISTS projects (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255)  NOT NULL,
    description   TEXT,
    status        VARCHAR(20)   NOT NULL DEFAULT 'planning',
    start_date    DATE,
    end_date      DATE,
    created_by_id UUID          NOT NULL REFERENCES users(id),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_status CHECK (status IN ('planning','active','completed','archived'))
);

CREATE TABLE IF NOT EXISTS findings (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id         UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title              VARCHAR(255)  NOT NULL,
    description        TEXT,
    severity           VARCHAR(20)   NOT NULL,
    cvss_score         DECIMAL(4,1)  DEFAULT 0.0,
    affected_endpoints TEXT,
    reproduction_steps TEXT,
    impact             TEXT,
    remediation        TEXT,
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_severity CHECK (severity IN ('critical','high','medium','low','informational')),
    CONSTRAINT chk_cvss     CHECK (cvss_score >= 0.0 AND cvss_score <= 10.0)
);

CREATE TABLE IF NOT EXISTS evidence (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id  UUID         NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
    file_name   VARCHAR(255) NOT NULL,
    file_path   TEXT         NOT NULL,
    mime_type   VARCHAR(100),
    file_size   BIGINT       NOT NULL,
    uploaded_by UUID         NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by_id);
CREATE INDEX IF NOT EXISTS idx_findings_project_id ON findings(project_id);
CREATE INDEX IF NOT EXISTS idx_evidence_finding_id ON evidence(finding_id);