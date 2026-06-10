# Cycliqa - Software Lifecycle Automation

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fcycliqa.org)](https://cycliqa.org)

**C**omplete **Y**ield & **C**ode **L**ifecycle **I**ntelligence **Q**uality **A**utomation

Cycliqa is an architecture-driven template for AI-agent-based specification and implementation of unstructured business requirements. It serves to automate and orchestrate the entire Software Development Lifecycle (SDLC). The primary goal of the framework is to seamlessly bridge the gap between business requirements, functional and technical specifications, IT security, and enterprise-ready code, while ensuring technology-agnostic reproducibility.

## Challenges in the Modern SDLC
Depending on the methodical approach, software development faces specific challenges that Cycliqa systematically addresses:

1. Classical Projects

* Silos & Media Discontinuities: Planning, architecture, implementation, and QA often operate independently of one another.
* Downstream Quality Assurance: Testing and security analyses usually occur only after implementation, making bug fixes more expensive.

2. Spec-Driven Development

* Code Drift: Over the course of a project, the specification and the actual source code increasingly diverge.
* Synchronization Overhead: The manual maintenance of specification documents parallel to the code creates significant overhead.

3. AI-Agent-Driven Development

* Code Heterogeneity: Different AI agents leave behind varying programming styles, leading to a codebase that is difficult to maintain.
* Token Explosion: A lack of architectural guardrails leads to exponentially rising token costs during ongoing refactorings.

## Cycliqa's Solution Concepts

Cycliqa solves these problems through an architecture-centric, automated approach:

* Prevention of Code Drift (Spec-Driven Solved): The framework accepts abstract project requirements or architecture sketches and translates them directly into structured, testable artifacts. As a result, the source code is fully reproducible from the specification at any time.
* Structured Agent Collaboration (AI-Driven Solved): Through a firmly predefined architectural framework, AI agents receive clear guardrails. This prevents inconsistent code styles and minimizes token consumption during refactorings.
* Quality & Security by Design (Classical Solved): Quality assurance and vulnerability analyses are natively integrated into the generation phase. Tests are designed simultaneously with the architecture, rather than after the code has been created.

## Core Features

* End-to-End SDLC Automation: Linking planning, architecture, implementation, testing, and deployment into a continuous, seamless workflow.
* Intelligent Architecture Design: Generating deep system architectures from initial prompts while adhering to established software architecture standards.
* Technology Agnosticism: The core concept is independent of the chosen technology stack and can be flexibly applied to various programming languages and frameworks.

## Base Architecture Model

The heart of the framework is a architecture model that is compliant with nearly all common architecture and it-security standards. It is defined in `specs/architecture/framework/`.

## Getting Started for Agents

For new AI chat windows and agentic work, the recommended reading order is:

1. `AGENTS.md`
2. `README.md`
3. `version.md`
4. `docs/README.md`
5. `planning/AGENTS.md`
6. `planning/WORKFLOW.md`
7. `specs/README.md`
8. `specs/business_spec/AGENTS.md`
9. `specs/software_spec/AGENTS.md`
10. the specifications relevant to the task under `docs/`, `planning/`, and `specs/`

For deeper exploration:

- Business content and requirements: `docs/README.md`, `docs/requirements/`, `specs/README.md`, `specs/business_spec/`, `docs/repository/`
- Planning and working practices: `planning/AGENTS.md`, `planning/WORKFLOW.md`
- Architecture and models: `specs/architecture/README.md`, `specs/architecture/framework/core_architecture.model.md`, `specs/software_spec/tech_stack/tech_stack.template.model.md`
- Implementation: `specs/software_spec/`, `specs/README.md`, and `src/`

## Project Structure

The top-level structure of the project is:

- `AGENTS.md`: central entry point for agentic orientation
- `docs/`: documentation hub for requirements, repository views, and diagrams
- `planning/`: planning, sprint, and coordination artefacts
- `specs/`: specification hub with shared architecture, `business_spec/`, and `software_spec/`
- `integration/`: external reference interfaces and integration artefacts
- `src/`: source code and runnable examples
- `tests/`: tests, test runs, and test utilities
- `version.md`: leading version of the project

Details on sub-structures are in the respective hubs under `docs/README.md`, `planning/AGENTS.md`, `planning/WORKFLOW.md`, `specs/README.md`, and `specs/architecture/README.md`.

## License

This project is licensed under the **Apache License, Version 2.0**.

The Apache 2.0 License permits commercial use, modification, distribution, and private use, subject to preserving copyright notices and disclaimers. Unlike pure copyleft licences, it offers broad freedoms and also grants explicit patent rights from contributors to users.

See the [LICENSE](LICENSE) file in the root directory for the full licence text.

## CoffeeToGo Demo Application

The project contains an implemented demo application (CoffeeToGo) under `src/ts/`. CoffeeToGo simulates a coffee ordering process with the components order terminal, brewing station, delivery robot, process control, and web channel.

The `web_channel` component is the public-facing API facade. It issues short-lived JWT session tokens and proxies all customer interactions (place order, poll process, check order status). The internal components communicate via the same JWT mechanism.

### Prerequisites

* Node.js >= 20
* npm >= 10

### Installation & Start

#### Development (tsx, no build required)

```bash
cd src/ts
npm install
npm run dev          # starts on port 3000 (DEPLOY_MODE=single)
```

**Open in browser:** http://localhost:3000/app

#### Single Runtime via test scripts (compiled)

```bash
# 1. Build TypeScript to dist/
node tests/test_scripts/build_all.mjs [--log]

# 2. Start server
node tests/test_scripts/start_all.mjs [--port <n>] [--log]

# 3. Stop server
node tests/test_scripts/kill_all.mjs [--force]
```

The server runs at `http://localhost:3000`.

#### Multi Runtime (each component as its own process)

After building, start each component individually:

```bash
# in src/ts/ — one terminal per component
npm run dev:web-channel       # :3001
npm run dev:order-terminal    # :3002
npm run dev:brewing-station   # :3003
npm run dev:delivery-robot    # :3004
npm run dev:process-control   # :3005
```

Or use the test script (kills existing processes first, then starts all 5):

```bash
node tests/test_scripts/start_multi.mjs [--log]
node tests/test_scripts/kill_all.mjs --multi
```

### API Endpoints

The public entry point is the **Web Channel** (`/api/v1/web-channel/*`). All endpoints except `/health` and `POST /session` require a JWT Bearer token obtained from the session endpoint.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET  | `/health` | — | Health check |
| POST | `/api/v1/web-channel/session` | — | Obtain JWT session token |
| POST | `/api/v1/web-channel/orders` | JWT | Place order |
| GET  | `/api/v1/web-channel/orders/:id` | JWT | Get order status |
| GET  | `/api/v1/web-channel/processes/:id` | JWT | Get process status |

Internal component endpoints (JWT required, not intended for direct client use):

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/order-terminal/orders` | Create order (internal) |
| GET  | `/api/v1/order-terminal/orders` | Query orders (internal) |
| POST | `/api/v1/brewing/grind` | Grind beans |
| POST | `/api/v1/brewing/prepare` | Prepare coffee |
| POST | `/api/v1/brewing/froth-milk` | Froth milk |
| POST | `/api/v1/delivery` | Start delivery |
| POST | `/api/v1/delivery/retry` | Retry delivery |
| POST | `/api/v1/delivery/escalate` | Escalate |
| POST | `/api/v1/process-control/processes` | Start process |
| GET  | `/api/v1/process-control/processes/:id` | Get process status |

### Example Calls

```bash
# 1. Obtain a session token (no auth required)
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/web-channel/session \
  | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).access_token))")

