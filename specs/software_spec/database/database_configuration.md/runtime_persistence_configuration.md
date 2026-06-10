---
tmal-id: SPEC-DB-CONFIG-001
creator: software_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# Runtime Persistence Configuration

## Goal

This document describes the technical persistence configuration of the current CoffeeToGo demo.

## Configuration

- DB technology: `sql.js`
- Initialisation: at startup of the Node.js runtime via `initializeDatabase()`
- Storage form: in-memory database without persistent storage
- Schema setup: DDL is generated programmatically at runtime

## Technical Consequences

- Data is discarded on every restart.
- The demo is suitable for business and technical flow demonstrations but not for persistent historisation.
- Audit fields such as `created_at`, `updated_at`, `started_at`, `completed_at`, `executed_at`, and `attempted_at` are set purely technically.

## Auth and Runtime Reference

- All protected API endpoints use the same bearer token.
- The token is loaded from `COFFEE_TO_GO_API_KEY`; if the variable is missing, a dev fallback is used.

## Boundary

- This configuration describes the currently implemented demo runtime.
- A later production-grade expansion can add persistent storage, separate deployments, and differentiated secrets management.
