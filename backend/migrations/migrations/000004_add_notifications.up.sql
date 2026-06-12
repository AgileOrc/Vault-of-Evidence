CREATE TABLE IF NOT EXISTS notifications (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type          VARCHAR(30)  NOT NULL,
    title         VARCHAR(255) NOT NULL,
    message       TEXT,
    read          BOOLEAN      NOT NULL DEFAULT FALSE,
    project_id    UUID         REFERENCES projects(id) ON DELETE CASCADE,
    project_name  VARCHAR(255),
    role          VARCHAR(20),
    invited_by_id UUID         REFERENCES users(id) ON DELETE SET NULL,
    invited_by    VARCHAR(255),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_notification_type CHECK (type IN ('info','invitation')),
    CONSTRAINT chk_notification_role CHECK (role IS NULL OR role IN ('pm','dev','pentester'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
