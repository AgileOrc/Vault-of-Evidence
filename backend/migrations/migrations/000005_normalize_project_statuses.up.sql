ALTER TABLE projects
    DROP CONSTRAINT IF EXISTS chk_status;

UPDATE projects
SET status = 'upcoming'
WHERE status = 'planning';

UPDATE projects
SET status = 'completed'
WHERE status = 'archived';

ALTER TABLE projects
    ALTER COLUMN status SET DEFAULT 'upcoming';

ALTER TABLE projects
    ADD CONSTRAINT chk_status CHECK (status IN ('active','paused','upcoming','completed'));
