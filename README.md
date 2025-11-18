SaaS-App — Workflow Hub for Remote Professionals












🧭 Overview

SaaS-App is a Next.js 13+ TypeScript platform that serves as a Workflow Hub and Automation Engine for remote professionals.
It integrates modern cloud tools into one intelligent dashboard, allowing users to connect apps, build workflows, and track productivity securely.

🧰 Tech Stack
Layer	Technology	Purpose
Frontend	React + Next.js 13	Modern, server-first UI
Styling	Tailwind CSS v4	Utility-first responsive design
Backend	Next.js API Routes	Secure API layer
Database	PostgreSQL + Prisma ORM	Typed schema, migrations, seeding
Authentication	NextAuth.js	Credential + OAuth login
Encryption	AES-256 via crypto.ts	Protects user API keys
Testing	Vitest + Playwright	Integration + E2E coverage
CI/CD	GitHub Actions	Build, test, and Codex validation
⚙️ Setup Guide
1. Clone the Repository
git clone https://github.com/garybayes/saas-app.git
cd saas-app

2. Install Dependencies
npm install

3. Configure Environment Variables

Copy the example file and edit values as needed:

cp .env.example .env
nano .env


Your .env should include:

DATABASE_URL="postgresql://saasuser:password@localhost:5432/saas_app?schema=public"
ENCRYPTION_KEY="your-32-character-base64-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

4. Initialize Database
npx prisma migrate deploy
npx prisma db seed

5. Run the App
npm run dev


Visit: http://localhost:3000

🧪 Testing
Type	Command	Description
Integration (Vitest)	npm run test	API + unit validation
End-to-End (Playwright)	npm run test:e2e	Browser workflows
Prisma Studio	npx prisma studio	Inspect database tables

Playwright tests require the app running locally on localhost:3000.

🔄 CI/CD Pipeline Summary

The workflow at
.github/workflows/ci-pipeline.yml
automatically performs the following on push or pull request:

Spins up PostgreSQL 16 service

Installs dependencies (npm ci)

Runs Prisma generate + migrate + seed

Executes Vitest suite (npm run test)

Starts app and runs Playwright E2E tests (npm run test:e2e)

Uploads Playwright report on failure

Codex Integration

Codex monitors:

sprint-* branches

CI results from this workflow

.env.example consistency

When Codex completes a rebuild, it updates the Codex Validation badge above automatically.

🧩 Project Structure
saas-app/
├── .env.example
├── .github/
│   ├── workflows/
│   │   └── ci-pipeline.yml
│   └── badges/
│       └── codex-status.json
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
└── doc/
    ├── Env_Variables_Setup_Guide.md
    ├── Codex_CI_Integration_Guide.md
    ├── Branch_Protection_Policy_Guide.md
    └── WSL_Setup_for_Codex_Rebuild.md

🧱 Example CI Status Badge Integration

The Codex status badge uses a small JSON file that CI updates after each build.
Create this file:

.github/badges/codex-status.json

{
  "schemaVersion": 1,
  "label": "codex-status",
  "message": "pending",
  "color": "lightgrey"
}


When Codex completes a validation run, it automatically changes message to "passing" or "failed".

You can also update it manually for local test purposes:

echo '{"schemaVersion":1,"label":"codex-status","message":"passing","color":"brightgreen"}' > .github/badges/codex-status.json
git add .github/badges/codex-status.json
git commit -m "chore: update Codex status badge to passing"
git push

🧾 Documentation Index

Environment Variables Setup Guide

Codex CI Integration Guide

Branch Protection Policy Guide

WSL Setup for Codex Rebuild

👤 Maintainer

Gary G. Bayes, BABA, MBA
Project Owner & Lead Architect
📧 garybayes@github.io

📜 License

This project is licensed under the MIT License.
See LICENSE
 for full text.
