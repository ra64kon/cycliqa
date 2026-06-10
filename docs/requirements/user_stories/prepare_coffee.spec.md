---
tmal-id: US-002-BREW
creator: business_analyst
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# User Story: Prepare Coffee

## Story

As a customer I want my ordered coffee to be prepared according to the beverage type and milk foam option, so that I receive the expected drink.

## Business Value

The story secures the core value of the example: from an accepted order, grinding, brewing, and optional milk foam produce a finished product.

## Intended Flow

1. An accepted order is handed over to preparation.
2. Beans and grind level are selected to match the beverage type.
3. The coffee is brewed.
4. Milk foam is optionally added.
5. The finished drink is made ready for delivery.

## Business Guardrails

- Preparation only starts for accepted orders.
- Milk foam is only produced if it was ordered.
- A finished coffee must remain unambiguously traceable to an order ID.
- Errors in preparation must visibly block the process.

## Acceptance Criteria

- Given an Espresso order, when preparation starts, then the Espresso is prepared accordingly.
- Given an order without milk foam, when preparation runs, then no frothing step is executed.
- Given an order with milk foam, when preparation runs, then milk foam is added.
- Given a preparation error, when preparation cannot be completed, then no successful completion is reported.

## Open Business Questions

- Which error types in preparation are explicitly distinguished in the example?
  - **Resolved:** The example distinguishes three error types: `BeanShortage` (beans empty), `GrindFailure` (grinder blocked), `BrewFailure` (brewing error). Each error visibly blocks the process and is reported to the customer as a non-successful status.
- Whether future beverage types may require different brewing methods.
  - **Resolved:** For the current example scope, only the three specified types (Espresso, Cappuccino, Latte Macchiato) with their corresponding brewing methods (Espresso: 9 bar pressure, Filter: pour-over) are provided. Additional types or methods are reserved for future project iterations.

## Scope Boundary

The story describes the business production of the drink, not the concrete technical integration of a machine.
