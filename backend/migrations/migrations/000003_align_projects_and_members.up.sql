ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS type VARCHAR(100);

ALTER TABLE project_members
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'pentester';

UPDATE project_members
SET role = 'pm'
FROM projects
WHERE project_members.project_id = projects.id
    AND project_members.user_id = projects.created_by_id;

ALTER TABLE projects
    DROP CONSTRAINT IF EXISTS chk_status;

ALTER TABLE projects
    ADD CONSTRAINT chk_status CHECK (status IN ('planning','active','completed','archived'));

ALTER TABLE project_members
    DROP CONSTRAINT IF EXISTS chk_project_member_role;

ALTER TABLE project_members
    ADD CONSTRAINT chk_project_member_role CHECK (role IN ('pm','dev','pentester'));
