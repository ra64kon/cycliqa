-- Migration 001: Add comment field to orders
-- Creates orders_v2 with an additional 'comment' column.
-- Example of a backwards-compatible schema extension.

CREATE TABLE IF NOT EXISTS orders_v2 (
  order_id      TEXT    PRIMARY KEY,
  beverage_type TEXT    NOT NULL,
  with_milk_foam INTEGER NOT NULL DEFAULT 0,
  customer_name TEXT    NOT NULL,
  status        TEXT    NOT NULL DEFAULT 'accepted',
  comment       TEXT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Copy existing orders (comment defaults to NULL)
INSERT OR IGNORE INTO orders_v2
  (order_id, beverage_type, with_milk_foam, customer_name, status, created_at, updated_at)
SELECT order_id, beverage_type, with_milk_foam, customer_name, status, created_at, updated_at
FROM orders;

SELECT 'Migration 001 completed' AS result;
SELECT count(*) AS orders_migrated FROM orders_v2;
