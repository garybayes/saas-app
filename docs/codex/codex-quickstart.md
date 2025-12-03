📘 Codex Quick Start (2-Page Guide)

Codex automates issue tracking, project maintenance, telemetry, and dashboard updates for dual-track GitHub projects. It runs entirely through GitHub Actions and maintains itself using a small set of labels, milestones, and workflows.

This guide gives you everything you need to understand Codex at a glance.

1. Core Concepts
Codex manages two tracks

Main Track – architecture, system work

Dashboard Track – dashboard UI, telemetry enhancements

Tracks are determined by labels:

codex

codex-trackmain

codex-trackdashboard

Codex Internal milestone

Used exclusively for:

Self-test issues

Internal housekeeping

This milestone is milestone ID 6.

Codex Dashboard

Generated automatically at:

gh-pages/dashboard/dashboard.json


This fuels a lightweight status front-end.

2. Required Setup
Repository Variables

These must exist:

CODEX_MAIN_MILESTONE
CODEX_DASHBOARD_MILESTONE

CODEX_SELFTEST_RETAIN
CODEX_SELFTEST_MAX_AGE_DAYS
CODEX_TELEMETRY_MAX_AGE_DAYS

CODEX_MAIN_STALE_DAYS
CODEX_MAIN_ESCALATION_DAYS
CODEX_DASHBOARD_STALE_DAYS
CODEX_DASHBOARD_ESCALATION_DAYS

Repository Labels

Codex expects these:

codex
codex-selftest
codex-trackmain
codex-trackdashboard

Required Project
Codex Dual-Track Development

Token

Codex uses:

GH_CI_PAT


Required scopes:

repo (read/write)

issues (write)

projects (write)

pages (write)

3. The Codex Workflows (What Runs When)

Codex is composed of 7 workflows:

Self-Test (v6)
Creates internal “self-test” issues to verify Codex is running.

Cleaner (v3)
Deletes stale self-test issues and prunes old telemetry.

Project Sync (v8)
Fixes human-created issues:

Add codex label

Add track labels

Add missing milestone

Add project membership

Supervisor (v6)
Evaluates track health (main + dashboard).
Detects missing labels, missing milestones, stale activity.

Activity Engine (v3)
Computes issue freshness:

active

stale

escalation

Telemetry Merge (v6)
Merges telemetry files into dashboard.json.

Diagnostics (v3)
Confirms that configuration variables, milestones, labels, and folder structure exist.

Cron Summary (approx.)
Self-Test → Cleaner → Project Sync → Supervisor → Activity Engine → Telemetry Merge
Diagnostics runs separately


All workflows never fail the repo’s CI pipeline.
Errors are reported through telemetry.

4. Telemetry System

Every workflow writes a file to:

gh-pages/telemetry/


File format:

<component>-<run>.json


Telemetry Merge compiles the latest of each into:

gh-pages/dashboard/dashboard.json


Dashboard JSON structure:

{
  "supervisor": {...},
  "cleaner": {...},
  "selftest": {...},
  "sync": {...},
  "activity": {...},
  "diagnostics": {...}
}


A front-end (index.html + app.js) can render this as a status dashboard.

5. The Most Important Rule: REST Enumeration Only

Codex never uses gh issue list.

It relies exclusively on:

gh api /repos/$OWNER/$REPO/issues?... --paginate


This prevents silent errors or invisible issues.

6. What Each Workflow Fixes Automatically
Project Sync (v8)

Adds missing codex label

Adds track label

Assigns milestone

Assigns project

Reports any corrections

Cleaner (v3)

Deletes stale self-test issues

Deletes stale telemetry

Supervisor (v6)

Reports issues needing attention

Flags stale or misclassified issues

Activity Engine (v3)

Computes activity levels per issue

Diagnostics (v3)

Reports missing configuration items

All workflows write telemetry, so nothing is hidden.

7. How to Validate Codex Is Working

Check these three things:

1. Dashboard file exists
gh-pages/dashboard/dashboard.json

2. Supervisor telemetry contains fresh timestamps
gh-pages/telemetry/supervisor-<run>.json

3. Cleaner is deleting old self-tests

Look for:

issues_closed: [...]


If all three are present and updating, Codex is healthy.

8. Common Problems & Quick Fixes
Symptom	Likely Cause	Fix
Dashboard not updating	Telemetry Merge blocked or PAT missing	Check PAT; ensure merge pushes
Track labels missing	Human-created issue bypassed automation	Project Sync fixes this automatically
Cleaner not removing issues	Missing codex-selftest label	Check label exists
Supervisor empty	Wrong milestone IDs	Check repo variables
Diagnostics shows missing vars	Repo config incomplete	Add missing variables
9. Future Enhancement (Important)

Codex currently repairs issues but does not detect malformed issues caused by:

transfers

UI migrations

deleted milestones

corrupted label arrays

partial conversions

A future “Issue Integrity Scanner” should be added to Project Sync.

This scanner will:

detect malformed issues

produce early warnings

improve project health

This note is included for future Codex v2.

10. When Codex Becomes Its Own SaaS

Codex already functions as:

a standalone maintenance engine

with a REST-core

and a dashboard interface

To migrate Codex:

Move .github/workflows/codex-* to new repo

Move /docs/codex/ to new repo

Move /gh-pages/ to new repo

Update target repository paths

Deploy dashboard as standalone SPA

Codex then manages one or many external repositories.

11. Summary Checklist (Fastest Possible Onboarding)
Must exist

codex labels

codex-* milestones

Codex Dual-Track Development project

gh-pages/dashboard/

All required repo variables

Must run regularly

Self-Test

Cleaner

Sync

Supervisor

Activity

Merge

Diagnostics

Must use

GH_CI_PAT with repo + issues + pages privileges

REST enumeration only

Should check

Dashboard updates

Telemetry freshness

No missing variables
