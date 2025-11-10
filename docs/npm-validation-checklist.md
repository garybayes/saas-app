🧩 Sprint 5 – NPM Validation & Dependency Health Checklist

Purpose:
Ensure all packages for Sprint 5 (MindForge SaaS-App) are clean, safe, and production-ready before moving to Sprint 6.

1. Clean Installation
# Always start from a clean environment
rm -rf node_modules package-lock.json
npm install


✅ Confirms all dependencies resolve correctly
✅ Removes orphaned or duplicate packages

2. Audit & Fix Known Issues
# Auto-fix non-breaking vulnerabilities
npm audit fix

# If warnings persist, list details
npm audit

# Limit to production dependencies only
npm audit --omit=dev


✅ Expect “0 vulnerabilities” for production dependencies
✅ Ignore low-risk dev warnings from ESLint, Glob, or Playwright

3. Verify Key Libraries
Package	Purpose	Command to Confirm	Expected Result
next-auth	Authentication	npm list next-auth	version ≥ 5.x
prisma	Database ORM	npx prisma -v	Prisma CLI + engine versions shown
typescript	Compile safety	npx tsc --noEmit	No type errors
tailwindcss	Styling	npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch	No errors
playwright	Testing only	npx playwright --version	version number shown
4. Optional Package Updates
# See what can be safely updated
npx npm-check-updates -u

# Reinstall after updating package.json
npm install


✅ Keep future warnings low
✅ Update deprecated sub-packages (glob, jose, etc.)

5. Production Build Sanity Check
npm run build
npm run start


✅ Confirms build passes
✅ Ensures dev-only dependencies (Playwright, ESLint) are excluded

6. Security & Hygiene

🔒 .env.local contains secrets (NEXTAUTH_SECRET, DB_URL) — never commit it.

🧩 .gitignore includes:

node_modules/
.env*
test-results/


🛡️ Run regular audits:

npm audit --omit=dev


🔐 Optional: Add npm install npm-audit-resolver -D for structured reviews.

7. Final Confirmation

Before moving to Sprint 6:

✅ npm audit --omit=dev returns no vulnerabilities
✅ npx tsc --noEmit shows no type errors
✅ npm run build succeeds
✅ Login/session routes tested successfully
✅ All Playwright tests pass

