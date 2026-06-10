---
tmal-id: US-001-BREW
creator: business_analyst
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# User Story: Order Coffee

## Story

As a customer I want to order a coffee with a beverage type, milk foam option, and target location, so that my order is unambiguously accepted and traceably started.

## Business Value

The story creates the business entry point into the CoffeeToGo process. The customer triggers the workflow and receives a reliable reference for follow-up questions and status queries.

## Intended Flow

1. The customer selects a beverage type.
2. The customer specifies whether milk foam is desired.
3. The customer provides a target location.
4. The system accepts the order and assigns an order ID.
5. The system confirms acceptance.

## Business Guardrails

- The beverage type must be part of the supported assortment.
- The target location is required for delivery.
- The order ID remains stable throughout the entire process.
- An invalid order must not be silently accepted.

## Acceptance Criteria

- Given a valid beverage type and target location, when the customer orders, then an order ID is assigned.
- Given the order was accepted, when the customer receives the confirmation, then they see the order ID and status `accepted`.
- Given an unsupported beverage type, when the customer orders, then the order is rejected with a business-comprehensible message.
- Given a missing target location, when the customer orders, then no order is accepted.

## Open Business Questions

- Whether the target location must always be a table or may also be a pick-up point.
- Whether additional beverages beyond coffee may be added to scope in the future.

## Scope Boundary

The story describes order intake and input data, not the business execution of preparation or delivery.
