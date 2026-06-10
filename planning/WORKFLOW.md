# Sprint Planning

This directory describes the path from raw requirements and findings to approved sprint planning and its archival.

## Directory Structure

- `0_collect`: Entry point for unordered or newly captured features and findings
- `1_plan`: Planning documents for concrete sprints
- `2_work`: Working directory for the sprint currently in implementation
- `3_done`: Completed or archived planning and backlog artefacts

## Templates

`templates` contains sprint templates derived from this workflow. The files serve as a starting point for future sprint documents and show what content must be documented at the latest in pre-planning, planning, and completion.

## Leading Role

- The leading role for backlog, pre-planning, planning, role coordination, and product outcome is `product_manager` according to `AGENTS.md`.

## Pre-Planning

The goal of pre-planning is to produce a prioritised, sprint-ready backlog from raw requirements.

1. Place new or unstructured requirements in `0_collect/features`; capture findings from tests in `0_collect/findings`.
2. Analyse requirements, cut them into sprints by dependencies and importance, and create sprint files in `1_plan`.
3. Roughly specify sprint files according to `core_architecture_model`.
4. Make adaptation needs in `docs/requirements` and `specs` visible.
5. QA of sprints by `business_architect` according to `../specs/business_spec/AGENTS.md` and by `software_architect` according to `../specs/software_spec/AGENTS.md`, each with need for refinement.
6. Coordination of involved roles and prioritisation by `product_manager`.
7. QA and approval of sprints by the user.

## Planning

The goal of planning is to translate the next prioritised sprint into an actionable working basis.

1. Select the sprint with the highest priority from `1_plan` and move it to `2_work`. Update version and description in version.md.
2. Finely specify sprint files according to `core_architecture_model`.
3. Concretise adaptation needs in `specs`, in code under `src`, and in tests.
4. QA of the sprint by `business_architect` according to `../specs/business_spec/AGENTS.md` and by `software_architect` according to `../specs/software_spec/AGENTS.md`, each with need for refinement.
5. Coordination of sprint scope, risks, and involved roles by `product_manager`.
6. QA and approval of the sprint by the user.

## Implementation

1. Implement the planned changes.
2. Adapt test scripts and data as needed.
3. Test according to `tests/WORKFLOW.md`.
4. Completion documentation in the sprint document.
5. Manual QA.
6. Commit and push.
7. Archive in `3_done`.

## Versioning

Commits and pushes are based on `version.md`, which holds the current version. The description is the brief summary of the respective sprint. The `version.md` file is updated at the beginning of a sprint. After the sprint is completed, commit and push take place.
