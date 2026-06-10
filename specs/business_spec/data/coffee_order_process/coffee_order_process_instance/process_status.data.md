---
tmal-id: SPEC-DATA-PRO-003
creator: business_architect
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Attribute `process_status`

## Description

Overall status of the process instance.

## Data Type

- enum

## Key Values

- `running`
- `completed`
- `escalated`

## References

- Leading Object: `CoffeeOrderProcessInstance`
- Leading Process: [coffee_order.spec.md](../../../processes/coffee_order/coffee_order.spec.md)
- Leading Component: [get_process_status.srv.md](../../../components/process_control/get_process_status.srv.md)
