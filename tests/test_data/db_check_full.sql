-- Full DB status: row counts for all tables
SELECT 'orders'             AS table_name, count(*) AS rows FROM orders
UNION ALL
SELECT 'process_instances'  AS table_name, count(*) AS rows FROM process_instances
UNION ALL
SELECT 'process_steps'      AS table_name, count(*) AS rows FROM process_steps
UNION ALL
SELECT 'delivery_attempts'  AS table_name, count(*) AS rows FROM delivery_attempts;

-- Orders
SELECT order_id, beverage_type, with_milk_foam, customer_name, status
FROM orders
ORDER BY created_at DESC;

-- Process instances
SELECT process_id, order_id, process_status, last_completed_step
FROM process_instances
ORDER BY started_at DESC;

-- Process steps
SELECT process_id, step_name, step_status, executed_at
FROM process_steps
ORDER BY id ASC;

-- Delivery attempts
SELECT order_id, attempt_number, status, failure_reason
FROM delivery_attempts
ORDER BY id ASC;
