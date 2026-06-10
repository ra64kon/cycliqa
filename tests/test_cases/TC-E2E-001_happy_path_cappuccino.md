---
tmal-id: TC-E2E-001
creator: tester
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# TC-E2E-001: Happy Path — Cappuccino with Milk Foam

## Description
Complete order process for a Cappuccino with milk foam. Verifies the entire flow from web session token to delivery including DB verification.

## Test Data
- File: `tests/test_data/order_happy_path.json`
- Content: `{ "beverage_type": "Cappuccino", "with_milk_foam": true, "customer_name": "Ralf" }`

## Execution
```
node tests/test_scripts/start_all.mjs
node tests/test_scripts/e2e_test.mjs --data tests/test_data/order_happy_path.json --log
node tests/test_scripts/kill_all.mjs
```

## Steps and Expectations

| Step | Action | Expectation |
|---|---|---|
| 0 | `GET /health` | HTTP 200, `status: ok` |
| 1 | `POST /api/v1/web-channel/session` | HTTP 200, `access_token` present |
| 2 | `POST /api/v1/web-channel/orders` | HTTP 201, `order_id` and `process_id` present |
| 3 | `GET /api/v1/web-channel/processes/:id` (polling max. 15 s) | `process_status: completed` |
| 4 | `GET /api/v1/web-channel/orders/:id` | HTTP 200, `status: delivered` |
| 5 | DB verify via `POST /api/v1/internal/db-query` | `orders.status = delivered`, `process_instances.process_status = completed`, `delivery_attempts` present |

## Success Criterion
All checks pass; exit code 0.
