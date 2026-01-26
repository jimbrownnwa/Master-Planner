-- Migration: Add time slot columns to tasks table
-- Date: 2026-01-26
-- Description: Adds scheduled_start and scheduled_end timestamp columns to support time-slotted calendar view

-- Add new columns to tasks table
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS scheduled_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS scheduled_end TIMESTAMPTZ;

-- Add index for efficient time-based queries
CREATE INDEX IF NOT EXISTS tasks_scheduled_start_idx ON public.tasks(scheduled_start);

-- Migrate existing scheduled tasks to have start times at noon
-- This provides backward compatibility for existing date-only tasks
UPDATE public.tasks
SET scheduled_start = (scheduled_date + INTERVAL '12 hours')::TIMESTAMPTZ,
    scheduled_end = (scheduled_date + INTERVAL '12 hours' + (COALESCE(estimated_minutes, 30) || ' minutes')::INTERVAL)::TIMESTAMPTZ
WHERE scheduled_date IS NOT NULL
  AND scheduled_start IS NULL;

-- Verify the migration
SELECT
  COUNT(*) as total_tasks,
  COUNT(scheduled_date) as tasks_with_date,
  COUNT(scheduled_start) as tasks_with_start_time,
  COUNT(scheduled_end) as tasks_with_end_time
FROM public.tasks;
