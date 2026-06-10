---
tmal-id: SPEC-API-BACKEND-HUB-001
creator: content_manager
ai-assisted: true
verification-status: unverified
version: 0.1.2
---

# backend

This folder contains the backend OpenAPI files per component.

## Purpose

- Store the individual backend contracts separately and traceably.
- Complement the consolidated project OpenAPI with component-specific specifications.

## Consolidated Project API

- Central, consolidated specification: `../../../openapi.yaml`

## Component Files

- `order_terminal.openapi.yaml`
- `brewing_station.openapi.yaml`
- `delivery_robot.openapi.yaml`
- `process_control.openapi.yaml`
- `web_channel.openapi.yaml`

## Runtime Boundary

- `order_terminal` provides the final order status of the order.
- Ongoing process progress is exposed technically via `process_control` and not via `order_terminal`.
- `delivery_robot` contains both the standard delivery call and the technical alternative paths for retry and escalation.
- `web_channel` is the only channel-bound backend API for the browser frontend.
