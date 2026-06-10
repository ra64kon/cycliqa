---
tmal-id: FA-SRV-010-PRC-GET-PROCESS-STATUS
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# get_process_status

Component: `process_control`
Communication pattern: Query
Service type: basic_service

## Input

`process_id`

## Processing

1. Evaluate process-related feedback by `process_id`
2. Aggregate the latest execution status and last activity

## Output

`process_id`, `order_id`, `process_status`, `last_completed_step` (optional / `null`)

## References

### Canonical Data View

- `process_id`: [../../data/coffee_order_process/coffee_order_process_instance/process_id.data.md](../../data/coffee_order_process/coffee_order_process_instance/process_id.data.md)
- `order_id`: [../../data/coffee_order_process/coffee_order_process_instance/order_id.data.md](../../data/coffee_order_process/coffee_order_process_instance/order_id.data.md)
- `process_status`: [../../data/coffee_order_process/coffee_order_process_instance/process_status.data.md](../../data/coffee_order_process/coffee_order_process_instance/process_status.data.md)
- `last_completed_step`: [../../data/coffee_order_process/coffee_order_process_instance/last_completed_step.data.md](../../data/coffee_order_process/coffee_order_process_instance/last_completed_step.data.md)
