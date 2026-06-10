-- Check all orders
SELECT
  order_id,
  beverage_type,
  with_milk_foam,
  customer_name,
  status,
  created_at
FROM orders
ORDER BY created_at DESC;
