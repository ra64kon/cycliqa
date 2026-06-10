---
tmal-id: TC-DB-001
creator: tester
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# TC-DB-001: DB Completeness Check After E2E Run

## Description
Checks the state of all DB tables after a complete E2E run (at least one order) via `db_sql_tool.mjs --mode api`.

## Precondition
- Server is running
- At least one E2E run has been executed

## Execution
```
node tests/test_scripts/db_sql_tool.mjs --mode api --file tests/test_data/db_check_after_e2e.sql --log
```

## Expected Result

| Table | Expectation |
|---|---|
| `orders` | at least 1 row, `status = delivered` |
| `process_instances` | at least 1 row, `process_status = completed` |
| `process_steps` | steps `grind_beans`, `prepare_coffee` present |
| `delivery_attempts` | at least 1 row, `status` set |

## Success Criterion
All SELECT queries return the expected data; no SQL errors.
