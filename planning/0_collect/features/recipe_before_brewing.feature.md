---
tmal-id: FEAT-001-RECIPE
creator: business_developer
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# Feature: Load Recipe from External API before Coffee Preparation

## Impulse

Before the start of preparation, a suitable recipe should be fetched from an external recipe API. The recipe controls or supplements the preparation steps.

## Business Idea

The `brewing_station` currently has the preparation logic (grind level, brewing method, milk foam) hard-wired internally. Instead, a recipe should be loaded from an external API before preparation, providing the preparation parameters.

## Integration Reference

The external API is documented and specified under:
- `integration/recipes/README.md`
- `integration/recipes/api/recipes.openapi.yaml` (DummyJSON Recipes API)

Operations covered include:
- Fetch a single recipe by ID
- Recipe search by name or tag

## Rough Scope

- Adapter service in `brewing_station` or a dedicated `recipe_adapter` that loads a recipe via API call before preparation
- Recipe data is handed over to the preparation process
- Error case: API not reachable or no suitable recipe found must visibly block the process

## Open Questions

- Which recipe attributes from the API specifically control which preparation parameters?
- Is the recipe searched by beverage type or by a fixed identifier?
- Should the recipe be cached or reloaded with each order?
- Is there a fallback to internal defaults if the API does not respond?

## Next Step

Pre-planning by `product_manager`: classification into sprint candidates, clarification of open questions with `business_analyst` and `software_architect`.
