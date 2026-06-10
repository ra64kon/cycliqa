---
tmal-id: SPEC-DATA-ORD-005
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.1
---

# Attribute `status`

## Description

Overall business status of the order from the customer's perspective. In the current demo, ongoing intermediate process steps are reported via the process view and not via this attribute.

## Data Type

- enum

## Key Values

- `accepted`
- `delivered`
- `delivery_escalated`

## References

- Leading Object: `Order`
- Leading Component: `order_terminal`
- Business View: [place_order.srv.md](../../../../../components/order_terminal/place_order.srv.md)
