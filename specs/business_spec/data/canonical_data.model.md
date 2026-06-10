---
tmal-id: SPEC-DATA-MODEL-001
creator: business_architect
ai-assisted: true
verification-status: unverified
version: 0.1.1
---

# Canonical Data Model

This model describes the canonical data view of the template example `CoffeeToGo` on the basis of the architecture metamodel and the domain model under `../../architecture/domain_model/domain.coffee_to_go.model.md`.

## Structural Principle

- The domain `coffee_to_go` is the organisational bracket without a technical counterpart.
- The physical folder structure under `specs/business_spec/data/` starts directly with the subdomains.
- Each business object and each object has at least one business `..._id` and a globally unique `..._uuid`.

## Subdomains and Leading Objects

| Subdomain | Leading Business Object | Physical Path | Required Identifiers |
|---|---|---|---|
| `ordering` | `Order` | `ordering/ordering/order/order/` | `order_id`, `order_uuid` |
| `brewing` | `BrewingOrder` | `brewing/brewing/brewing_order/brewing_order/` | `order_id`, `brewing_order_uuid` |
| `delivery` | `DeliveryOrder` | `delivery/delivery/delivery_order/delivery_order/` | `order_id`, `delivery_order_uuid` |
| `coffee_order_process` | `CoffeeOrderProcessInstance` | `coffee_order_process/coffee_order_process_instance/` | `process_id`, `process_instance_uuid` |
| `coffee_order_process` | `ProcessFeedback` | `coffee_order_process/process_feedback/` | `process_feedback_id`, `process_feedback_uuid` |

## Derivation Rules

- Component-related data objects remain in their respective subdomain.
- Process-related feedback is located in the subdomain `coffee_order_process` and not in a cross-cutting domain.
- References between objects are modelled explicitly via `..._id`.
- The canonical business view remains leading even when technical persistence consolidates several business objects into a reduced runtime structure.
- In the current demo, `Order` and `CoffeeOrderProcessInstance` are persisted; `BrewingOrder` remains a business view without its own technical table.
- Delivery progress and process steps are technically represented as attempt- or step-related runtime entries and are not persisted as complete business aggregates.
