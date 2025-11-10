⚙️ Codex CI Integration Guide
Ensuring Seamless Coordination Between Codex, GitHub Actions, and Local Builds
🧭 Purpose

This guide explains how Codex interacts with your SaaS-App repository’s CI/CD pipeline, how it detects build readiness, and how to validate that your environment is correctly configured for automated Sprint handoffs and rebuilds.

Codex relies on the same CI and environment logic as your developers — it does not use private APIs or bypass standard GitHub workflows.
That means a successful local run of npm run test:e2e + npx prisma db seed should guarantee a successful Codex validation in the cloud.

🧩 1️⃣ What Codex Detects Automatically

Codex looks for the following key signals when it evaluates a repo or branch:

Signal	File/Path	Description
Environment Variables	.env.example, .env, .env.local	Confirms the environment matches .github/workflows/ci-pipeline.yml.
Build Script	package.json (npm run build / npm run dev)	Used to boot the app in a test runner.
Test Definitions	src/tests/**/*.test.ts / tests/**/*.spec.ts	Ensures Playwright and Vitest tests exist and are registered.
CI Workflow	.github/workflows/ci-pipeline.yml	Validates that Prisma + Playwright + Vitest are integrated correctly.
Seed Script	prisma/seed.ts	Ensures a known dataset can be loaded before validation.

Codex uses the same Prisma migrations and seeding commands as your CI:

npx prisma migrate deploy
npx prisma db seed
npm run test
npm run test:e2e

⚙️ 2️⃣ Expected Project Structure

Codex expects to find:

saas-app/
├── .env.example
├── .github/
│   └── workflows/
│       └── ci-pipeline.yml
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   ├── lib/
│   │   └── crypto.ts
│   └── tests/
│       ├── integration/
│       │   ├── routeCoverage.test.ts
│       │   ├── routeValidation.test.ts
│       │   └── workflows.test.ts
│       └── e2e/
│           ├── auth.spec.ts
│           ├── connections.spec.ts
│           ├── theme.spec.ts
│           ├── workflows.spec.ts
│           └── sprint5-validation.spec.ts


If any of these files are missing, Codex may skip or flag the build as incomplete.

🧠 3️⃣ How Codex Executes Validation

Checks CI Consistency

Reads .github/workflows/ci-pipeline.yml to confirm build-and-test job.

Ensures that environment secrets match .env.example schema.

Performs Clean Checkout

Uses your active sprint branch (e.g. sprint-5-development).

Recreates PostgreSQL service using your DATABASE_URL connection string.

Runs Prisma & Tests

npx prisma migrate deploy
npx prisma db seed
npm run test
npm run test:e2e


Collects Results

Captures playwright-report/ artifacts.

Verifies Vitest coverage threshold.

Flags any failed endpoint or decryption errors.

🔐 4️⃣ Required GitHub Secrets for Codex CI

Ensure all of the following are configured in GitHub → Settings → Secrets → Actions:

Secret	Description
DATABASE_URL	PostgreSQL connection string (Codex runner uses a fresh container).
NEXTAUTH_SECRET	Used by NextAuth for token signing.
NEXTAUTH_URL	Typically http://localhost:3000.
ENCRYPTION_KEY	32-byte Base64 key for crypto module.
NODE_ENV	Should be set to test.
PORT	Typically 3000.

Codex reads these automatically from GitHub’s Actions environment during build.

🧾 5️⃣ Handoff Checklist for Codex

Before assigning a new Sprint to Codex:

✅ 1. Ensure .github/workflows/ci-pipeline.yml is committed and pushed.
✅ 2. Confirm .env.example reflects all active variables.
✅ 3. Run locally:

npx prisma migrate deploy
npx prisma db seed
npm run dev
npm run test
npm run test:e2e


✅ 4. Push and tag your baseline (e.g. v5.0.2-sprint5-review).
✅ 5. Create a GitHub Issue with title:

[Codex] Sprint 5 Rebuild Validation Request


✅ 6. Mention @openai-codex (or your assigned Codex bot handle).
✅ 7. Confirm issue is linked to the correct branch (sprint-5-development or sprint-6-prep).

🧰 6️⃣ Troubleshooting Codex Validation
Symptom	Root Cause	Fix
Codex ignores repo	Missing ci-pipeline.yml or no test scripts	Add workflow file and test entries.
Codex build fails at “ENCRYPTION_KEY missing”	.env.example out of sync	Update .env.example and repository secrets.
Seed fails	encrypt not imported / key missing	Ensure seed uses encrypt() from /src/lib/crypto.ts.
Playwright timeout	App didn’t start before tests	Add sleep 10–15s before npm run test:e2e in CI pipeline.
Prisma permissions	Running from Windows mount	Codex must execute under /home/runner/work/saas-app/ not /mnt/c.
✅ 7️⃣ Verification Command (for Local Mirror of Codex Run)

To reproduce Codex’s CI behavior exactly:

export NODE_ENV=test
export $(grep -v '^#' .env | xargs)
npx prisma migrate deploy
npx prisma db seed
npm run build
nohup npm run dev > server.log 2>&1 &
sleep 10
npm run test
npm run test:e2e


This is the same sequence Codex executes remotely.

🧩 8️⃣ Summary
Item	Verified	Purpose
.env.example	✅	Provides CI variable schema
.github/workflows/ci-pipeline.yml	✅	CI entrypoint for Codex
Prisma Schema + Seed	✅	Defines and populates database
Tests (.test.ts, .spec.ts)	✅	Integration and E2E coverage
Docs (Env_Variables_Setup_Guide.md, Codex_CI_Integration_Guide.md)	✅	Contributor and automation clarity
