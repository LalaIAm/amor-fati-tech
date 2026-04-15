# Requirements Document

## Introduction

This feature adds a GitHub Actions CI pipeline for the Tarot AI App. The pipeline runs automatically on every push and pull request to validate that the codebase builds successfully and all tests pass. The app lives in the `tarot-ai-app/` subdirectory of the monorepo, uses Vite for building, and Vitest with fast-check for unit and property-based tests. Supabase environment variables are required at build time but can use dummy values since no live backend is needed for unit/property tests.

## Glossary

- **Pipeline**: The GitHub Actions workflow that installs dependencies, runs tests, and builds the app.
- **CI**: Continuous Integration — the practice of automatically validating code changes on every push.
- **Workflow**: A GitHub Actions YAML file defining jobs and steps.
- **Job**: A unit of work within a workflow that runs on a GitHub-hosted runner.
- **Step**: An individual command or action within a job.
- **Runner**: The GitHub-hosted virtual machine that executes the workflow (ubuntu-latest).
- **Dummy env vars**: Placeholder values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` used during CI so the build and tests can run without a live Supabase instance.
- **Working directory**: The `tarot-ai-app/` subdirectory where all npm commands are executed.

## Requirements

### Requirement 1: Trigger on Push and Pull Request

**User Story:** As a developer, I want the CI pipeline to run automatically on every push and pull request, so that code quality is validated before merging.

#### Acceptance Criteria

1. WHEN a commit is pushed to any branch, THE Pipeline SHALL trigger the CI workflow.
2. WHEN a pull request is opened or updated against any branch, THE Pipeline SHALL trigger the CI workflow.

---

### Requirement 2: Dependency Installation

**User Story:** As a developer, I want the pipeline to install npm dependencies before running any other steps, so that all required packages are available for testing and building.

#### Acceptance Criteria

1. THE Pipeline SHALL run `npm install` in the `tarot-ai-app/` working directory as the first step of the CI job.
2. WHEN `npm install` exits with a non-zero code, THE Pipeline SHALL fail the job and skip all subsequent steps.

---

### Requirement 3: Test Execution

**User Story:** As a developer, I want the pipeline to run all unit and property-based tests, so that regressions are caught automatically on every change.

#### Acceptance Criteria

1. THE Pipeline SHALL run `npx vitest --run` in the `tarot-ai-app/` working directory after dependencies are installed.
2. WHEN any test fails, THE Pipeline SHALL fail the job and report the failure.
3. WHEN all tests pass, THE Pipeline SHALL proceed to the build step.
4. THE Pipeline SHALL provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables with dummy values during the test step so that modules importing the Supabase client do not throw at import time.

---

### Requirement 4: Production Build

**User Story:** As a developer, I want the pipeline to verify the production build succeeds, so that broken builds are caught before they reach deployment.

#### Acceptance Criteria

1. THE Pipeline SHALL run `npm run build` in the `tarot-ai-app/` working directory after tests pass.
2. WHEN `npm run build` exits with a non-zero code, THE Pipeline SHALL fail the job and report the failure.
3. THE Pipeline SHALL provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables with dummy values during the build step.

---

### Requirement 5: Step Ordering and Dependency

**User Story:** As a developer, I want CI steps to run in a defined order with proper dependencies, so that failures are caught at the earliest possible step.

#### Acceptance Criteria

1. THE Pipeline SHALL execute steps in this order: install dependencies → run tests → build.
2. WHEN a step fails, THE Pipeline SHALL not execute any subsequent steps in the same job.

---

### Requirement 6: Runner Environment

**User Story:** As a developer, I want the pipeline to run on a standard GitHub-hosted Linux runner with a recent Node.js version, so that the environment is consistent and reproducible.

#### Acceptance Criteria

1. THE Pipeline SHALL run on the `ubuntu-latest` GitHub-hosted runner.
2. THE Pipeline SHALL use Node.js version 20 for all steps.
3. THE Pipeline SHALL set the working directory to `tarot-ai-app/` for all npm commands.
