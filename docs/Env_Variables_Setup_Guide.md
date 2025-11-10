🧭 Environment Variables Setup Guide

(For Local, Codex, and CI/CD Environments)

📂 File Overview
File	Purpose	Loaded By	Notes
.env	Main configuration for CLI tools (Prisma, ts-node, Playwright)	✅ Prisma CLI / CI	Must include ENCRYPTION_KEY, DATABASE_URL, NEXTAUTH_SECRET.
.env.local	Local-only overrides	✅ Next.js runtime	Used during development only.
.env.example	Template for developers	🚫 Not loaded automatically	Safe to commit; no secrets.

⚠️ .env and .env.local must remain in .gitignore. Only .env.example is tracked in Git.

🧩 1️⃣ Required Variables
# ───────── Database Configuration ─────────
DATABASE_URL="postgresql://saasuser:password@localhost:5432/saas_app?schema=public"

# ───────── Authentication ─────────
NEXTAUTH_SECRET="your-generated-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# ───────── Encryption ─────────
ENCRYPTION_KEY="v94oNiDBqrZqzzlKpiFLPFmuq0d/bKiPU1+JWGqS0+k="

# ───────── Runtime Settings ─────────
NODE_ENV="development"
PORT=3000

🧱 2️⃣ Local Developer Setup

After cloning or rebuilding the project:

cp .env.example .env


Then edit .env with valid values.
Copy it to .env.local if you want the Next.js server to use the same credentials:

cp .env .env.local


Verify:

grep ENCRYPTION_KEY .env

🔐 3️⃣ Generating Secure Keys

Generate a 32-byte base64 encryption key:

openssl rand -base64 32


Test length:

node -e "console.log(Buffer.from(process.env.ENCRYPTION_KEY, 'base64').length)"
# should print 32


Generate a NextAuth secret:

openssl rand -base64 32

⚙️ 4️⃣ Prisma Setup and Seeding

Prisma reads only .env, not .env.local.
So make sure your .env includes both DATABASE_URL and ENCRYPTION_KEY.

Reset and seed the database:

npx prisma migrate reset
npx prisma db seed


If you prefer to seed from .env.local manually:

export $(grep -v '^#' .env.local | xargs)
npx prisma db seed

🧪 5️⃣ Testing Environments
🧩 Integration / Unit (Vitest)
npm run test

🌐 End-to-End (Playwright)

Start the app:

npm run dev


Then run:

npm run test:e2e


If tests fail with ECONNREFUSED, ensure the app is running at http://localhost:3000.

⚙️ 6️⃣ CI/CD Environment Setup (GitHub Actions)
6.1 Environment Variables in GitHub

In your GitHub repo:

Go to Settings → Secrets and variables → Actions → Repository secrets.

Add these secrets (exact keys):

Secret Name	Example Value
DATABASE_URL	postgresql://saasuser:password@localhost:5432/saas_app?schema=public
NEXTAUTH_SECRET	openssl rand -base64 32
NEXTAUTH_URL	http://localhost:3000
ENCRYPTION_KEY	openssl rand -base64 32
NODE_ENV	test
PORT	3000

These will be automatically available to the GitHub Actions workflow (ci-pipeline.yml).

6.2 Sample ci-pipeline.yml Integration

Ensure your CI workflow includes environment variable loading and test stages:

name: CI Pipeline

on:
  push:
    branches: [ main, sprint-* ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
      NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
      NODE_ENV: test
      PORT: 3000

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Run Migrations
        run: npx prisma migrate deploy

      - name: Seed Database
        run: npx prisma db seed

      - name: Run Integration Tests
        run: npm run test --if-present

      - name: Run End-to-End Tests
        run: npm run test:e2e --if-present


✅ This ensures Codex, GitHub CI, and local testing all share identical runtime conditions.

🧾 7️⃣ Troubleshooting Quick Reference
Error Message	Likely Cause	Fix
ENCRYPTION_KEY missing from environment	Missing in .env	Copy it from .env.local.
ENCRYPTION_KEY must be exactly 32 characters long	Incorrect key size	Regenerate with openssl rand -base64 32.
Connection refused at localhost:3000	App not running before tests	Run npm run dev first.
Error decrypting API key: undefined	Missing encrypted field in seed data	Update prisma/seed.ts to encrypt before insert.
EPERM: operation not permitted	Running Prisma from Windows mount (/mnt/c)	Run from native WSL path (~/projects/saas-app).
🧭 8️⃣ Project Environment Summary
Component	Current Version	Verified Location
Node.js	v22.21.0	WSL (Ubuntu)
npm	v10.9.4	✅
Prisma	v6.19.0	✅
Database	PostgreSQL 16.10	localhost
TypeScript	v5.9.3	✅
Playwright	Installed	✅
Vitest	Installed	✅
WSL Environment	Ubuntu 24.04 LTS	✅
