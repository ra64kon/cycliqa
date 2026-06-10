---
tmal-id: TEST-README-001
creator: tester
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# Tests — CoffeeToGo

This directory contains the complete test framework for the CoffeeToGo demo application: scripts, test data, run logs, and the test workflow.

Full workflow description: [WORKFLOW.md](WORKFLOW.md)

---

## Quick Start — Typical Test Run

Run all commands from the **project root**:

```bash
# 1. Build
node tests/test_scripts/build_all.mjs --log

# 2. Component tests (no server required)
node tests/test_scripts/component_test.mjs --log

# 3. Start server
node tests/test_scripts/start_all.mjs --log

# 4. E2E test
node tests/test_scripts/e2e_test.mjs --log --data tests/test_data/order_happy_path.json

# 5. Stop server
node tests/test_scripts/kill_all.mjs

# 6. DB check
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_full.sql --log
```

---

## Scripts

### `build_all.mjs` — Build

Compiles TypeScript to `dist/` (`npm install` + `tsc`).

```bash
node tests/test_scripts/build_all.mjs [--log]
```

| Parameter | Meaning |
|---|---|
| `--log` | Write build output to `tests/test_runs/build_<timestamp>.log` |

**Example:**
```bash
node tests/test_scripts/build_all.mjs --log
```

---

### `component_test.mjs` — Component Tests

Runs Vitest unit tests for all or a single component. No running server required.

```bash
node tests/test_scripts/component_test.mjs [--log] [--component <name>]
```

| Parameter | Meaning |
|---|---|
| `--log` | Write test output to `tests/test_runs/component_test_<timestamp>.log` |
| `--component <name>` | Run tests for one component only |

Valid values for `--component`:
`order_terminal` · `brewing_station` · `delivery_robot` · `process_control` · `web_channel`

**Examples:**
```bash
# All components
node tests/test_scripts/component_test.mjs --log

# Only order_terminal
node tests/test_scripts/component_test.mjs --log --component order_terminal
```

---

### `start_all.mjs` — Start Server

Starts `dist/index.js` in the background. Waits until `/health` responds (max. 10 s). Writes PID to `tests/tmp/app.pid`.

```bash
node tests/test_scripts/start_all.mjs [--port <n>] [--log]
```

| Parameter | Meaning |
|---|---|
| `--port <n>` | Server port (default: `3000`) |
| `--log` | Redirect server output to `tests/tmp/app.log` |

**Examples:**
```bash
# Default port 3000
node tests/test_scripts/start_all.mjs --log

# Alternative port
node tests/test_scripts/start_all.mjs --port 4000 --log
```

---

### `kill_all.mjs` — Stop Server

Reads PID from `tests/tmp/app.pid` and terminates the process.

```bash
node tests/test_scripts/kill_all.mjs [--force]
```

| Parameter | Meaning |
|---|---|
| `--force` | Also kills all Node processes on the app port (lsof-based) |

**Examples:**
```bash
node tests/test_scripts/kill_all.mjs

# For stubborn processes
node tests/test_scripts/kill_all.mjs --force
```

---

### `e2e_test.mjs` — End-to-End Test

Tests the complete order process against the running server in 5 steps:

1. `GET /health` — server reachable
2. `POST /api/v1/web-channel/session` — get session token
3. `POST /api/v1/web-channel/orders` — place order
4. `GET /api/v1/process-control/processes/:id` — wait for process (max. 15 s)
5. `GET /api/v1/orders?order_id=...` — check order status

```bash
node tests/test_scripts/e2e_test.mjs [--port <n>] [--log] [--data <json-file>]
```

| Parameter | Meaning |
|---|---|
| `--port <n>` | Server port (default: `3000`) |
| `--log` | Write E2E log to `tests/test_runs/e2e_<timestamp>.log` |
| `--data <file>` | JSON test data file (default: `tests/test_data/order_happy_path.json`) |

**Examples:**
```bash
# Standard happy path
node tests/test_scripts/e2e_test.mjs --log

# Espresso without milk foam
node tests/test_scripts/e2e_test.mjs --log --data tests/test_data/order_espresso_no_milk.json

# Latte Macchiato
node tests/test_scripts/e2e_test.mjs --log --data tests/test_data/order_latte_macchiato.json
```

---

### `db_sql_tool.mjs` — Database SQL Tool

Runs SQL against a local sql.js instance (`--mode node`) or against the running server (`--mode api`).

```bash
node tests/test_scripts/db_sql_tool.mjs --mode <api|node> [--sql "<statement>"] [--file <sql-file>] [--port <n>] [--log] [--out <output-file>]
```

| Parameter | Meaning |
|---|---|
| `--mode node` | SQL locally via Node.js + sql.js (no server required) |
| `--mode api` | SQL via HTTP endpoint of the running app |
| `--sql "<stmt>"` | Specify SQL statement directly |
| `--file <file>` | Load SQL from file |
| `--port <n>` | Server port for API mode (default: `3000`) |
| `--log` | Write DB log to `tests/test_runs/db_<timestamp>.log` |
| `--out <file>` | Also write output to file |

**Examples:**
```bash
# Full DB status (all tables)
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_full.sql --log

# Orders only
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_orders.sql

# Processes and steps
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_processes.sql

# Delivery attempts
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_delivery.sql

# Direct SQL
node tests/test_scripts/db_sql_tool.mjs --mode node --sql "SELECT count(*) FROM orders"

# Test migration
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_migration_001.sql --log

# Write result to file
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_full.sql --out tests/tmp/db_result.txt
```

---

## Test Data

| File | Type | Content |
|---|---|---|
| `order_happy_path.json` | JSON | Cappuccino with milk foam (standard case) |
| `order_espresso_no_milk.json` | JSON | Espresso without milk foam |
| `order_latte_macchiato.json` | JSON | Latte Macchiato with milk foam |
| `order_invalid_missing_beverage.json` | JSON | Negative test: missing required field |
| `db_check_orders.sql` | SQL | Check all orders |
| `db_check_processes.sql` | SQL | Process instances and steps |
| `db_check_delivery.sql` | SQL | Delivery attempts |
| `db_check_full.sql` | SQL | Full DB status (all tables) |
| `db_migration_001.sql` | SQL | Example migration (orders_v2 with comment field) |

---

## Run Logging

Every run with `--log` automatically creates a log file in `tests/test_runs/`:

| Log File | Created By |
|---|---|
| `build_<timestamp>.log` | `build_all.mjs --log` |
| `component_test_<timestamp>.log` | `component_test.mjs --log` |
| `e2e_<timestamp>.log` | `e2e_test.mjs --log` |
| `db_<timestamp>.log` | `db_sql_tool.mjs --log` |

For manual test documentation: copy the template and fill it in:
```bash
cp tests/test_runs/run.template.md tests/test_runs/run_20260609_001.md
```

---

## Environment Variables

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3000` | Server port |
| `COFFEE_TO_GO_JWT_SECRET` | `coffee-to-go-dev-jwt-secret` | JWT secret |
