---
tmal-id: ROLE-SPECS-HUB-001
creator: content_manager
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# specs — Roles and Working Rules

This file is the agentic entry point for the `specs/` folder. It references the role-specific working rules for business and software architecture, and defines the mandatory architecture standard.

## Mandatory Architecture Standard

The following models are **binding** for all work within `specs/`. Every business and software artefact must conform to them:

- [specs/architecture/framework/core_architecture.model.md](architecture/framework/core_architecture.model.md)
- [specs/architecture/framework/core_security.model.md](architecture/framework/core_security.model.md)

No artefact may contradict or bypass the constraints defined in these models.

## Roles and Working Rules

### Business Architect

Responsible for components, processes, UX views, and data objects under `business_spec/`.

- [specs/business_spec/AGENTS.md](business_spec/AGENTS.md)

### Software Architect

Responsible for APIs, database, integration, and tech stack decisions under `software_spec/`.

- [specs/software_spec/AGENTS.md](software_spec/AGENTS.md)
