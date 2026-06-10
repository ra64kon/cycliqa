-- Delivery attempts
SELECT
  id,
  order_id,
  attempt_number,
  status,
  failure_reason,
  attempted_at
FROM delivery_attempts
ORDER BY id ASC;
