---
tmal-id: SPEC-DB-SCHEMA-001
creator: software_architect
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# CoffeeToGo Runtime Schema

## Goal

This document describes the currently implemented runtime schema of the demo in `src/ts/src/config/db.ts`.

## Tables

### `orders`

- Purpose: technical persistence of the order from `order_terminal`
- Primary key: `order_id`
- Relevant columns: `beverage_type`, `with_milk_foam`, `customer_name`, `status`, `created_at`, `updated_at`
- Business mapping: `Order`

### `process_instances`

- Purpose: technical persistence of the process instance from `process_control`
- Primary key: `process_id`
- Relevant columns: `order_id`, `process_status`, `last_completed_step`, `started_at`, `completed_at`
- Business mapping: `CoffeeOrderProcessInstance`

### `process_steps`

- Purpose: technical runtime trace of the executed process steps
- Primary key: `id`
- Relevant columns: `process_id`, `step_name`, `step_status`, `executed_at`
- Business mapping: reduced technical representation of `ProcessFeedback`

### `delivery_attempts`

- Purpose: technical runtime trace of the delivery attempts
- Primary key: `id`
- Relevant columns: `order_id`, `attempt_number`, `status`, `failure_reason`, `attempted_at`
- Business mapping: reduced technical representation of `DeliveryOrder` and escalation feedback

## Relationships

- `process_instances.order_id` references an order in `orders` from a business perspective.
- `process_steps.process_id` references a process instance in `process_instances`.
- `delivery_attempts.order_id` references an order in `orders` from a business perspective.

## Boundary to the Business View

- The runtime schema is intentionally more compact than the canonical business data view in `../../business_spec/data/`.
- `BrewingOrder` is not persisted as its own table in the current demo.
- Ongoing process steps and delivery attempts are stored as technical event and attempt entries.
