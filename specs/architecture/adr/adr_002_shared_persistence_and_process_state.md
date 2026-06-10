---
tmal-id: ADR-002
creator: software_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# ADR 002: Shared In-Memory Persistence and Process State in `process_control`

## Status

Accepted Deviation

## Context

The core architecture model requires logically isolated, component-specific persistence as well as a `process_component` without its own persistent state. However, the current CoffeeToGo demo code uses a shared `sql.js` database for all components and persists process instances as well as process steps directly in `process_control`.

## Model Reference

- [core_architecture.model.md](specs/architecture/framework/core_architecture.model.md)

## Finding in Code

- There is exactly one shared in-memory database instance: [src/ts/src/config/db.ts](src/ts/src/config/db.ts)
- The tables `orders`, `process_instances`, `process_steps`, and `delivery_attempts` are created together in the same schema: [src/ts/src/config/db.ts](src/ts/src/config/db.ts)
- `process_control` itself writes `process_status`, `last_completed_step`, and `process_steps`: [src/ts/src/components/process_control/orchestrator.ts](src/ts/src/components/process_control/orchestrator.ts)

## Decision

For the demo scope, a shared technical persistence is used. `process_control` maintains its own technical state in order to easily display live progress and traceability of the example process.

## Consequences

- The persistence is neither component-specific nor logically isolated.
- `process_control` is not stateless and therefore deviates from the model of a purely orchestrating `process_component`.
- The demo gains easy testability and transparent process observation, but loses model-compliant isolation.

## Option for a Model-Compliant Expansion

- Split into component-specific persistence spaces.
- Move process history into a separate observation/monitoring component.
- Reduce `process_control` to a pure orchestration API without its own persistence responsibility.
