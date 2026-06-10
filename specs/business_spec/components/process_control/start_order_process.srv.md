---
tmal-id: FA-SRV-009-PRC-START-ORDER-PROCESS
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.2
---

# start_order_process

Component: `process_control`
Communication pattern: Command
Service type: basic_service

## Input

`order_id`, `beverage_type`, `with_milk_foam`, optional `process_id`

## Processing

1. Use `process_id` or generate it technically in the format `PROC-{timestamp}`
2. Start the E2E orchestration for the order asynchronously
3. Address the participating components exclusively via their APIs
4. Form the initial execution status `running` for the return value
5. Assign process-relevant feedback from participating components to the `coffee_order_process` context
6. Set `destination` internally to `internal` for technical execution
7. Expose ongoing progress exclusively via `process_status` and `last_completed_step`

## Output

`process_id`, `order_id`, `process_status`

## References

### Canonical Data View

- `order_id`: [../../data/coffee_order_process/coffee_order_process_instance/order_id.data.md](../../data/coffee_order_process/coffee_order_process_instance/order_id.data.md)
- `beverage_type`: [../../data/brewing/brewing/brewing_order/brewing_order/beverage_type.data.md](../../data/brewing/brewing/brewing_order/brewing_order/beverage_type.data.md)
- `with_milk_foam`: [../../data/ordering/ordering/order/order/with_milk_foam.data.md](../../data/ordering/ordering/order/order/with_milk_foam.data.md)
- `process_id`: [../../data/coffee_order_process/coffee_order_process_instance/process_id.data.md](../../data/coffee_order_process/coffee_order_process_instance/process_id.data.md)
- `process_status`: [../../data/coffee_order_process/coffee_order_process_instance/process_status.data.md](../../data/coffee_order_process/coffee_order_process_instance/process_status.data.md)
- `destination`: [../../data/delivery/delivery/delivery_order/delivery_order/destination.data.md](../../data/delivery/delivery/delivery_order/delivery_order/destination.data.md)
