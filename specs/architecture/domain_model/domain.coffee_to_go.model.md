---
tmal-id: REP-DOM-001
creator: business_architect
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Domain Model

This model structures the business capabilities of the template example `CoffeeToGo` according to the architecture metamodel from `../framework/core_architecture.model.md`.

Ordering rules from the metamodel:

- A domain is an organisational bracket over subdomains with no technical counterpart.
- Each subdomain is defined by exactly one main business object or documents a justified deviation.
- Each subdomain is assigned to exactly one component.
- E2E processes are scoped from the customer's perspective and can be orchestrated via an independent process control.

## Domain Overview

- **`coffee_to_go`** is the business and organisational bracket of the template example.
- Within `coffee_to_go`, the subdomains `ordering`, `brewing`, `delivery`, and `coffee_order_process` are distinctly scoped.

## Domain Description

### Domain `coffee_to_go`

The domain `coffee_to_go` covers the business end-to-end scope of order intake, preparation, delivery, and process control for the template example `CoffeeToGo`.

**Subdomains:**

- **`ordering`** (Aggregate Root: `Order`)
  - **Description:** Accepts the beverage type, milk foam preference, and customer name; creates an order ID; and makes the order status retrievable.
  - **Component:** `order_terminal`
- **`brewing`** (Aggregate Root: `BrewingOrder`)
  - **Description:** Executes grinding, brewing, and optionally milk foam as business sub-steps of preparation.
  - **Component:** `brewing_station`
- **`delivery`** (Aggregate Root: `DeliveryOrder`)
  - **Description:** Accepts a completed order, executes delivery attempts, and marks the order as delivered or escalated.
  - **Component:** `delivery_robot`
- **`coffee_order_process`** (Aggregate Root: `CoffeeOrderProcessInstance`)
  - **Description:** Controls the sequence of order intake, sequential preparation, delivery, retry, and escalation.
  - **Component:** `process_control`

## Subdomain-to-Component Matrix

| Domain | Subdomain | Aggregate Root | Component |
|---|---|---|---|
| coffee_to_go | ordering | `Order` | `order_terminal` |
| coffee_to_go | brewing | `BrewingOrder` | `brewing_station` |
| coffee_to_go | delivery | `DeliveryOrder` | `delivery_robot` |
| coffee_to_go | coffee_order_process | `CoffeeOrderProcessInstance` | `process_control` |
