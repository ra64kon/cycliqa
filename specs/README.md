---
tmal-id: DEL-FA-HUB-001
creator: content_manager
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# specs

This folder bundles the architecture and specification artefacts of the template example `CoffeeToGo`. The structure separates business architecture under `business_spec/`, technical derivation under `software_spec/`, and shared architecture models under `architecture/`.

## Goal

- Translate user needs, business rules, and end-to-end processes into a sound business architecture.
- Derive the business architecture into technical API, database, and integration artefacts.
- Keep shared architecture models, business view, and software view consistent.

## Getting Started

- `../docs/requirements/objective.md`: early vision of the template example
- `../docs/requirements/use_cases/`: early use case views
- This `README.md`: hub for business and technical specification
- `architecture/`: shared architecture models and technical guardrails within `specs/`
- `business_spec/`: business architecture for components, processes, UX, and data
- `software_spec/`: technical architecture for APIs, database, and tech stack

## Business Guardrails

- The role-specific working rules are in `business_spec/AGENTS.md`, `software_spec/AGENTS.md`, `../docs/AGENTS.md`, and `../planning/AGENTS.md`.
- The overarching architecture metamodel is in `architecture/framework/core_architecture.model.md`.
- The binding security metamodel is in `architecture/framework/core_security.model.md`.
- Project-wide technical guardrails are in `software_spec/tech_stack/`.
- The leading domain model is in `architecture/domain_model/domain.coffee_to_go.model.md`.
- The repository view condenses this architecture foundation under `../docs/repository/domain.coffee_to_go.model.md`.

## Views

- **Business view:** E2E processes, components, UX, and data are under `business_spec/`.
- **Software view:** APIs, database, and tech stack artefacts are under `software_spec/`.
- **E2E processes:** The overview is in `../docs/repository/e2e_processes.spec.md`; the detailed elaboration is in `business_spec/processes/coffee_order/coffee_order.spec.md`.
- **Components:** The overview is in `../docs/repository/components.spec.md`; the detailed elaborations are in `business_spec/components/`.
- **Data:** The compact overview is in `../docs/repository/data.spec.md`; the canonical data basis is in `business_spec/data/`.
- **API documentation:** The technical API view is in `software_spec/api/`.

## Document Structure

- **Base path:** The entire architecture is under `specs/`.
- **Hub:** This `README.md` is the leading entry point into the specification landscape.
- **Repository:** Project-wide cross-cutting and overview views are in the main directory `docs/repository/`.
- **Architecture models:** Metamodel, domain model, and guardrails are under `architecture/`.
- **Business artefacts:** Business elaborations are in `business_spec/components/`, `business_spec/processes/`, `business_spec/ux/`, and `business_spec/data/`.
- **Software artefacts:** Technical elaborations are in `software_spec/api/`, `software_spec/database/`, and `software_spec/tech_stack/`.
- **Hubs:** Working and modelling rules are in `business_spec/AGENTS.md`, `software_spec/AGENTS.md`, and the local hubs `../planning/AGENTS.md` and `../docs/AGENTS.md`.

## Reading Logic

- Read this `README.md` first.
- Then read `architecture/framework/core_architecture.model.md`, `software_spec/tech_stack/tech_stack.template.model.md`, `architecture/domain_model/domain.coffee_to_go.model.md`, `../docs/repository/domain.coffee_to_go.model.md`, `business_spec/AGENTS.md`, and `software_spec/AGENTS.md`.
- Then branch into `../docs/repository/e2e_processes.spec.md`, `../docs/repository/components.spec.md`, `../docs/repository/data.spec.md`, `business_spec/`, or `software_spec/` depending on the question.

## Connection in the Project

- **Predecessor:** `../docs/requirements/README.md`
- **Read next:** `../docs/repository/README.md`
- **Central navigation:** `../AGENTS.md`

## Note

The results from `specs/` are authoritative for business architecture, software architecture, code structure, tests, and process views.
