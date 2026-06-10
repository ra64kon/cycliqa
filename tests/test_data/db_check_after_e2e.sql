-- db_check_after_e2e.sql
-- Prüft alle Tabellen nach einem vollständigen E2E-Durchlauf (--mode api).
-- Erwartet: mindestens 1 Bestellung mit status=delivered,
--           mindestens 1 Prozess mit process_status=completed,
--           process_steps vorhanden, delivery_attempts vorhanden.
-- Verwendung: node tests/test_scripts/db_sql_tool.mjs --mode api --file tests/test_data/db_check_after_e2e.sql

SELECT order_id, beverage_type, with_milk_foam, customer_name, status
FROM orders
ORDER BY created_at DESC;

SELECT process_id, order_id, process_status, last_completed_step
FROM process_instances
ORDER BY started_at DESC;

SELECT process_id, step_name, step_status, executed_at
FROM process_steps
ORDER BY process_id, executed_at ASC;

SELECT order_id, attempt_number, status, failure_reason, attempted_at
FROM delivery_attempts
ORDER BY attempted_at DESC;
