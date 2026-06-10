---
tmal-id: SPEC-DATA-DEL-002
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.1
---

# Attribute `destination`

## Description

Business destination of the delivery. In the current demo scope, this destination is not entered by the customer but is preset server-side to `internal`.

## Data Type

- string

## Key Values

- `internal` for technical execution in the template process

## References

- Leading Object: `DeliveryOrder`
- Leading Component: `delivery_robot`
- Business View: [deliver_order.srv.md](../../../../../components/delivery_robot/deliver_order.srv.md)
