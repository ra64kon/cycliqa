---
tmal-id: FA-SRV-004-BST-PREPARE-COFFEE
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# prepare_coffee

Component: `brewing_station`
Communication pattern: Command
Service type: basic_service

## Input

`order_id`

## Processing

1. Accept `order_id`
2. Execute the brewing step technically
3. Generate feedback for the step

## Output

`order_id`, `step`, `status`

## References

### Canonical Data View

- `order_id`: [../../data/brewing/brewing/brewing_order/brewing_order/order_id.data.md](../../data/brewing/brewing/brewing_order/brewing_order/order_id.data.md)
- `beverage_type`: [../../data/brewing/brewing/brewing_order/brewing_order/beverage_type.data.md](../../data/brewing/brewing/brewing_order/brewing_order/beverage_type.data.md)
- `brew_status`: [../../data/brewing/brewing/brewing_order/brewing_order/brew_status.data.md](../../data/brewing/brewing/brewing_order/brewing_order/brew_status.data.md)
