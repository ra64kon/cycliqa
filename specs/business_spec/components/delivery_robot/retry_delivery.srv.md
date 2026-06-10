---
tmal-id: FA-SRV-007-DRO-RETRY-DELIVERY
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# retry_delivery

Component: `delivery_robot`
Communication pattern: Command
Service type: basic_service

## Input

`order_id`

## Processing

1. Determine existing delivery attempts
2. Check whether the maximum number of 3 retries has already been reached
3. Record one more attempt as successful
4. Return status `delivered` or `failed` together with `retry_count`

## Output

`order_id`, `status`, `retry_count`

## References

### Canonical Data View

- `order_id`: [../../data/delivery/delivery/delivery_order/delivery_order/order_id.data.md](../../data/delivery/delivery/delivery_order/delivery_order/order_id.data.md)
- `delivery_status`: [../../data/delivery/delivery/delivery_order/delivery_order/delivery_status.data.md](../../data/delivery/delivery/delivery_order/delivery_order/delivery_status.data.md)
- `attempt_number`: [../../data/delivery/delivery/delivery_order/delivery_order/attempt_number.data.md](../../data/delivery/delivery/delivery_order/delivery_order/attempt_number.data.md)
