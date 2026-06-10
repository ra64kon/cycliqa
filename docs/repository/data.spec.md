---
tmal-id: REP-DAT-001
creator: business_architect
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Data

This file describes the overarching business data aspects of the template example `CoffeeToGo`. The canonical data basis is located under `specs/business_spec/data/`; component-specific business objects are described under `specs/business_spec/components/` and process data is located under `specs/business_spec/processes/coffee_order/coffee_order.spec.md`.

## Compact Overview

This overview compactly summarises the business data objects and attributes from requirements, business architecture, and process views.

### Component Business Objects

- **`Order`:** `order_id`, `order_uuid`, `beverage_type`, `with_milk_foam`, `status`
- **`BrewingOrder`:** `order_id`, `order_uuid`, `beverage_type`, `grind_status`, `grind_setting`, `brew_status`, `milk_status`
- **`DeliveryOrder`:** `order_id`, `order_uuid`, `destination`, `delivery_status`

### Process Business Objects

- **`CoffeeOrderProcessInstance`:** `process_id`, `process_uuid`, `order_id`, `process_status`, `start_time`, `completion_time`
- **`ProcessFeedback`:** `process_feedback_id`, `process_feedback_uuid`, `order_id`, `feedback_type`, `status`, `reason`

## Status Values

- **`accepted`:** Order was accepted and can proceed to preparation.
- **`brewing`:** Preparation is running or was started.
- **`delivered`:** Coffee was delivered and the process is complete.
- **`completed`:** A preparation step was executed successfully.
- **`skipped`:** An optional step was intentionally not executed.

## Document-Bound Input Data

In the current template example, no document-bound input data is planned. If vouchers, coupons, or other formally bound evidence become business-relevant later, a section with `Why document-bound`, `E2E extraction`, and `Component target attributes` must be added per document type.

## Cross-Cutting Attribute Patterns

- **Identifiers:** `..._id` for stable business identifiers in the example; every business object and object additionally carries a `..._uuid` attribute for globally unique identification.
- **References:** Cross-references between business objects are explicitly named as an ID or `...Reference`.
- **Status:** `status` for permanent business states; specific result status values are explicitly named per step.
- **Timestamps:** Process-relevant timestamps are named as `..._time` when they are needed from a business perspective.
