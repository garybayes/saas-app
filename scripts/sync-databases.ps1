<#
.SYNOPSIS
  Smart database synchronizer for MindForge SaaS-App.
  Automatically migrates data between SQLite (dev.db)
  and PostgreSQL depending on the current schema provider.

.DESCRIPTION
  Detects the active Prisma datasource provider in prisma/schema.prisma.
  If "sqlite", exports SQLite data and imports into Postgres.
  If "postgresql", exports Postgres data and imports into SQLite.
#>

# --- INITIAL SETUP ---
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $projectRoot

$schemaPath = "$projectRoot\prisma\schema.prisma"
$sqlitePath = "$projectRoot\prisma\dev.db"
$dumpFile   = "$projectRoot\prisma\db_transfer.sql"
$envFile    = "$projectRoot\.env"

Write-Host "🔍 Checking prerequisites..." -ForegroundColor Cyan

if (!(Test-Path $schemaPath)) { Write-Error "❌ schema.prisma not found"; exit 1 }
if (!(Test-Path $envFile))    { Write-Error "❌ .env file missing"; exit 1 }

# Extract DATABASE_URL from .env
$envVars = Get-Content $envFile | Where-Object {$_ -match "="}
$databaseUrl = ($envVars | Where-Object {$_ -match "^DATABASE_URL"}) -replace "DATABASE_URL=", ""

if (-not $databaseUrl) {
    Write-Error "❌ DATABASE_URL not found in .env"
    exit 1
}

# Detect current provider
$schemaContent = Get-Content $schemaPath -Raw
$provider = if ($schemaContent -match 'provider\s*=\s*"postgresql"') { "postgresql" } elseif ($schemaContent -match 'provider\s*=\s*"sqlite"') { "sqlite" } else { "unknown" }

Write-Host "`nDetected current provider: $provider" -ForegroundColor Yellow

# --- SAFETY CONFIRMATION ---
if ($provider -eq "sqlite") {
    Write-Host "`n⚠️  You are about to overwrite data in your PostgreSQL database with the contents of SQLite (dev.db)." -ForegroundColor Yellow
    Write-Host "Proceed? (Y/N): " -NoNewline
} elseif ($provider -eq "postgresql") {
    Write-Host "`n⚠️  You are about to overwrite data in your local SQLite (dev.db) with data from PostgreSQL." -ForegroundColor Yellow
    Write-Host "Proceed? (Y/N): " -NoNewline
} else {
    Write-Error "❌ Could not determine provider in schema.prisma"
    exit 1
}

$confirm = Read-Host
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled by user." -ForegroundColor Red
    exit 0
}

# --- FUNCTION DEFINITIONS ---

function Migrate-SQLiteToPostgres {
    Write-Host "📤 Exporting SQLite data..." -ForegroundColor Yellow
    npx prisma db export --url "file:./prisma/dev.db" --output $dumpFile
    if (!(Test-Path $dumpFile)) { Write-Error "❌ Export failed"; exit 1 }

    Write-Host "⚙️  Switching schema to PostgreSQL..." -ForegroundColor Yellow
    $content = (Get-Content $schemaPath -Raw) `
        -replace 'provider\s*=\s*"sqlite"', 'provider = "postgresql"' `
        -replace 'url\s*=\s*".*"', 'url      = env("DATABASE_URL")'
    Set-Content $schemaPath $content

    Write-Host "📡 Pushing Prisma schema to Postgres..." -ForegroundColor Yellow
    npx prisma db push

    Write-Host "📥 Importing SQLite data into Postgres..." -ForegroundColor Yellow
    Get-Content $dumpFile | psql $databaseUrl
    Write-Host "✅ Migration to PostgreSQL complete." -ForegroundColor Green
}

function Migrate-PostgresToSQLite {
    Write-Host "📤 Exporting PostgreSQL data..." -ForegroundColor Yellow
    pg_dump --data-only --inserts --no-owner --no-privileges --file=$dumpFile $databaseUrl
    if (!(Test-Path $dumpFile)) { Write-Error "❌ Export failed"; exit 1 }

    Write-Host "⚙️  Switching schema to SQLite..." -ForegroundColor Yellow
    $content = (Get-Content $schemaPath -Raw) `
        -replace 'provider\s*=\s*"postgresql"', 'provider = "sqlite"' `
        -replace 'url\s*=\s*env\("DATABASE_URL"\)', 'url      = "file:./dev.db"'
    Set-Content $schemaPath $content

    if (Test-Path $sqlitePath) { Remove-Item $sqlitePath -Force }
    Write-Host "🧱 Recreating SQLite schema..." -ForegroundColor Yellow
    npx prisma db push

    Write-Host "📥 Importing Postgres data into SQLite..." -ForegroundColor Yellow
    sqlite3 $sqlitePath ".read $dumpFile"
    Write-Host "✅ Migration to SQLite complete." -ForegroundColor Green
}

# --- EXECUTION SWITCH ---
switch ($provider) {
    "sqlite"      { Migrate-SQLiteToPostgres }
    "postgresql"  { Migrate-PostgresToSQLite }
    default       { Write-Error "❌ Could not determine provider in schema.prisma"; exit 1 }
}

# --- CLEANUP ---
if (Test-Path $dumpFile) { Remove-Item $dumpFile -Force }
Write-Host "`n🎉 Sync complete! You can now run 'npx prisma studio' to inspect the new database." -ForegroundColor Cyan
