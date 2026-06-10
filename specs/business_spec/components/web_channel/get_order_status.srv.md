---
tmal-id: FA-SRV-012-WCH-GET-ORDER-STATUS
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# get_order_status

Component: `web_channel`
Communication pattern: Query
Service type: basic_service

## Input

`order_id`

## Processing

1. Verify valid web session
2. Retrieve order status via `order_terminal.get_order_status`
3. Pass the return value through for the web channel

## Output

`order_id`, `status`, `beverage_type`, `with_milk_foam`, `customer_name`
