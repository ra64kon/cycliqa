---
tmal-id: REQ-UC-003
creator: business_analyst
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Use Case: Deliver Coffee

## What is this about?

Once the coffee is prepared, it must be delivered to the customer. The delivery accepts the finished coffee and reports completion.

## What is needed?

**Delivery data:**

- Order ID for identification
- Beverage information, e.g. type and milk foam preference
- Target location, e.g. table-42 (determined by the system)

**Completion report:**

- Mark order as delivered
- Report status update back to the process

## What must the system be able to do?

- Start delivery
- Record successful delivery
- Handle error cases, e.g. retry or manual escalation

## Why is this important?

Delivery is the final step in the workflow. The order is only complete when the coffee has reached the customer.
