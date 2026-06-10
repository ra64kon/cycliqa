---
tmal-id: SPEC-API-HUB-001
creator: content_manager
ai-assisted: true
verification-status: unverified
version: 0.1.2
---

# api

This folder is the entry point for API documentation within `specs/software_spec/`.

## Purpose

- Bundle API-related specifications and references.
- Provide a stable target path for technical contract artefacts.

## Entry Points

- API-relevant business views are in `../../business_spec/components/`, `../../business_spec/processes/`, and `../../business_spec/ux/`.
- Further technical design views are in `../database/` and `../tech_stack/`.
- Project-wide cross-cutting references are in `../../docs/repository/`.
- The consolidated project OpenAPI is in `../../openapi.yaml`.
- Backend OpenAPI files are in `backend/`.
- The technical frontend flow of the demo is in `frontend/`.
- The web channel is specified via `backend/web_channel.openapi.yaml`.

## Contents

- `backend/`: component-based OpenAPI files for the backend interfaces.
- `frontend/`: technical description of browser and polling flows.
- `../../openapi.yaml`: consolidated project OpenAPI.
