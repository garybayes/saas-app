🧱 Sprint 5 Regeneration — Pull Request Template
Title Example

feat: Sprint 5 Regeneration — Workflow Module + Crypto + TypeScript Reintegration

🧭 Summary

This pull request delivers the regenerated Sprint 5 build from the verified Sprint 4 baseline (v4.5.0-baseline).
Key objectives include the new Workflow module, restored TypeScript strict typing, crypto security utilities, and expanded test coverage.

Reference issue: Sprint 5 Regeneration — Workflow Module + TypeScript + Crypto Reintegration

🧱 What Was Added

✅ Workflow Model + API

Added Workflow model and Prisma migration.

Implemented API routes /api/workflows and /api/workflows/[id].

Updated seed script with sample workflow data.

✅ TypeScript Strict Mode

Re-enabled tsconfig.json strict rules.

Resolved type errors across API and test layers.

✅ Crypto Layer

Restored src/lib/crypto.ts for AES-256-GCM encryption/decryption.

Integrated with NEXTAUTH_SECRET.

✅ Testing

Added Playwright E2E tests for auth, theme toggle, connections, and workflows.

Added integration tests for API routes (Vitest or Jest).

✅ Docs and Config

Added prisma.config.ts, updated README.md.

Confirmed .env variable usage and security.

⚙️ Environment

WSL 2 (Ubuntu 22.04)

Node 22 / npm 10.9.4 (≥ 11.6.2 optional)

PostgreSQL 15

Prisma 6.17+

Next.js 13 / TypeScript strict mode

Setup reference: doc/WSL_Setup_for_Codex_Rebuild.md

✅ Verification Checklist
Category	Command / Verification	Status
Build	npm install completes cleanly	☐
Migrations	npx prisma migrate reset + seed works correctly	☐
TypeScript	npx tsc --noEmit → 0 errors	☐
Tests	npx playwright test → all pass	☐
Crypto	crypto.ts encrypts/decrypts sample data	☐
Manual UI	Workflow CRUD works via browser	☐
Docs	README.md updated with seed + test instructions	☐
Lint / Formatting	npm run lint clean	☐
Tag	v5.0.0-codex-verified created after merge	☐
🧩 Notes for Reviewers

Database seeding verified for SQLite (dev) and Postgres (local).

All sensitive keys use .env values — no hardcoded secrets.

Workflow logic mirrors Sprint 4 patterns for connections and auth.

🏁 Next Steps

 Approve and merge into main.

 Push tag v5.0.0-codex-verified.

 Close linked issue “Codex Sprint 5 Regeneration Request.”

End of Template
