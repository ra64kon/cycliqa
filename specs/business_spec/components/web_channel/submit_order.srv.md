---
tmal-id: FA-SRV-011-WCH-SUBMIT-ORDER
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# submit_order

Component: `web_channel`
Communication pattern: Command
Service type: basic_service

## Input

`beverage_type`, `with_milk_foam`, `customer_name`

## Processing

1. Verify valid web session
2. Create the order via `order_terminal.place_order`
3. Start the process via `process_control.start_order_process`
4. Aggregate the business return value for the web channel

## Output

`order_id`, `process_id`, `status`, `beverage_type`, `with_milk_foam`, `customer_name`

## References

### Canonical Data View

- `order_id`: [../../data/ordering/ordering/order/order/order_id.data.md](../../data/ordering/ordering/order/order/order_id.data.md)
- `process_id`: [../../data/ordering/ordering/order/order/process_id.data.md](../../data/ordering/ordering/order/order/process_id.data.md)
- `status`: [../../data/ordering/ordering/order/order/status.data.md](../../data/ordering/ordering/order/order/status.data.md)
- `beverage_type`: [../../data/ordering/ordering/order/order/beverage_type.data.md](../../data/ordering/ordering/order/order/beverage_type.data.md)
- `with_milk_foam`: [../../data/ordering/ordering/order/order/with_milk_foam.data.md](../../data/ordering/ordering/order/order/with_milk_foam.data.md)
- `customer_name`: [../../data/ordering/ordering/order/order/customer_name.data.md](../../data/ordering/ordering/order/order/customer_name.data.md)
