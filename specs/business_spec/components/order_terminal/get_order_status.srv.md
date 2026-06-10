---
tmal-id: FA-SRV-002-OTM-GET-ORDER-STATUS
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.1
---

# get_order_status

Component: `order_terminal`
Communication pattern: Query
Service type: data_service

## Input

`order_id`

## Processing

1. Retrieve the order from storage by `order_id`
2. Return the current order status (`accepted`, `delivered`, `delivery_escalated`)
3. In the current demo, ongoing process progress is not exposed via this query but via `process_control.get_process_status`

## Output

`order_id`, `status`, `beverage_type`, `with_milk_foam`, `customer_name`

## References

### Canonical Data View

- `order_id`: [../../data/ordering/ordering/order/order/order_id.data.md](../../data/ordering/ordering/order/order/order_id.data.md)
- `status`: [../../data/ordering/ordering/order/order/status.data.md](../../data/ordering/ordering/order/order/status.data.md)
- `beverage_type`: [../../data/ordering/ordering/order/order/beverage_type.data.md](../../data/ordering/ordering/order/order/beverage_type.data.md)
- `with_milk_foam`: [../../data/ordering/ordering/order/order/with_milk_foam.data.md](../../data/ordering/ordering/order/order/with_milk_foam.data.md)
- `customer_name`: [../../data/ordering/ordering/order/order/customer_name.data.md](../../data/ordering/ordering/order/order/customer_name.data.md)
