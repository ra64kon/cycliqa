---
tmal-id: FA-SRV-001-OTM-PLACE-ORDER
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.1
---

# place_order

Component: `order_terminal`
Communication pattern: Command
Service type: data_service

## Input

`beverage_type`, `with_milk_foam`, `customer_name`

## Processing

1. Generate an order ID (`ORDER-{timestamp}`)
2. Validate the order (beverage_type must be Espresso, Cappuccino, or Latte Macchiato)
3. Validate input; `with_milk_foam` must be boolean and `customer_name` must be set
4. Persist the order with status `accepted`
5. Return a confirmation with order context to the calling channel component

## Output

`order_id`, `status`, `beverage_type`, `with_milk_foam`, `customer_name`

## References

### Canonical Data View

- `order_id`: [../../data/ordering/ordering/order/order/order_id.data.md](../../data/ordering/ordering/order/order/order_id.data.md)
- `beverage_type`: [../../data/ordering/ordering/order/order/beverage_type.data.md](../../data/ordering/ordering/order/order/beverage_type.data.md)
- `with_milk_foam`: [../../data/ordering/ordering/order/order/with_milk_foam.data.md](../../data/ordering/ordering/order/order/with_milk_foam.data.md)
- `customer_name`: [../../data/ordering/ordering/order/order/customer_name.data.md](../../data/ordering/ordering/order/order/customer_name.data.md)
- `status`: [../../data/ordering/ordering/order/order/status.data.md](../../data/ordering/ordering/order/order/status.data.md)
