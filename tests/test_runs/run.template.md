---
tmal-id: TEST-RUN-TEMPLATE
creator: tester
ai-assisted: false
verification-status: unverified
version: 0.1.0
---

# Test Run — YYYY-MM-DD NNN

## Metadata

| Field           | Value                                  |
|-----------------|----------------------------------------|
| Date            | YYYY-MM-DD                             |
| Run number      | NNN                                    |
| Tester          | (name / CI)                            |
| App version     | (git hash or tag)                      |
| Deploy mode     | single / multi                         |
| Port            | 3000                                   |
| Environment     | local / CI                             |

---

## Steps Executed

| # | Command                                                                   | Result  |
|---|---------------------------------------------------------------------------|---------|
| 1 | `node tests/test_scripts/build_all.mjs --log`                             | ✓ / ✗   |
| 2 | `node tests/test_scripts/component_test.mjs --log`                        | ✓ / ✗   |
| 3 | `node tests/test_scripts/start_all.mjs --log`                             | ✓ / ✗   |
| 4 | `node tests/test_scripts/e2e_test.mjs --log --data tests/test_data/order_happy_path.json` | ✓ / ✗ |
| 5 | `node tests/test_scripts/e2e_test.mjs --log --data tests/test_data/order_espresso_no_milk.json` | ✓ / ✗ |
| 6 | `node tests/test_scripts/kill_all.mjs`                                    | ✓ / ✗   |
| 7 | `node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_full.sql --log` | ✓ / ✗ |

---

## Log Files

| Log                                           | Path                                        |
|-----------------------------------------------|---------------------------------------------|
| Build log                                     | `tests/test_runs/build_<timestamp>.log`     |
| Component test log                            | `tests/test_runs/component_test_<timestamp>.log` |
| E2E log (happy path)                          | `tests/test_runs/e2e_<timestamp>.log`       |
| E2E log (espresso)                            | `tests/test_runs/e2e_<timestamp>.log`       |
| DB check log                                  | `tests/test_runs/db_<timestamp>.log`        |
| Server log                                    | `tests/tmp/app.log`                         |

---

## Component Test Results

| Component         | Tests | Passed | Failed |
|-------------------|-------|--------|--------|
| brewing_station   |       |        |        |
| delivery_robot    |       |        |        |
| order_terminal    |       |        |        |
| process_control   |       |        |        |
| web_channel       |       |        |        |
| **Total**         |       |        |        |

---

## E2E Test Results

| Test case                           | Status  | Notes |
|-------------------------------------|---------|-------|
| TC-E2E-001 happy_path_cappuccino    | ✓ / ✗   |       |
| TC-E2E-002 happy_path_espresso      | ✓ / ✗   |       |
| TC-E2E-003 negative_invalid_beverage | ✓ / ✗  |       |

---

## Issues / Observations

- (describe any unexpected behaviour, errors, or deviations here)

---

## Overall Result

- [ ] All checks passed — release candidate
- [ ] Failures found — see issues above
