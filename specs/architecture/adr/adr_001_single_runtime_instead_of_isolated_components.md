---
tmal-id: ADR-001
creator: software_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# ADR 001: Single Runtime Instead of Isolated Component Deployments

## Status

Accepted Deviation

## Context

The core architecture model requires that each component be operated as an isolated microservice with its own release cycle and without runtime dependencies on other components. However, the current CoffeeToGo demo code runs all components in a shared Hono application within a single Node.js process.

## Model Reference

- [core_architecture.model.md](specs/architecture/framework/core_architecture.model.md)

## Finding in Code

- A single Hono application registers `order_terminal`, `brewing_station`, `delivery_robot`, and `process_control` together and starts exactly one server process: [src/ts/src/index.ts](src/ts/src/index.ts)
- The frontend `/app` is served from the same runtime: [src/ts/src/index.ts](src/ts/src/index.ts)

## Decision

For the current demo scope, the architecture is deliberately implemented as a single runtime. The business components remain visible as logical cuts, but are not technically operated as separate deployments.

## Consequences

- The demo violates the shared-nothing and deployment-cut model of the core architecture model.
- Components cannot be independently deployed, versioned, or scaled.
- Infrastructure complexity remains low, making the demo easier to start and test.

## Option for a Model-Compliant Expansion

- Separate components into their own deployments with individual runtimes and build/release paths.
- Decouple the served frontend from the shared backend runtime.
