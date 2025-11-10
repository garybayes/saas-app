🧭 Sprint 5 Validation & Debugging Checklist

Project: MindForge SaaS-App
Environment: Next.js 13 + TypeScript + Tailwind v4 + Prisma (PostgreSQL) + NextAuth + Playwright

1️⃣ Clean Environment Setup
# Remove old modules & lockfile
rm -rf node_modules package-lock.json
npm install


✅ Ensures all dependencies install cleanly
✅ Removes outdated or duplicate modules

2️⃣ Package & Security Audit
npm audit fix
npm audit --omit=dev


✅ Production dependencies show 0 vulnerabilities
✅ Safe to ignore deprecated warnings from glob, jose, eslint, or playwright

Optional deep update

npx npm-check-updates -u
npm install

3️⃣ Verify Core Packages
Package	Purpose	Command	Expected Result
next-auth	Authentication	npm list next-auth	≥ 5.x
prisma	ORM / DB	npx prisma -v	CLI + Engine versions
typescript	Static typing	npx tsc --noEmit	No errors
tailwindcss	Styling	npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch	Builds cleanly
playwright	Testing	npx playwright --version	Version number displayed
4️⃣ Database Migration
# Backup current schema
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-empty --script > backup.sql

# Apply Sprint 5 changes
npx prisma migrate dev --name sprint5_update

# Verify visually
npx prisma studio


✅ New Workflow tables visible
✅ Relations between User, Workflow, Step intact
✅ Optional: npx prisma db seed to re-populate sample data

5️⃣ Reinstate Security Utilities

/lib/crypto.ts

import crypto from "crypto";

export const hashPassword = (password: string): string =>
  crypto.createHash("sha256").update(password).digest("hex");

export const verifyPassword = (password: string, hash: string): boolean =>
  hashPassword(password) === hash;


✅ Used by /api/auth/[...nextauth].ts for password verification

TypeScript Sanity

npx tsc --noEmit


✅ No type or path errors
✅ All .ts/.tsx restored

6️⃣ Run Playwright & Source Tests
Area	Test File	Command	Expected Outcome
Authentication	tests/auth.spec.ts	npx playwright test auth.spec.ts	Login/logout succeeds
Session & Theme	tests/ui-theme.spec.ts	npx playwright test ui-theme.spec.ts	Theme toggle syncs
Connections CRUD	tests/connections.spec.ts	npx playwright test connections.spec.ts	Add/Edit/Delete works
Workflow Builder	tests/workflow.spec.ts	npx playwright test workflow.spec.ts	Canvas nodes create & save
API Routes	vitest	npx vitest run	All pass
E2E Smoke	all	npx playwright test --headed	Full flow stable

Tips (Windows 11):

npx playwright test --project=chromium --workers=1

7️⃣ Security & Config Checks
Area	Verify	Command / File
Environment	.env.local not committed	.gitignore includes .env*
Secrets	NEXTAUTH_SECRET, DATABASE_URL set	echo %NEXTAUTH_SECRET%
Cookies	Secure flag enabled	In next-auth config
Validation	All /api/* routes use zod	Source review
HTTPS ready	NEXTAUTH_URL=https://yourdomain.com	.env.production
Rate limit	Add @upstash/ratelimit (Sprint 6)	TBD
Dependency audit	Run monthly	npm audit --omit=dev
8️⃣ Production Build Verification
npm run build
npm run start


✅ Build completes without warnings
✅ Dev-only dependencies excluded

9️⃣ Final Confirmation before Sprint 6
Check	Pass
npm audit --omit=dev = 0 vulns	✅
npx tsc --noEmit = clean	✅
npm run build = success	✅
Login/session tests pass	✅
Workflow canvas loads/saves	✅
.env secrets safe	✅
🔚 Summary Commands (Quick Run)
npm audit fix && npm audit --omit=dev
npx prisma migrate dev --name sprint5_update
npx tsc --noEmit
npm run build
npx playwright test


When all pass:
→ Merge Sprint 5 into main
→ Tag commit v5.0.0-validated
→ Begin Sprint 6 (Security & Analytics Integration)
