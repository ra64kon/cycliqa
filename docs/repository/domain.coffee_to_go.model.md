---
tmal-id: REP-DOM-001
creator: business_architect
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Domain Model

This model condenses the leading domain model from `../../specs/architecture/domain_model/domain.coffee_to_go.model.md` for the repository view.

Ordering rules from the metamodel:

- A domain is an organisational bracket over subdomains with no technical counterpart.
- Each subdomain is defined by exactly one main business object or documents a justified deviation.
- Each subdomain is assigned to exactly one component.
- E2E processes are scoped from the customer's perspective and can be orchestrated via an independent process control.

## Domain Overview

- **`coffee_to_go`** is the organisational bracket over the subdomains `ordering`, `brewing`, `delivery`, and `coffee_order_process`.

## Domain Description

### Domain `coffee_to_go`

The domain `coffee_to_go` covers the business end-to-end scope of order intake, preparation, delivery, and process control for the template example `CoffeeToGo`.

**Subdomains:**

- **`ordering`** (Aggregate Root: `Order`)
  - **Description:** Accepts the beverage type and milk foam preference, creates an order ID, and makes the status retrievable.
  - **Component:** `order_terminal`
- **`brewing`** (Aggregate Root: `BrewingOrder`)
  - **Description:** Executes grinding, brewing, and optionally milk foam as business sub-steps.
  - **Component:** `brewing_station`
- **`delivery`** (Aggregate Root: `DeliveryOrder`)
  - **Description:** Accepts a completed order, approaches the target location, and marks the order as delivered.
  - **Component:** `delivery_robot`
- **`coffee_order_process`** (Aggregate Root: `CoffeeOrderProcessInstance`)
  - **Description:** Controls the sequence of order intake, sequential preparation, and delivery.
  - **Component:** `process_control`

## Subdomain-to-Component Matrix

| Domain | Subdomain | Aggregate Root | Component |
|---|---|---|---|
| coffee_to_go | ordering | `Order` | `order_terminal` |
| coffee_to_go | brewing | `BrewingOrder` | `brewing_station` |
| coffee_to_go | delivery | `DeliveryOrder` | `delivery_robot` |
| coffee_to_go | coffee_order_process | `CoffeeOrderProcessInstance` | `process_control` |
