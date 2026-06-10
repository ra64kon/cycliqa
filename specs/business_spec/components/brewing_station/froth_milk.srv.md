---
tmal-id: FA-SRV-005-BST-FROTH-MILK
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# froth_milk

Component: `brewing_station`
Communication pattern: Command
Service type: basic_service

## Input

`order_id`

## Processing

1. Accept `order_id`
2. Execute the milk frothing step technically
3. Generate feedback for the step

## Output

`order_id`, `step`, `status`

## References

### Canonical Data View

- `order_id`: [../../data/brewing/brewing/brewing_order/brewing_order/order_id.data.md](../../data/brewing/brewing/brewing_order/brewing_order/order_id.data.md)
- `milk_status`: [../../data/brewing/brewing/brewing_order/brewing_order/milk_status.data.md](../../data/brewing/brewing/brewing_order/brewing_order/milk_status.data.md)
