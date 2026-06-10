# AGENTS, Architecture and Reference

This file is the central entry point for agentic orientation in the project. It references the AGENTS.md files of the corresponding folders, each describing the roles and skills relevant to that folder.

The architecture referenced below and the versioning standard are mandatory for this repository.


## Roles and Skills

### Business Developer

The `business_developer` sharpens ideas, findings, and potentials into a professionally actionable starting point.
In the project, they are responsible for the early impulse behind new topics and handing them off in a direction that can be further refined.

### Business Analyst

The `business_analyst` formulates requirements, use cases, and user stories from a business perspective.
In the project, they are responsible for the consistent maturation of requirements under `docs/` as the basis for architecture, implementation, and testing.

- [docs/AGENTS.md](docs/AGENTS.md)

### Product Manager

The `product_manager` manages the backlog, prioritisation, and sprint scoping in planning.
In the project, they are responsible for planning logic, role coordination, and outcome orientation across the entire scope of work.

- [planning/AGENTS.md](planning/AGENTS.md)

### Business Architect

The `business_architect` structures the business architecture in component, process, and UX views.
In the project, they are responsible for the business order and consistency of the specification under `specs/` along the architecture models.

- [specs/business_spec/AGENTS.md](specs/business_spec/AGENTS.md)
- [docs/diagrams/AGENTS.md](docs/diagrams/AGENTS.md)


### Software Architect

The `software_architect` translates the business architecture into technical API, integration, and persistence decisions.
In the project, they are responsible for the technical derivation of the specification as well as architecture decisions aligned with the architecture models.

- [specs/software_spec/AGENTS.md](specs/software_spec/AGENTS.md)
- [docs/diagrams/AGENTS.md](docs/diagrams/AGENTS.md)

## Architecture Models

- [specs/architecture/framework/core_architecture.model.md](specs/architecture/framework/core_architecture.model.md)
- [specs/software_spec/tech_stack/tech_stack.template.model.md](specs/software_spec/tech_stack/tech_stack.template.model.md)

# Versioning Standard

The project uses the TMAL system (Traceable Meta-Annotation Lifecycle) in combination with Semantic Versioning for Markdown artefacts.

- **Required fields for Markdown artefacts:** `tmal-id`, `creator`, `ai-assisted`, `verification-status`, `version`
- **Verification status:** `unverified`, `verified`, `disputed`
- **Versioning:** The leading overall version is in `version.md`; individual specification artefacts version independently for content-relevant changes.
- **Format boundary:** Technical JSON and YAML contract files retain their target format and do not receive Markdown frontmatter.

Commits and pushes are based on `version.md`, which holds the current version. The description is the brief summary of the respective sprint. The `version.md` file is updated at the beginning of a sprint. After the sprint is completed, commit and push take place.
