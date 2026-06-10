---
tmal-id: TEST-WORKFLOW-001
creator: tester
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# Test Workflow: CoffeeToGo

This document describes the complete test workflow for the CoffeeToGo demo application. The typical sequence is: **Build → Component Tests → E2E Test → DB Check**.

---

## Directory Structure

```
tests/
  test_scripts/          # Executable scripts
    build_all.mjs         # TypeScript build
    component_test.mjs    # Vitest unit tests per component
    start_all.mjs         # Start server (writes PID to tmp/)
    kill_all.mjs          # Stop server
    e2e_test.mjs          # End-to-end test (HTTP-based)
    db_sql_tool.mjs       # SQL tool for DB checks and migrations
  test_data/             # Test data and SQL files
    order_happy_path.json          # Cappuccino order (standard case)
    order_espresso_no_milk.json    # Espresso without milk foam
    order_latte_macchiato.json     # Latte Macchiato with milk foam
    order_invalid_missing_beverage.json  # Negative test: missing required field
    db_check_orders.sql            # SQL: check all orders
    db_check_processes.sql         # SQL: process instances and steps
    db_check_delivery.sql          # SQL: delivery attempts
    db_check_full.sql              # SQL: full DB status
    db_migration_001.sql           # Example migration
  test_runs/             # Logs from each test run
    run.template.md      # Template for manual run documentation
    *.log                # Automatically generated logs (--log flag)
  tmp/                   # Temporary files (PID, app log, SQL temp)
```

---

## Prerequisites

- Node.js >= 20, npm >= 10
- Run all scripts from the **project root**: `node tests/test_scripts/<script>.mjs`

---

## Typical Workflow

### Step 1 — Build All

Compiles TypeScript to `dist/`:

```bash
node tests/test_scripts/build_all.mjs --log
```

- Runs `npm install` and `npm run build` (tsc)
- `--log` writes result to `tests/test_runs/build_<timestamp>.log`
- Aborts on error (set -e)

---

### Step 2 — Component Tests

Runs all Vitest unit tests (no server required):

```bash
# All components
node tests/test_scripts/component_test.mjs --log

# Single component
node tests/test_scripts/component_test.mjs --log --component order_terminal
```

Available component values: `order_terminal`, `brewing_station`, `delivery_robot`, `process_control`, `web_channel`

- Tests are located in `src/ts/tests/*.test.ts`
- `--log` writes to `tests/test_runs/component_test_<timestamp>.log`

---

### Step 3 — E2E Test

Tests the complete order process against the running server.

#### 3a. Start server

```bash
node tests/test_scripts/start_all.mjs --log --port 3000
```

- Starts `dist/index.js` in the background
- Waits until `/health` responds (max. 10 s)
- PID is saved to `tests/tmp/app.pid`
- `--log` writes server output to `tests/tmp/app.log`

#### 3b. Run E2E test

```bash
node tests/test_scripts/e2e_test.mjs --log --data tests/test_data/order_happy_path.json
```

Verified steps:
1. `GET /health` — server reachable
2. `POST /api/v1/web-channel/session` — get token
3. `POST /api/v1/web-channel/orders` — place order
4. `GET /api/v1/process-control/processes/:id` — wait for process (max. 15 s)
5. `GET /api/v1/orders?order_id=...` — check order status

Additional test cases:
```bash
node tests/test_scripts/e2e_test.mjs --data tests/test_data/order_espresso_no_milk.json --log
node tests/test_scripts/e2e_test.mjs --data tests/test_data/order_latte_macchiato.json --log
```

#### 3c. Stop server

```bash
node tests/test_scripts/kill_all.mjs
# For stubborn processes:
node tests/test_scripts/kill_all.mjs --force
```

---

### Step 4 — DB Check

Checks the database content after the E2E run. Since the DB is in-memory, `db_sql_tool.mjs --mode node` starts its own sql.js instance with an empty schema for testing SQL queries and migrations.

```bash
# Full status of all tables
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_full.sql --log

# Orders only
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_orders.sql

# Processes and steps
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_processes.sql

# Direct SQL statement
node tests/test_scripts/db_sql_tool.mjs --mode node --sql "SELECT count(*) FROM orders"

# Test migration
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_migration_001.sql --log
```

---

## Run Documentation

Every test run should be documented in `tests/test_runs/`:

1. Copy template: `cp tests/test_runs/run.template.md tests/test_runs/run_<YYYYMMDD>_<NNN>.md`
2. Fill in metadata and result
3. Enter log file paths (generated automatically with `--log`)

---

## Options Overview

| Script               | Option                | Meaning                                    |
|----------------------|-----------------------|--------------------------------------------|
| `build_all.mjs`      | `--log`               | Write build log to test_runs/              |
| `component_test.mjs` | `--log`               | Write test log to test_runs/               |
|                      | `--component <name>`  | Test only one component                    |
| `start_all.mjs`      | `--port <n>`          | Server port (default: 3000)                |
|                      | `--log`               | Server output to tmp/app.log               |
| `kill_all.mjs`       | `--force`             | Kill all processes on the port             |
| `e2e_test.mjs`       | `--port <n>`          | Server port (default: 3000)                |
|                      | `--log`               | Write E2E log to test_runs/                |
|                      | `--data <file>`       | JSON test data file                        |
| `db_sql_tool.mjs`    | `--mode api\|node`    | API mode (server) or node mode (local)     |
|                      | `--sql "<statement>"` | Specify SQL directly                       |
|                      | `--file <file>`       | Load SQL from file                         |
|                      | `--log`               | Write DB log to test_runs/                 |
|                      | `--out <file>`        | Redirect output to file                    |

---

## Environment Variables

| Variable                    | Default                       | Meaning                     |
|-----------------------------|-------------------------------|------------------------------|
| `PORT`                      | `3000`                        | Server port                  |
| `COFFEE_TO_GO_JWT_SECRET`   | `coffee-to-go-dev-jwt-secret` | JWT secret for auth tokens   |