# 2. Place an order
curl -s -X POST http://localhost:3000/api/v1/web-channel/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"beverage_type":"Cappuccino","with_milk_foam":true,"customer_name":"Alice"}'

# 3. Poll process status (replace PROC-... with the process_id from step 2)
curl -s http://localhost:3000/api/v1/web-channel/processes/PROC-1234567890 \
  -H "Authorization: Bearer $TOKEN"

# 4. Get final order status
curl -s http://localhost:3000/api/v1/web-channel/orders/ORDER-1234567890 \
  -H "Authorization: Bearer $TOKEN"
```

For live progress the process status is authoritative; the order status is updated to `delivered` once the process completes.

### Running Tests

Tests are run according to `tests/WORKFLOW.md`. Quick start:

```bash
# Unit tests only (no server required)
node tests/test_scripts/component_test.mjs --log

# Full workflow: build → start → E2E → stop → DB check
node tests/test_scripts/build_all.mjs --log
node tests/test_scripts/start_all.mjs --log
node tests/test_scripts/e2e_test.mjs --log --data tests/test_data/order_happy_path.json
node tests/test_scripts/kill_all.mjs
node tests/test_scripts/db_sql_tool.mjs --mode node --file tests/test_data/db_check_full.sql --log
```

### Tech Stack

* **Runtime:** TypeScript + Hono
* **Validation:** Zod
* **Auth:** JWT (hono/jwt, HS256, `COFFEE_TO_GO_JWT_SECRET`)
* **Database:** SQLite (sql.js – WASM, no native build tools required)
* **Orchestrator:** TypeScript Process Orchestrator (custom, single/multi mode)
* **Testing:** Vitest (unit) + custom E2E scripts
* **Deployment:** Railway (Nixpacks) or Docker

### Deployment on Railway

The demo supports two deployment variants on Railway via Nixpacks.

#### Single Runtime (one Railway service)

1. Connect the GitHub repository with Railway: Railway Dashboard → *New Project* → *Deploy from GitHub Repo*
2. Set **Root Directory** to `src/ts` — Railway detects `nixpacks.toml` and runs `npm run build` + `npm run start`
3. Set environment variables in the service:

```
PORT=3000
DEPLOY_MODE=single
COFFEE_TO_GO_JWT_SECRET=<secure-secret>
```

#### Multi Runtime (5 Railway services)

1. Create a separate Railway service per component (all from the same repo)
2. Set **Root Directory** per service to `src/ts`
3. Override **Start Command** per service (Railway Dashboard → Service → Settings → Deploy → Custom Start Command):

| Service | Start Command |
|---|---|
| `web-channel` | `npm run start:web-channel` |
| `order-terminal` | `npm run start:order-terminal` |
| `brewing-station` | `npm run start:brewing-station` |
| `delivery-robot` | `npm run start:delivery-robot` |
| `process-control` | `npm run start:process-control` |

4. Enable Private Networking (Railway Dashboard → Project → Settings → Networking)
5. Set environment variables per service. For `web_channel` and `process_control` also set the internal service URLs:

Internal service URLs on Railway (Private Networking):

```
SERVICE_ORDER_TERMINAL_URL=http://order-terminal.railway.internal:3002
SERVICE_BREWING_STATION_URL=http://brewing-station.railway.internal:3003
SERVICE_DELIVERY_ROBOT_URL=http://delivery-robot.railway.internal:3004
SERVICE_PROCESS_CONTROL_URL=http://process-control.railway.internal:3005
```

For local multi-mode testing use the test script:
```bash
node tests/test_scripts/start_multi.mjs --log
```

### `src/ts/` Project Structure

```
src/ts/
├── package.json
├── tsconfig.json
├── Dockerfile
├── src/
│   ├── index.ts                    # Entry point — Single mode
│   ├── config/
│   │   ├── auth.ts                 # JWT secret & token helpers
│   │   ├── db.ts                   # SQLite (sql.js, in-memory)
│   │   └── env.ts                  # Environment variable defaults
│   ├── middleware/
│   │   └── auth.ts                 # JWT Bearer middleware (hono/jwt)
│   ├── schemas/                    # Zod validation schemas
│   │   ├── web_channel.schema.ts
│   │   ├── order_terminal.schema.ts
│   │   ├── brewing_station.schema.ts
│   │   ├── delivery_robot.schema.ts
│   │   └── process_control.schema.ts
│   ├── components/
│   │   ├── web_channel/            # Public facade — session, orders, processes
│   │   ├── order_terminal/         # Order intake & status queries
│   │   ├── brewing_station/        # Grinding, brewing, milk foam
│   │   ├── delivery_robot/         # Delivery, retry, escalation
│   │   └── process_control/        # Orchestrator & process status
│   └── servers/                    # Entry points — Multi mode
│       ├── web_channel.ts          # :3001
│       ├── order_terminal.ts       # :3002
│       ├── brewing_station.ts      # :3003
│       ├── delivery_robot.ts       # :3004
│       └── process_control.ts      # :3005
├── public/
│   └── app.html                    # Browser demo app (JWT session + live status)
└── tests/
    ├── brewing_station.test.ts
    ├── delivery_robot.test.ts
    ├── order_terminal.test.ts
    └── process_control.test.ts
```
