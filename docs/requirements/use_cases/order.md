---
tmal-id: REQ-UC-001
creator: business_analyst
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Use Case: Place Order

## What is this about?

A customer wants to order a coffee. The order must be accepted and return the order status. The customer selects a beverage type and specifies whether milk foam is desired.

## What is needed?

**Order data:**

- Name of the customer
- Beverage type, e.g. Espresso, Cappuccino, or Latte Macchiato
- Option with or without milk foam
- Order ID for tracking

**Status feedback:**

- The customer immediately receives a confirmation with the order ID.
- The status of the order can be retrieved.

## What must the system be able to do?

- Accept an order with the customer's name
- Generate a unique order ID
- Hand the order off to the further process
- Return the order status, e.g. accepted, in preparation, or completed

## Why is this important?

Without clear order intake, the system does not know what to prepare. The order is the trigger for the entire subsequent workflow.
