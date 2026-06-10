---
tmal-id: US-003-BREW
creator: business_analyst
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# User Story: Deliver Coffee

## Story

As a customer I want my finished coffee to be brought to my target location and the order to be closed afterwards, so that the process ends in a way that is traceable for me.

## Business Value

The story closes the value stream. Only with a successful handover is the CoffeeToGo order business-complete.

## Intended Flow

1. A finished coffee is handed over to delivery.
2. The target location is approached.
3. The coffee is handed over.
4. The order is marked as delivered.
5. The customer can see the completion in the status.

## Business Guardrails

- Delivery only starts after preparation is complete.
- The target location comes from the order.
- A failed handover must not appear as a success.
- The order ID remains the leading reference for completion and status.

## Acceptance Criteria

- Given a finished coffee, when delivery starts, then the target location from the order is used.
- Given a successful handover, when delivery is complete, then the status is `delivered`.
- Given a failed handover, when delivery aborts, then the order remains open or is marked as failed.
- Given an order ID, when the customer queries the status after handover, then they see the completed state.

## Open Business Questions

- How many retry attempts are planned in the example?
  - **Resolved:** The example allows a maximum of 3 automatic retry attempts. After the 3rd failure, the order is marked as failed (status `delivery_failed`) and a manual escalation is triggered.
- Whether a manual handover as fallback is within the example scope.
  - **Resolved:** A manual handover is not planned as an automated fallback in the example scope. Instead, after failed retry attempts, the order is made visible for external handling through the status `delivery_failed`.

## Scope Boundary

The story describes the business handover, not the optimisation of routes or robotics control.
