-- Process instances
SELECT
  process_id,
  order_id,
  process_status,
  last_completed_step,
  started_at,
  completed_at
FROM process_instances
ORDER BY started_at DESC;

-- Process steps
SELECT
  process_id,
  step_name,
  step_status,
  executed_at
FROM process_steps
ORDER BY id ASC;
