# Implementation Plan: GitHub Actions CI Pipeline

## Overview

Create a single GitHub Actions workflow file at `.github/workflows/ci.yml` that triggers on push and pull request events, installs dependencies, runs the Vitest test suite, and builds the app — all inside the `tarot-ai-app/` working directory with dummy Supabase env vars injected at the test and build steps.

## Tasks

- [-] 1. Create the GitHub Actions workflow file
  - Create `.github/workflows/ci.yml` with the following structure:
    - `on` triggers for `push` and `pull_request` on all branches (`"**"`)
    - A single job named `ci` running on `ubuntu-latest`
    - Job-level `defaults.run.working-directory: tarot-ai-app`
    - Step 1: Checkout using `actions/checkout@v4`
    - Step 2: Setup Node.js 20 using `actions/setup-node@v4` with `node-version: 20`
    - Step 3: `npm install` (inherits job-level working directory)
    - Step 4: `npx vitest --run` with step-level env vars `VITE_SUPABASE_URL: https://placeholder.supabase.co` and `VITE_SUPABASE_ANON_KEY: placeholder-anon-key`
    - Step 5: `npm run build` with the same step-level env vars
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 5.2, 6.1, 6.2, 6.3_

- [ ] 2. Checkpoint — Validate the workflow file
  - Ensure the YAML is syntactically valid (no indentation errors, correct key names).
  - Verify step ordering matches: checkout → setup-node → npm install → npx vitest --run → npm run build.
  - Confirm `defaults.run.working-directory` is set at the job level, not repeated per step.
  - Confirm dummy env vars appear only on the test and build steps.
  - Ensure all tests pass, ask the user if questions arise.
