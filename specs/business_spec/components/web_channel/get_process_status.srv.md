---
tmal-id: FA-SRV-013-WCH-GET-PROCESS-STATUS
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# get_process_status

Component: `web_channel`
Communication pattern: Query
Service type: basic_service

## Input

`process_id`

## Processing

1. Verify valid web session
2. Retrieve process progress via `process_control.get_process_status`
3. Pass the return value through for the web channel

## Output

`process_id`, `order_id`, `process_status`, `last_completed_step`
