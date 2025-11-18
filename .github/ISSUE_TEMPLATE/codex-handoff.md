🧱 Codex Sprint 5 Regeneration Request
Title: Sprint 5 Regeneration — Workflow Module + TypeScript + Crypto Reintegration
🧭 Overview

This issue authorizes Codex to rebuild Sprint 5 from the verified Sprint 4 baseline using the documented WSL 2 environment.
All setup and configuration details are located in
doc/WSL_Setup_for_Codex_Rebuild.md.

📂 Repository Details
Item	Value
Repository	https://github.com/garybayes/saas-app

Branch for Codex start	sprint-4-stable
Reference Tag	v4.5.0-baseline
Doc File	doc/WSL_Setup_for_Codex_Rebuild.md
Environment	WSL 2 (Ubuntu 22.04) + Node 22 + PostgreSQL 15 + Prisma 6.17 + TypeScript strict mode
🧱 Sprint 5 Objectives

Codex will:

Add Workflow Module

Create Workflow model + migration (add_workflow_table)

Build API routes:

/api/workflows (GET, POST)

/api/workflows/[id] (GET, PUT, DELETE)

Update Prisma client and seed with sample workflow data

Re-enable TypeScript

Ensure tsconfig.json strict mode enabled

Fix any compile-time type errors

Maintain Prisma-generated typing across all routes

Restore Crypto Layer

Reinstate src/lib/crypto.ts for secure key encryption/decryption

Use NEXTAUTH_SECRET and Node’s crypto module

Verify end-to-end encryption with test data

Expand Testing

Add Playwright E2E tests for:

Authentication (login/logout)

Theme toggle

Connections CRUD

Workflow CRUD

Add Vitest or Jest integration tests for API route logic

Documentation and Configuration

Replace package.json#prisma entry with prisma.config.ts

Confirm .env variables (NEXTAUTH_SECRET, DATABASE_URL, JWT_SECRET)

Update root README.md with testing and seed instructions

✅ Acceptance Criteria
Area	Expected Outcome
Build	npm run dev starts clean with no TS or lint errors
Database	npx prisma migrate reset runs and seeds successfully
Tests	npx playwright test → 100 % pass
Security	crypto.ts correctly encrypts/decrypts test keys
Schema	Workflow visible in Prisma Studio alongside User + Connection
Docs	Updated README.md includes new instructions and dependencies
📦 Deliverables to Commit

New branch → sprint-5-rebuild

Tag → v5.0.0-codex-verified (after successful validation)

PR → from sprint-5-rebuild into main

🧠 Notes

Environment authentication verified via GitHub PAT.

Baseline schema intentionally excludes Workflow.

Reference Section 15 of doc/WSL_Setup_for_Codex_Rebuild.md for full brief.

All commands and dependency versions documented in Section 1–14 of the same file.

🧩 Pull Request Checklist (for Codex)

Before submitting the pull request for Sprint 5:

 npm install runs without errors or warnings.

 npx prisma migrate reset completes and seeds demo data.

 npx tsc --noEmit reports 0 errors.

 All Playwright tests (npx playwright test) pass successfully.

 Manual workflow CRUD tested via browser at http://localhost:3000.

 crypto.ts verified to encrypt/decrypt sample strings.

 No hardcoded secrets present in code.

 Updated README.md includes seed + test instructions.

 Commit message includes:

feat: Sprint 5 regeneration — Workflow module, crypto, TypeScript fixes


 Tag added after merge: v5.0.0-codex-verified.

🏁 Final Deliverable

Upon successful PR approval and tag push, Codex should close this issue with a reference link to:

PR: #<PR_NUMBER>
Tag: v5.0.0-codex-verified
