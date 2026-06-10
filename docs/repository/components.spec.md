---
tmal-id: REP-KOMP-001
creator: business_architect
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Components

This specification contains the component view within the project-wide `repository`. It bundles the components as a reference list and points to their full elaborations; the corresponding data view is in `docs/repository/data.spec.md`.

## Architecture Diagrams

The cross-component dependencies and call directions are visualised in two PlantUML diagrams:

- **Business view:** `../diagrams/biz_arch_diagram.puml` → `../diagrams/biz_arch_diagram.svg`, generated according to `../diagrams/AGENTS.md`.
- **Software architecture view:** `../diagrams/soft_arch_diagram.puml` → `../diagrams/soft_arch_diagram.svg`, generated according to `../diagrams/AGENTS.md`.

Both visualisations can be reproducibly generated in the project with:

```powershell
& "tools/diagram_script/render-plantuml.ps1"
```

If PlantUML is not locally available and the download is blocked, `render-plantuml.ps1` automatically generates SVG fallback visualisations for both diagrams.

## Component Overview

The full elaboration of the individual components is located under `specs/business_spec/components/`; the following list therefore lists the component folders:

- **`order_terminal`:** `order_terminal/`
- **`brewing_station`:** `brewing_station/`
- **`delivery_robot`:** `delivery_robot/`
- **`process_control`:** `process_control/`

## Responsibility Boundaries

- **`order_terminal`:** handles order intake and status information towards the customer.
- **`brewing_station`:** executes the preparation steps of grinding, brewing, and optionally milk foam.
- **`delivery_robot`:** executes the handover of the finished coffee and reports completion.
- **`process_control`:** executes the cross-domain process component of the coffee order process.

## Notes

- The components are each bundled in their own folder in the template.
- Role rules may reference generic `*.spec.md` patterns; this template intentionally documents the existing example structure in this repository view.
