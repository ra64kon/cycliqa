---
tmal-id: FA-PRO-001-KBW
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.2
---

# Process: Coffee Order

Subdomain: `coffee_order_process`

Purpose: Controls the entire workflow from order placement to delivery. The component `process_control` executes this process across domain boundaries.

## Flow

### Step 1: Accept order (`order_terminal.place_order`)
- Customer interacts via the channel component `web_channel`
- `web_channel` validates the web session and calls `order_terminal.place_order`
- `order_terminal` validates `beverage_type`, `with_milk_foam`, and `customer_name` and generates `order_id`
- `web_channel` then starts the documented process control call `process_control.start_order_process`
- Status: `accepted`

### Step 2: Prepare coffee — sequential (`brewing_station.*`)
- `process_control` calls `grind_beans`, `prepare_coffee`, and optionally `froth_milk` exclusively via their APIs
- `froth_milk` is skipped when `with_milk_foam = false`
- The required services run in sequential order: grind → brew → optionally froth milk
- The technical process status remains `running` during this time; progress is visible via `last_completed_step`
- In the current demo setup, the order status is not advanced to `brewing` during preparation

### Step 3: Deliver (`delivery_robot.deliver_order`)
- `process_control` calls `delivery_robot.deliver_order` exclusively via the API
- `delivery_robot` executes the delivery attempt technically against the internal destination
- The internal delivery destination is fixed to `internal` for the demo
- In the standard demo flow, the first delivery attempt already succeeds
- `process_control` terminates the flow after a successful response
- Status: `delivered`
- Process ends

## Error Handling: Delivery

### Step 3a: Retry on failure (`delivery_robot.retry_delivery`)
- On a failed delivery, `process_control` calls `delivery_robot.retry_delivery`
- Maximum 3 retry attempts
- On success: status `delivered`, process ends
- This path exists in the current demo as a technical alternative path but is not automatically reached in the standard flow

### Step 3b: Escalation after failed retries (`delivery_robot.escalate_delivery`)
- After 3 unsuccessful retries, `process_control` calls `delivery_robot.escalate_delivery`
- Process status: `escalated`; order status: `delivery_escalated`
- Process pauses, manual clarification required
- This path is also modelled in the current demo as a technical alternative path

## Current Demo Scope

- Live progress is provided via the channel `web_channel` based on `process_control.get_process_status` and `last_completed_step`.
- The web channel aggregates the results from `order_terminal` and `process_control` for the browser.

## References

### Canonical Process Data View

- `process_id`: [../../data/coffee_order_process/coffee_order_process_instance/process_id.data.md](../../data/coffee_order_process/coffee_order_process_instance/process_id.data.md)
- `order_id`: [../../data/coffee_order_process/coffee_order_process_instance/order_id.data.md](../../data/coffee_order_process/coffee_order_process_instance/order_id.data.md)
- `process_status`: [../../data/coffee_order_process/coffee_order_process_instance/process_status.data.md](../../data/coffee_order_process/coffee_order_process_instance/process_status.data.md)
- `start_time`: [../../data/coffee_order_process/coffee_order_process_instance/start_time.data.md](../../data/coffee_order_process/coffee_order_process_instance/start_time.data.md)
- `completion_time`: [../../data/coffee_order_process/coffee_order_process_instance/completion_time.data.md](../../data/coffee_order_process/coffee_order_process_instance/completion_time.data.md)
- `last_completed_step`: [../../data/coffee_order_process/coffee_order_process_instance/last_completed_step.data.md](../../data/coffee_order_process/coffee_order_process_instance/last_completed_step.data.md)
- `feedback_type`: [../../data/coffee_order_process/process_feedback/feedback_type.data.md](../../data/coffee_order_process/process_feedback/feedback_type.data.md)
- `status`: [../../data/coffee_order_process/process_feedback/status.data.md](../../data/coffee_order_process/process_feedback/status.data.md)
- `reason`: [../../data/coffee_order_process/process_feedback/reason.data.md](../../data/coffee_order_process/process_feedback/reason.data.md)
