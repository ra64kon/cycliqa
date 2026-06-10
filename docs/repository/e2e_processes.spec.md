---
tmal-id: REP-PRO-001
creator: business_architect
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# E2E Processes

This specification contains the E2E process view within the project-wide `repository`. It bundles the E2E processes as a reference list and points to their full elaborations; the corresponding repository views are in `docs/repository/data.spec.md` and `docs/repository/components.spec.md`.

## Process Overview

The full elaboration of the individual E2E processes is located under `specs/business_spec/processes/`; the following list therefore lists the process folders:

- **`Coffee Order`:** `coffee_order/`

## Process Scope

The `Coffee Order` process describes the business flow from order intake via sequential preparation (grinding, brewing, optionally frothing milk) through to delivery. The process control calls services of the components `order_terminal`, `brewing_station`, and `delivery_robot` for this purpose.
