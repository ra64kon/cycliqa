---
tmal-id: SPRINT-PRE-001-RECIPE
creator: product_manager
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# Sprint Pre-Planning: Recipe Integration before Coffee Preparation

## Metadata

- Sprint ID: SPRINT-001
- Title: Load Recipe from External API before Coffee Preparation
- Status: draft
- Priority: high
- Source: `planning/0_collect/features/recipe_before_brewing.feature.md`
- Created on: 2026-06-09
- Responsible: product_manager

---

## Baseline

- Features from `0_collect/features`: `recipe_before_brewing.feature.md`
- Findings from `0_collect/findings`: none
- Business occasion: The `brewing_station` currently uses internally hard-wired preparation parameters. By fetching a recipe from an external API, the preparation process becomes data-driven and extensible. At the same time, the feature demonstrates the adapter service role of the architecture model with a real external integration.

---

## Vision

- Business goal: Before the first preparation step (`grind_beans`), a suitable recipe is fetched from the DummyJSON Recipes API via a new `adapter_service`. The recipe controls or supplements the preparation parameters.
- Expected value: The `brewing_station` is no longer static; external recipe specifications are embedded into the process flow. The architecture pattern `adapter_service` is demonstrated in production for the first time.
- Non-goals: No caching, no persistent recipe storage, no dedicated recipe management endpoint in the demo scope.

---

## Scope for the Sprint

### In Scope

- New `adapter_component` `recipe_adapter` with `adapter_service` `fetch_recipe`
- Call to `fetch_recipe` by `process_control` in the process flow before `grind_beans`
- Recipe search by beverage type (`beverage_type`) via the DummyJSON Recipes API (`GET /recipes/search?q={beverage_type}`)
- Recipe data (`ingredients`, `instructions`) is handed over to the preparation step, not stored and not logged
- Error handling: API not reachable or no suitable recipe found → process is visibly blocked (error status)
- New component spec: `specs/business_spec/components/recipe_adapter/` (new)
- New service spec: `fetch_recipe.srv.md` in `specs/business_spec/components/recipe_adapter/`
- New OpenAPI spec: `specs/software_spec/api/recipe_adapter.openapi.yaml` (new)
- New user story: `load_recipe.spec.md` in `docs/requirements/user_stories/`
- Unit tests for the new component `recipe_adapter`
- Extension of `process_control` tests to include the new step

### Out of Scope

- Changes to `process_control`, `order_terminal`, `delivery_robot`, `web_channel`
- Persistent recipe storage
- Recipe search by tag or meal type (only name/type in scope)
- Fallback to internal defaults (error case explicitly blocks the process)

### Dependencies

- `integration/recipes/api/recipes.openapi.yaml` as binding API reference for the adapter
- Existing `brewing_station` services (`grind_beans`, `prepare_coffee`, `froth_milk`) must accept the recipe fetch as a preceding step
- No infrastructure overhead: external API call via HTTP fetch from the existing Node.js runtime

---

## Rough Specification according to core_architecture_model

### New Component `recipe_adapter`

- Component type: `adapter_component`
- Responsibility: encapsulates the external DummyJSON Recipes API as an Anti-Corruption Layer; behaves towards processes like an internal domain component

### New Service `fetch_recipe`

- Component: `recipe_adapter`
- Service type: `adapter_service`
- Communication pattern: Command (synchronous)
- Input: `beverage_type`
- Processing: Search for a suitable recipe via external API (`GET https://dummyjson.com/recipes/search?q={beverage_type}`), first hit result is used
- Output: `recipe_id`, `recipe_name`, `ingredients`, `instructions` (handed over as business data, not stored, not logged)
- Error case: HTTP error, timeout, or empty result set → `fetch_recipe_status: failed`

### Embedding in the Process Flow

- Existing order in `process_control`: `grind_beans` → `prepare_coffee` → `froth_milk`
- New order: `fetch_recipe` (`recipe_adapter`) → `grind_beans` → `prepare_coffee` → `froth_milk`
- `fetch_recipe` is called as the first step by `process_control` via the API of `recipe_adapter`

### Adaptation needs in docs/requirements

- Affected files:
  - `docs/requirements/user_stories/prepare_coffee.spec.md` (extension: recipe fetch as a new step in the intended flow)
  - `docs/requirements/user_stories/load_recipe.spec.md` (new)
- Expected changes:
  - `prepare_coffee.spec.md`: extend intended flow and acceptance criteria with recipe fetch step
  - `load_recipe.spec.md`: new user story with acceptance criteria for success, API error, and empty result set

### Adaptation needs in specs

- `specs/business_spec/components/recipe_adapter/` (new): create component directory
- `specs/business_spec/components/recipe_adapter/fetch_recipe.srv.md` (new): service specification according to architecture model
- `specs/software_spec/api/recipe_adapter.openapi.yaml` (new): OpenAPI spec for the internal endpoint of `recipe_adapter`
- `openapi.yaml` (consolidation): add new component and endpoint once software spec is approved

---

## Risks and Open Questions

- Risk 1: DummyJSON search term (`beverage_type` like "Espresso") may not return a suitable result → check test data, possibly provide mapping table (`Espresso` → `coffee`)
- Risk 2: External API is not always reachable in the demo context → define timeout clearly (recommendation: 3 seconds)
- Open question 1: Which recipe fields (`ingredients`, `instructions`) are used in business processing or only logged?
  - **Resolved:** Fields are handed over as business data to the preparation step, not stored and not logged.
- Open question 2: Should `fetch_recipe` have its own HTTP endpoint or be called exclusively internally?
  - **Resolved:** `fetch_recipe` is an independent `adapter_component` (`recipe_adapter`) with its own HTTP endpoint; called by `process_control` via its API.

---

## QA and Approval

- Review Business Architect: pending — check that `adapter_service` is correctly located and service type correctly classified; consistency with `specs/business_spec/components/brewing_station/`
- Review Software Architect: pending — check API embedding, error handling, timeout strategy, consistency with `specs/software_spec/api/brewing_station.openapi.yaml`
- Adjustments after QA: open
- User approval: pending
