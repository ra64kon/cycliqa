---
tmal-id: TC-E2E-003
creator: tester
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# TC-E2E-003: Negative Test — Invalid Order (missing/invalid beverage_type)

## Description
Sends an order with an invalid `beverage_type` value. Expects HTTP 400 with a Zod error message. No process is started; no DB entries are created.

## Test Data
- File: `tests/test_data/order_invalid_missing_beverage.json`
- Content: `{ "beverage_type": "", "with_milk_foam": true, "customer_name": "Test" }`

## Execution
```
node tests/test_scripts/start_all.mjs
node tests/test_scripts/e2e_test.mjs --data tests/test_data/order_invalid_missing_beverage.json --log
node tests/test_scripts/kill_all.mjs
```

## Note on Execution
This test case expects HTTP 400 in step 2 and therefore fails in the standard E2E script (which expects HTTP 201). It serves as a manual test case or as a basis for a dedicated negative test script mode.

## Steps and Expectations

| Step | Action | Expectation |
|---|---|---|
| 0 | `GET /health` | HTTP 200 |
| 1 | `POST /api/v1/web-channel/session` | HTTP 200 |
| 2 | `POST /api/v1/web-channel/orders` | **HTTP 400**, `error` contains Zod error message for `beverage_type` |
| — | DB verify | No new entries in `orders` or `process_instances` |

## Success Criterion
HTTP 400 in step 2 with a structured error message.
