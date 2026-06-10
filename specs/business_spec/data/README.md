---
tmal-id: SPEC-DATA-HUB-001
creator: business_architect
ai-assisted: true
verification-status: verified
version: 0.1.0
---

# Data Basis

This directory contains the canonical data view of the template example `CoffeeToGo` under `specs/business_spec/data/`.

## Purpose

The data basis makes the business objects and their attributes visible in a navigable folder structure. The attribute-granular files under `specs/business_spec/data/` are the leading target artefacts for the project's data basis.

Analogous to the structure in `Evergreen/data`, exactly one file of type `*.data.md` is created for each business-relevant attribute.

## Leading Sources

- [canonical_data.model.md](canonical_data.model.md)
- [../components/](../components/)
- [../processes/](../processes/)
- [../../../docs/repository/data.spec.md](../../../docs/repository/data.spec.md)
- [../../architecture/domain_model/domain.coffee_to_go.model.md](../../architecture/domain_model/domain.coffee_to_go.model.md)

## Target Structure

Component-related attributes are stored according to the following schema:

```text
specs/business_spec/data/
  <subdomain>/
    <business_object>/
      <object>/
        <attribute_name>.data.md
```

Process-related cross-cutting attributes are stored under the following schema:

```text
specs/business_spec/data/
  coffee_order_process/
    <business_object>/
      <object>/
        <attribute_name>.data.md
```

## Subdomains in the Template

- `ordering/`: order intake and status information
- `brewing/`: preparation of the beverage
- `delivery/`: delivery of the finished coffee
- `coffee_order_process/`: process-related flow and feedback data within `coffee_to_go`

## Maintenance Notes

- The attribute-granular `*.data.md` files are the operational data view for `specs/business_spec/data/`.
- The domain `coffee_to_go` remains an organisational bracket without its own technical folder level according to the architecture model; storage therefore starts directly at the subdomain.
- Process data is maintained under the subdomain `coffee_order_process/` and is not modelled as an independent domain or cross-cutting storage.
