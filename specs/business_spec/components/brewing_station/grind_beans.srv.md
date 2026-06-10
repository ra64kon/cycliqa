---
tmal-id: FA-SRV-003-BST-GRIND-BEANS
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# grind_beans

Component: `brewing_station`
Communication pattern: Command
Service type: basic_service

## Input

`order_id`

## Processing

1. Accept `order_id`
2. Execute the grinding step technically
3. Generate feedback for the step

## Output

`order_id`, `step`, `status`

## References

### Canonical Data View

- `order_id`: [../../data/brewing/brewing/brewing_order/brewing_order/order_id.data.md](../../data/brewing/brewing/brewing_order/brewing_order/order_id.data.md)
- `grind_status`: [../../data/brewing/brewing/brewing_order/brewing_order/grind_status.data.md](../../data/brewing/brewing/brewing_order/brewing_order/grind_status.data.md)
- `grind_setting`: [../../data/brewing/brewing/brewing_order/brewing_order/grind_setting.data.md](../../data/brewing/brewing/brewing_order/brewing_order/grind_setting.data.md)
