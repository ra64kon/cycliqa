---
tmal-id: MOD-ETECH-001
creator: software_architect
ai-assisted: true
verification-status: unverified
version: 0.1.2
---

# Enterprise Tech Stack

This is the project-specific solution stack for the example project Cycliqa (CoffeeToGo).

## Technology Decisions

* Components and services: TypeScript
* API specification: OpenAPI 3.1.0
* API server: Hono
* Infrastructure: Docker, Railway
* Database and views: SQLite (sql.js)
* Process orchestrator: TypeScript Process Orchestrator (custom)
* Validation: Zod
* Testing: vitest
* Development: VS Code
* Version control: GitHub
* Authentication: signed bearer token (JWT)
* Deployment: Railway (Nixpacks, direct GitHub deployment)

## Demo Runtime Profile

* The demo consists of a single Node.js runtime with Hono and the components `web_channel`, `order_terminal`, `brewing_station`, `delivery_robot`, and `process_control`.
* The HTML frontend is served statically from the same runtime at `/app` but only communicates with the `web_channel` component API.
* `web_channel` handles channel, session, and aggregation logic for the web channel.
* `process_control` controls the participating components exclusively via their HTTP APIs.
* Business progress during execution is provided via `process_control` with `process_status` and `last_completed_step`.
* The sql.js database is initialised at startup and kept in memory only; there is no persistent storage in the current demo.
* Authentication uses signed bearer tokens with runtime expiry for web sessions and internal service-to-service calls.

## Concretisation of the Architecture Model

* The DBMS is used cross-domain, deviating from the architecture model. Each domain receives its own logical database.
* For the demo, business aggregates are partially represented in reduced technical runtime structures: `orders`, `process_instances`, `process_steps`, and `delivery_attempts`.
* The order status only reflects acceptance and final results; ongoing process steps are not materialised technically on `orders.status`.

## Security and Integration Profile

* External browser clients obtain a time-limited web session token via `web_channel` and use it as a bearer token.
* Internal component calls use their own service tokens and are separated from browser tokens by role.
* Direct in-process calls between business components are not permitted in the target state; business integration is API-only.
* `web_channel` is the only backend component allowed to contain frontend-specific view logic and channel-bound aggregation.
