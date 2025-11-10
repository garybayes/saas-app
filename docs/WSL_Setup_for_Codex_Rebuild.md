🧱 WSL Setup for Codex Rebuild
Sprint-4 Baseline → Sprint-5 Regeneration Environment
This document defines the verified WSL 2 + PostgreSQL + Prisma + TypeScript environment used to prepare the Sprint 4 clean baseline and tag v4.5.0-baseline for Codex’s Sprint 5 rebuild.

✅ 1. System Summary
ComponentVersion / NotesOSWindows 11 Pro with WSL 2 (Ubuntu 22.04)Node.jsv22.20.0npm10.9.4 (works; upgradeable → 11.6.2)Prisma CLI / Client6.17.1DatabasePostgreSQL 15 (local instance)Next.js / TypeScriptStrict mode enabledTesting StackPlaywright + Vitest (CI-ready)

⚙️ 2. WSL Installation & Updates
wsl --install -d Ubuntu
wsl --update

Inside Ubuntu:
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential


🧩 3. Node & npm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v

Optional upgrade:
sudo npm install -g npm@11.6.2


🧮 4. PostgreSQL Setup
sudo apt install -y postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres psql -c "CREATE ROLE saasuser WITH LOGIN PASSWORD 'password';"
sudo -u postgres createdb -O saasuser saas_app

Connection string used in .env:
DATABASE_URL="postgresql://saasuser:password@localhost:5432/saas_app?schema=public"


🧾 5. Clone Repository
cd ~
mkdir projects && cd projects
git clone https://github.com/garybayes/saas-app.git
cd saas-app


🧠 6. Environment Files
Create .env:
DATABASE_URL="postgresql://saasuser:password@localhost:5432/saas_app?schema=public"
NEXTAUTH_SECRET="local-dev-secret"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"

Add .env and .env.local to .gitignore;
commit a safe .env.example for collaborators.

🧱 7. Prisma Setup
npm install
npx prisma generate
npx prisma migrate reset

Expected:
Database reset successful
✔ Generated Prisma Client (v6.17.1)

Seed (Sprint-4 only):
npm install -D ts-node typescript
npx ts-node prisma/seed.ts

Verify data:
npx prisma studio

You should see User and Connection tables.

🧪 8. Test Verification
npx tsc --noEmit
npx playwright install --with-deps
npx playwright test

All baseline tests should pass under both SQLite and PostgreSQL.

🚀 9. Start Application
npm run dev

Open http://localhost:3000

🔐 10. GitHub Authentication (PAT or CLI)
If push fails with “Invalid username or token”:
Option A – Personal Access Token


Create token at https://github.com/settings/tokens


Enable scope: repo


During git push:
Username: garybayes
Password: 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Option B – GitHub CLI


sudo apt install -y gh
gh auth login
# GitHub.com → HTTPS → login with browser


🏷️ 11. Tagging the Clean Baseline
git add .
git commit -m "Sprint 4 clean baseline prepared for Codex rebuild"
git tag -a v4.5.0-baseline -m "Ready for Codex Sprint 5 regeneration"
git push origin v4.5.0-baseline

Verify on GitHub under Releases › Tags → v4.5.0-baseline.

🧩 12. Schema Validation Checklist (for Codex)
ModelPresent in Sprint 4Added in Sprint 5User✅Connection✅Workflow✅ (introduced in Sprint 5)
Codex will also reinstate crypto.ts, re-enable TypeScript compilation, and add end-to-end tests.

📘 13. Daily Commands Reference
PurposeCommandReset DB & seednpx prisma migrate resetGenerate clientnpx prisma generateOpen Studionpx prisma studioRun testsnpx playwright testType checknpx tsc --noEmitStart appnpm run dev

✅ 14. Summary


Environment verified: WSL 2 + Node 22 + Postgres + Prisma 6.17


Baseline seeded: User + Connection only


Tag pushed: v4.5.0-baseline


Next step: hand to Codex for Sprint 5 rebuild (Workflow, crypto, TypeScript, testing)



🧩 15. Codex Sprint 5 Regeneration Brief
🎯 Objective
Rebuild Sprint 5 cleanly from the v4.5.0-baseline tag, restoring full TypeScript enforcement, Prisma integration, and test coverage under the verified WSL environment.

🧱 Core Deliverables


Workflow Module


Add Workflow model + migration (add_workflow_table)


Create API routes:


/api/workflows (GET, POST)


/api/workflows/[id] (GET, PUT, DELETE)




Update Prisma client + seed to include sample workflow




Security / Crypto


Reinstate src/lib/crypto.ts for secure encryption/decryption of tokens and keys


Use crypto.subtle or Node crypto API with AES-256-GCM


Integrate with NextAuth secrets in .env




TypeScript Re-enablement


Ensure tsconfig.json strict mode active


Fix type issues in API routes and test files


Maintain Prisma model typing throughout




Testing Expansion


Add Playwright E2E tests for:


Authentication (login/logout)


Theme toggle (persistence check)


Connections CRUD


Workflow CRUD (create, edit, delete)




Add unit/integration tests for API routes (src/tests/integration/…)




Database Seeding


Extend prisma/seed.ts to populate User + Connection + Workflow records


Support both SQLite (dev) and PostgreSQL (prod/dev)




Documentation and Config


Migrate package.json#prisma settings → prisma.config.ts


Verify .env variables (NEXTAUTH_SECRET, DATABASE_URL, JWT_SECRET)


Generate updated README with seed and test examples





⚙️ Acceptance Criteria
CategoryExpected OutcomeBuildnpm run dev starts without TypeScript errorsDatabasenpx prisma migrate reset runs cleanly and seeds dataTestsnpx playwright test → 100 % passSecuritycrypto.ts properly encrypts/decrypts sample keysSchemaWorkflow appears alongside User and Connection in Prisma StudioDocsREADME.md updated with testing and seeding instructions

🧩 Delivery Notes


Regeneration must start from tag v4.5.0-baseline to avoid drift.


After build and test completion, commit as branch sprint-5-rebuild and tag v5.0.0-codex-verified.


All configuration must compile under Node 22 + Prisma ≥ 6.17 + Postgres 15.



End of Document
