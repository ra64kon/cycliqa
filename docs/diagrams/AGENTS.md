---
tmal-id: ROLE-DIAGRAM-001
creator: content_manager
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Skill: Architecture Diagrams

This file is the local entry point for business and technical architecture diagrams under `docs/diagrams/`.

## Roles in Collaboration

- **`business_architect`:** responsible for the business context diagram in `docs/diagrams/biz_arch_diagram.puml` based on component, process, and term views.
- **`software_architect`:** responsible for the technical context diagram in `docs/diagrams/soft_arch_diagram.puml` based on business architecture, software design, and project models.
- **Architecture binding:** Both diagram views must be compatible with the architecture specifications under `specs/architecture/` and the project-wide decisions under `specs/architecture/adr/`.

## Leading Sources

- `docs/repository/components.spec.md`
- `docs/repository/e2e_processes.spec.md`
- `docs/repository/domain.coffee_to_go.model.md`
- `docs/repository/data.spec.md`
- `specs/business_spec/components/`
- `specs/business_spec/processes/`
- `specs/business_spec/ux/`
- `specs/software_spec/api/`
- `specs/architecture/framework/*.model.md`
- `specs/software_spec/tech_stack/*.md`

## Deliverables

- **Business view:** `docs/diagrams/biz_arch_diagram.puml` and `docs/diagrams/biz_arch_diagram.svg`
- **Technical view:** `docs/diagrams/soft_arch_diagram.puml` and `docs/diagrams/soft_arch_diagram.svg`
- **Renderer:** `tools/diagram_script/render-plantuml.ps1`

## Business Diagram

- Show business actors, business components, and the E2E process context.
- Label arrows with business interaction or responsibility terms, not technical APIs, endpoints, events, or protocols.
- Do not show databases, hosting platforms, frameworks, classes, modules, or technical runtime details.
- Show orchestration only as business process control, not as a concrete technical engine.
