---
tmal-id: FA-SRV-008-DRO-ESCALATE-DELIVERY
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# escalate_delivery

Component: `delivery_robot`
Communication pattern: Command
Service type: basic_service

## Input

`order_id`, `failure_reason`

## Processing

1. Mark the order for manual clarification
2. Return an escalation message with reason (e.g. destination unreachable, obstacle) to the process
3. Return status `escalated` and advance the order status technically to `delivery_escalated`

## Output

`order_id`, `status`, `failure_reason`

## References

### Canonical Data View

- `order_id`: [../../data/delivery/delivery/delivery_order/delivery_order/order_id.data.md](../../data/delivery/delivery/delivery_order/delivery_order/order_id.data.md)
- `delivery_status`: [../../data/delivery/delivery/delivery_order/delivery_order/delivery_status.data.md](../../data/delivery/delivery/delivery_order/delivery_order/delivery_status.data.md)
- `status`: [../../data/coffee_order_process/process_feedback/status.data.md](../../data/coffee_order_process/process_feedback/status.data.md)
- `reason`: [../../data/coffee_order_process/process_feedback/reason.data.md](../../data/coffee_order_process/process_feedback/reason.data.md)
