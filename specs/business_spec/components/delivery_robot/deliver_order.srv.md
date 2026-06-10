---
tmal-id: FA-SRV-006-DRO-DELIVER-ORDER
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.1
---

# deliver_order

Component: `delivery_robot`
Communication pattern: Command
Service type: data_service

## Input

`order_id`, `destination`

## Processing

1. Determine existing delivery attempts for the order
2. Count the delivery attempt
3. In the current demo standard path, use the technically set destination `internal`
4. Up to the second attempt, simulate success and set status `delivered`
5. From the third attempt onwards, return status `failed`
6. Return the result to the controlling process control component

## Output

`order_id`, `status`, `attempt_number`

## References

### Canonical Data View

- `order_id`: [../../data/delivery/delivery/delivery_order/delivery_order/order_id.data.md](../../data/delivery/delivery/delivery_order/delivery_order/order_id.data.md)
- `destination`: [../../data/delivery/delivery/delivery_order/delivery_order/destination.data.md](../../data/delivery/delivery/delivery_order/delivery_order/destination.data.md)
- `delivery_status`: [../../data/delivery/delivery/delivery_order/delivery_order/delivery_status.data.md](../../data/delivery/delivery/delivery_order/delivery_order/delivery_status.data.md)
- `attempt_number`: [../../data/delivery/delivery/delivery_order/delivery_order/attempt_number.data.md](../../data/delivery/delivery/delivery_order/delivery_order/attempt_number.data.md)
