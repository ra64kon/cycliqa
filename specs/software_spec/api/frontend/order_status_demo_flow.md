---
tmal-id: SPEC-FE-FLOW-001
creator: software_architect
ai-assisted: true
verification-status: unverified
version: 0.1.1
---

# Order Status Demo Flow

## Goal

This document describes the target flow of the demo at `/app` with `web_channel` as the channel-bound backend API.

## Flow

1. The frontend fetches a bearer token via `POST /api/v1/web-channel/session`.
2. The frontend sends an order to `POST /api/v1/web-channel/orders`.
3. The response contains `order_id`, `process_id`, and the initial order status.
4. The frontend then starts polling on `GET /api/v1/web-channel/processes/{processId}`.
5. The visible progress is derived from `process_status` and `last_completed_step`.
6. A separate status query via `GET /api/v1/web-channel/orders/{orderId}` returns the order status.

## Technical Characteristics

- Polling interval: 1 second
- Authentication: bearer token with runtime expiry, obtained via the web channel
- Progress display: UI-internal mapping of `last_completed_step` to the steps `grind_beans`, `prepare_coffee`, `froth_milk`, and `deliver_order`
- Error case: when `process_status = escalated`, the process is displayed as an escalation in the UI

## Boundary

- The frontend communicates exclusively with the `web_channel` API.
- The current demo frontend does not capture a business delivery destination; the technical destination is set server-side internally.
