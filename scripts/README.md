🧭 Database Migration Toolkit – MindForge SaaS-App

PowerShell utilities for synchronizing data between SQLite (local development) and PostgreSQL (test / production).
Used during Sprint 5–6 validation to keep environments consistent while protecting seeded data.

⚙️ Overview
Script	Purpose	Notes
sync-databases.ps1	🔁 Auto-detects current datasource and migrates in the correct direction	Primary tool – keep this
_migrate-sqlite-to-postgres.ps1	Manual one-way copy SQLite → Postgres	Optional legacy backup
_migrate-postgres-to-sqlite.ps1	Manual one-way copy Postgres → SQLite	Optional legacy backup

💡 Recommendation: Keep only sync-databases.ps1 for daily use. The others can stay archived for reference.

🧩 Prerequisites
Tool	Purpose	Verify
Node.js + Prisma CLI	Schema and data export/import	npx prisma -v
PostgreSQL client tools	Provides psql / pg_dump	psql --version
SQLite CLI	Provides sqlite3	sqlite3 --version
PowerShell 7+	Required runtime	pwsh --version

Project structure:

.env
/prisma/schema.prisma
/prisma/dev.db
/scripts/sync-databases.ps1

🚀 Usage Examples
1️⃣ Sync SQLite → PostgreSQL

Push local test data to Postgres:

pwsh ./scripts/sync-databases.ps1


If schema.prisma shows:

provider = "sqlite"


the script will:

Export SQLite → prisma/db_transfer.sql

Switch schema → PostgreSQL

Push schema

Import data into Postgres

2️⃣ Sync PostgreSQL → SQLite

Pull production/test data back to local:

pwsh ./scripts/sync-databases.ps1


If schema.prisma shows:

provider = "postgresql"


the script reverses the process automatically.

🧠 Environment Configuration

Switch between these .env templates depending on context.

Local SQLite (development)
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-dev-secret"

Remote PostgreSQL (staging/production)
DATABASE_URL="postgresql://username:password@localhost:5432/saas_app"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret"


🧭 Tip:

Maintain .env.local and .env.postgres; rename or copy the one you need before running the script.

Always exclude them from Git (see below).

🛡️ Safety Notes

Each migration asks for confirmation before overwriting data.

Source DB is never modified; the script only exports from it.

Temporary file prisma/db_transfer.sql is auto-deleted.

Schema provider line updates automatically to reflect the new target.

If something fails mid-migration, the original database files remain untouched.

🧱 Troubleshooting
Symptom	Cause	Fix
psql: command not found	Postgres client missing	Install Postgres tools
sqlite3: command not found	SQLite CLI missing	winget install SQLite
Prisma “deprecated config” warning	Informational only	Safe to ignore until Prisma 7
Migration aborts	Incorrect credentials or DB not running	Check .env DATABASE_URL
📂 Typical Workflow
Step	Task	Command
1	Seed local SQLite	npx prisma db seed
2	Sync to Postgres	pwsh ./scripts/sync-databases.ps1
3	Run Playwright tests	npx playwright test
4	Sync back to SQLite	pwsh ./scripts/sync-databases.ps1
5	Inspect DB visually	npx prisma studio
🧰 .gitignore Essentials

Add these lines to your root .gitignore to prevent secrets or local DBs from being tracked:

# Environment files
.env
.env.*
!.env.example

# Local databases and dumps
prisma/dev.db
prisma/db_transfer.sql
prisma/sqlite_dump.sql
prisma/postgres_dump.sql

# Prisma artifacts
node_modules/
.prisma/
prisma/migrations/

# Playwright results
test-results/
playwright-report/

# OS / editor junk
.DS_Store
Thumbs.db

✅ Best Practices & Additional Suggestions

Schema as the Source of Truth
Always modify schema.prisma intentionally. Never alter your DB structure directly in SQLite or Postgres.

Version Control Discipline

Commit and tag before every migration:

git add prisma/schema.prisma
git commit -m "Sprint 5 schema update"
git tag -a v5.0.0-db-sync -m "Post-Sprint-5 DB sync complete"


Use annotated tags for major migrations.

Database Snapshots
Keep lightweight .sql exports before large changes:

npx prisma db export --url "file:./prisma/dev.db" --output prisma/pre-migration.sql


Automated Seeding
Store reusable test data in prisma/seed.ts.
Keep it aligned with your schema and include it in CI checks.

Environment Safety
Use separate .env files per stage:

.env.local for dev

.env.staging for internal testing

.env.production for deployment
Copy or symlink the right one before running Prisma commands.

Prisma Studio Checks
After every sync, run:

npx prisma studio


Verify record counts and field mappings before starting tests.

Regular Dependency Updates

npx npm-check-updates -u
npm install
npm audit fix


Optional — Add Database-Sync CI Step
A lightweight GitHub Action can run prisma db push --skip-generate on each merge to validate schema integrity automatically.

Maintainer: Gary G. Bayes, BABA, MBA
Project: MindForge SaaS-App
Last Updated: Sprint 5 Validation Phase

