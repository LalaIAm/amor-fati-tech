# Design Document: GitHub Actions CI Pipeline

## Overview

This feature delivers a single GitHub Actions workflow file at `.github/workflows/ci.yml`. When triggered, the workflow runs on a `ubuntu-latest` runner, checks out the repository, sets up Node.js 20, installs dependencies inside `tarot-ai-app/`, runs the Vitest test suite, and then runs the Vite production build. Dummy Supabase environment variables are injected at both the test and build steps so that `supabaseClient.js` can be imported without throwing.

The output is purely declarative YAML — there is no runtime application logic to design. The design therefore focuses on the structure of the workflow, the ordering of steps, environment variable injection, and the rationale behind each decision.

## Architecture

The pipeline is a single-job GitHub Actions workflow. A single job is appropriate because:

- All steps share the same working directory and Node modules cache.
- Sequential failure semantics are built-in: a failing step stops the job automatically.
- There is no parallelism benefit for install → test → build since each step depends on the previous.

```
Trigger (push / pull_request)
        │
        ▼
  Job: ci  (ubuntu-latest)
        │
        ├─ Step 1: Checkout repository
        ├─ Step 2: Set up Node.js 20
        ├─ Step 3: npm install  (cwd: tarot-ai-app/)
        ├─ Step 4: npx vitest --run  (cwd: tarot-ai-app/, env: dummy Supabase vars)
        └─ Step 5: npm run build  (cwd: tarot-ai-app/, env: dummy Supabase vars)
```

## Components and Interfaces

### Workflow Triggers

```yaml
on:
  push:
    branches: ["**"]
  pull_request:
    branches: ["**"]
```

Using `"**"` (all branches) satisfies Requirements 1.1 and 1.2 without restricting to specific branch names.

### Job Definition

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: tarot-ai-app
```

Setting `defaults.run.working-directory` at the job level means every `run` step automatically executes inside `tarot-ai-app/`, satisfying Requirement 6.3 without repeating `working-directory` on each step.

### Steps

| #   | Name                 | Action / Command                                | Notes                 |
| --- | -------------------- | ----------------------------------------------- | --------------------- |
| 1   | Checkout             | `actions/checkout@v4`                           | Fetches the full repo |
| 2   | Setup Node.js        | `actions/setup-node@v4` with `node-version: 20` | Satisfies Req 6.2     |
| 3   | Install dependencies | `npm install`                                   | Satisfies Req 2.1     |
| 4   | Run tests            | `npx vitest --run`                              | Satisfies Req 3.1–3.4 |
| 5   | Build                | `npm run build`                                 | Satisfies Req 4.1–4.3 |

### Environment Variables

Dummy values are injected at the step level for steps 4 and 5:

```yaml
env:
  VITE_SUPABASE_URL: https://placeholder.supabase.co
  VITE_SUPABASE_ANON_KEY: placeholder-anon-key
```

These values are syntactically valid URLs/strings so that `supabaseClient.js` (which calls `createClient(url, key)`) does not throw at import time. No live Supabase connection is made during tests or build.

**Rationale for step-level env over job-level env**: Injecting at the step level makes the intent explicit — these vars are only needed for test and build, not for checkout or Node setup. It also avoids accidentally leaking them into unrelated steps if the workflow grows.

## Data Models

There is no application data model. The sole artifact is a YAML file conforming to the [GitHub Actions workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions).

Key schema constraints:

- `on` — defines triggers
- `jobs.<id>.runs-on` — runner label
- `jobs.<id>.defaults.run.working-directory` — default working directory for `run` steps
- `jobs.<id>.steps[].uses` — references a reusable action
- `jobs.<id>.steps[].run` — shell command
- `jobs.<id>.steps[].env` — step-scoped environment variables

## Correctness Properties

This feature produces a single declarative YAML configuration file (Infrastructure as Code). The "logic" is entirely expressed as static configuration interpreted by GitHub's runner infrastructure — there are no pure functions, data transformations, or algorithms in the output artifact.

**PBT assessment**: Property-based testing is not appropriate here. The output is a YAML file with no input/output function to test. Correctness is verified by:

1. Structural validation — the YAML is syntactically valid and conforms to the GitHub Actions schema.
2. Behavioral validation — the workflow executes correctly when triggered (integration/smoke test).

Neither of these benefits from generating 100+ random inputs. The Correctness Properties section is therefore omitted per the design guidelines.

## Error Handling

GitHub Actions provides built-in error propagation: any `run` step that exits with a non-zero code automatically fails the job and skips all subsequent steps. No explicit error-handling configuration is needed to satisfy Requirements 2.2, 3.2, 4.2, and 5.2.

Edge cases:

- **Missing env vars**: If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are absent, `supabaseClient.js` may throw at import time, causing tests to fail with a confusing error. Mitigated by always injecting dummy values at the test and build steps.
- **Wrong working directory**: If `defaults.run.working-directory` is misconfigured, `npm install` would run at the repo root (where there is no `package.json`), failing immediately. The job-level default makes this a single point of configuration.
- **Node version mismatch**: Pinning `node-version: 20` in `actions/setup-node` ensures the runner uses the expected Node version regardless of what is pre-installed on `ubuntu-latest`.

## Testing Strategy

Because the output is a YAML configuration file, the appropriate testing strategies are:

**Schema validation (static)**

- Use [`actionlint`](https://github.com/rhysd/actionlint) or the [GitHub Actions VS Code extension](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions) to validate the workflow YAML against the GitHub Actions schema before committing.
- This catches typos in action names, invalid keys, and structural errors without running the workflow.

**Smoke test (manual / integration)**

- Push a branch or open a PR and observe the workflow run in the GitHub Actions UI.
- Verify all 5 steps complete with green checkmarks.
- Verify that a deliberate test failure (e.g. temporarily breaking a test) causes the workflow to fail at step 4 and skip step 5.

**Unit tests for application code (existing)**

- The pipeline runs `npx vitest --run`, which executes the existing Vitest + fast-check test suite in `tarot-ai-app/src/`.
- Property-based tests in that suite already use fast-check with ≥100 iterations per property, tagged with `// Feature: tarot-ai-app, Property N: <name>`.
- The CI pipeline's job is to run these tests, not to add new ones for the pipeline itself.

Property-based testing does not apply to this feature. The workflow file has no functions, no input space, and no algorithmic logic to verify with randomized inputs.
