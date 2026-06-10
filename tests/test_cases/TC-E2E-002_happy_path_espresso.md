---
tmal-id: TC-E2E-002
creator: tester
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# TC-E2E-002: Happy Path — Espresso without Milk Foam

## Description
Complete order process for an Espresso without milk foam. Verifies in particular that the `froth_milk` step is skipped and the process still completes successfully.

## Test Data
- File: `tests/test_data/order_espresso_no_milk.json`
- Content: `{ "beverage_type": "Espresso", "with_milk_foam": false, "customer_name": "Anna" }`

## Execution
```
node tests/test_scripts/start_all.mjs
node tests/test_scripts/e2e_test.mjs --data tests/test_data/order_espresso_no_milk.json --log
node tests/test_scripts/kill_all.mjs
```

## Steps and Expectations

| Step | Action | Expectation |
|---|---|---|
| 0 | `GET /health` | HTTP 200 |
| 1 | `POST /api/v1/web-channel/session` | HTTP 200, `access_token` present |
| 2 | `POST /api/v1/web-channel/orders` | HTTP 201, `with_milk_foam: false` |
| 3 | Polling process status (max. 15 s) | `process_status: completed` |
| 4 | `GET /api/v1/web-channel/orders/:id` | `status: delivered` |
| 5 | DB verify | `orders.status = delivered`, `process_instances.process_status = completed` |

## Success Criterion
All checks pass; exit code 0.
