docs/codex/codex-reference-v1.md
# Codex Reference v1  
Comprehensive Architecture, Workflows, Telemetry, and Operational Guide

---

## Table of Contents

1. Introduction  
2. High-Level Architecture  
3. Repository Layout  
4. Labels & Milestones  
5. Projects & Track Model  
6. Issue Lifecycle Management  
7. Self-Test Workflow (v6)  
8. Cleaner Workflow (v3)  
9. Project Sync Workflow (v8)  
10. Supervisor Workflow (v6)  
11. Activity Engine (v3)  
12. Telemetry Merge (v6)  
13. Dashboard Schema  
14. Diagnostics Workflow (v3)  
15. REST Enumeration Requirement  
16. Future Enhancements  
17. FAQ & Troubleshooting  
18. Glossary  
19. Security & Secret-Handling Best Practices  
20. Migrating Codex to Its Own Repository  
21. CLI Tools Reference  
22. Error & Recovery Scenarios  

---

# 1. Introduction

Codex is a collection of GitHub Actions and maintenance automation that manages dual-track project workflows inside a repository. It ensures issues remain properly labeled, tracked, categorized, cleaned, and visible through a dashboard deployed to `gh-pages`.

Codex provides:

- Automated issue housekeeping  
- Early detection of configuration drift  
- A telemetry-powered dashboard  
- Activity and freshness monitoring  
- Error-tolerant workflows that never break CI/system pipelines  
- A well-defined contract for labels, milestones, and project membership  

Codex is now architected as a standalone sidecar service and can be lifted out into its own SaaS or repository in the future.

---

# 2. High-Level Architecture

Codex is composed of seven main workflows:

- **Self-Test v6** – Verifies core functionality by creating test issues.  
- **Cleaner v3** – Deletes stale self-test issues and prunes old telemetry.  
- **Project Sync v8** – Uses REST API enumeration to fix human-created issues.  
- **Supervisor v6** – Evaluates track health (main + dashboard).  
- **Activity Engine v3** – Computes stale/warning/escalation states.  
- **Telemetry Merge v6** – Merges all telemetry into `dashboard.json`.  
- **Diagnostics v3** – Validates required configuration.  

## Execution flow (every 4–6 hours)



Self-Test → Cleaner → Project Sync → Supervisor → Activity Engine → Telemetry Merge → Dashboard


## Token model

Codex uses:

- `GH_CI_PAT` – the primary token for all workflows  
- Must have:  
  - repo read/write  
  - issues write  
  - project write  
  - pages write  

---

# 3. Repository Layout



repo/
.github/workflows/
codex-self-test.yml
codex-cleaner-selftest.yml
codex-project-sync.yml
codex-supervisor.yml
codex-activity-engine.yml
codex-telemetry-merge.yml
codex-diagnostics.yml

scripts/
fix-codex-issues.sh
codex-patch-selftest-labels.sh

docs/codex/
codex-reference-v1.md

gh-pages/
telemetry/
supervisor-.json
cleaner-.json
sync-.json
diagnostics-.json
activity-.json
self-test-.json

dashboard/
  dashboard.json
  index.html / app.js / styles.css  (optional UI)


---

# 4. Labels & Milestones

## Required labels

| Label                | Purpose |
|----------------------|---------|
| `codex`              | Required on all Codex-managed issues |
| `codex-trackmain`    | Indicates main track issues |
| `codex-trackdashboard` | Indicates dashboard track issues |
| `codex-selftest`     | Marks issues created by Self-Test |

## Required milestones

| Milestone | Description |
|----------|-------------|
| `Codex Internal` | All self-test and internal maintenance issues (milestone ID = 6) |
| `$CODEX_MAIN_MILESTONE` | Main track milestone |
| `$CODEX_DASHBOARD_MILESTONE` | Dashboard milestone |

---

# 5. Projects & Track Model

Codex relies on one project:

**Codex Dual-Track Development**

Tracks:

- **Main track** → architectural and workflow work  
- **Dashboard track** → dashboard UI, telemetry enhancements  

Track label selection rule:

- If issue title contains “dashboard” → `codex-trackdashboard`  
- Otherwise → `codex-trackmain`

Project Sync enforces all rules and repairs drift automatically.

---

# 6. Issue Lifecycle Management

1. **Creation**  
   Human-created issues may be incomplete (missing labels, milestones).  
   Codex fixes them via Project Sync.

2. **Self-Test**  
   Generates artificial issues for testing.

3. **Cleaner**  
   Deletes stale self-test issues and prunes telemetry.

4. **Supervisor + Activity Engine**  
   Analyze activity and health of tracks.

5. **Dashboard**  
   Displays merged telemetry.

6. **Retirement**  
   Self-test issues eventually deleted; normal issues closed manually.

---

# 7. Self-Test Workflow (v6)

Purpose:

- Ensure Codex pipeline is operational  
- Validate milestone existence  
- Validate token permissions  
- Generate telemetry regardless of error state  
- Never fail the workflow

Key Behavior:

- Uses `$CODEX_SELFTEST_MILESTONE`, falls back to `Codex Internal`  
- Skips gracefully if milestone missing  
- Writes telemetry: `self-test-<run>.json`  
- Labels: `codex`, `codex-selftest`  
- Uses REST enumeration indirectly via Project Sync  

---

# 8. Cleaner Workflow (v3)

Cleaner uses **REST API enumeration** to guarantee complete visibility.

## Retention Rules

- Keep newest `CODEX_SELFTEST_RETAIN` issues  
- Delete issues older than `CODEX_SELFTEST_MAX_AGE_DAYS`  
- Delete stale telemetry older than `CODEX_TELEMETRY_MAX_AGE_DAYS`

## Telemetry example

```json
{
  "component": "cleaner",
  "status": "ok",
  "issues_closed": [101,102],
  "telemetry_pruned_count": 4
}


Cleaner never fails the run.

9. Project Sync Workflow (v8)

Core responsibilities:

Fix missing codex label

Fix missing track label

Fix missing milestone

Fix missing project membership

Exclude:

Codex Internal items

Self-test issues

Correction reporting

Project Sync writes:

telemetry/sync-<run>.json


Example:

{
  "corrections": {
    "codex_label": 3,
    "track_main": 2,
    "track_dashboard": 1,
    "project_adjustments": 4
  },
  "details": [
    {"number": 88, "changes": ["milestone", "codex-trackmain"]},
    {"number": 102, "changes": ["add_codex_label"]}
  ]
}

REST Enumeration Rule

Project Sync now relies only on:

gh api /repos/$OWNER/$REPO/issues?... --paginate


No CLI listing is trusted.

10. Supervisor Workflow (v6)

Supervisor evaluates:

main track

dashboard track

It ignores:

Codex Internal

Self-test issues

Supervisor evaluates:

Missing labels

Missing milestones

Incorrect track membership

Stale or failing issues

Branch-specific deterioration

Writes telemetry:

telemetry/supervisor-<run>.json

11. Activity Engine (v3)

Computes:

active

stale

escalation

Based on:

$CODEX_MAIN_STALE_DAYS

$CODEX_MAIN_ESCALATION_DAYS

$CODEX_DASHBOARD_STALE_DAYS

$CODEX_DASHBOARD_ESCALATION_DAYS

Writes telemetry:

telemetry/activity-<run>.json

Example output:

{
  "main": [
    {"number": 45, "status": "active"},
    {"number": 31, "status": "stale"}
  ],
  "dashboard": []
}

12. Telemetry Merge (v6)

Reads latest files from:

self-test

cleaner

supervisor

sync

activity

diagnostics

Produces:

gh-pages/dashboard/dashboard.json

This is the input to the dashboard UI.

13. Dashboard Schema

The merged file:

dashboard/dashboard.json


Structure:

{
  "supervisor": {...},
  "cleaner": {...},
  "selftest": {...},
  "sync": {...},
  "activity": {...},
  "diagnostics": {...}
}

14. Diagnostics Workflow (v3)

Validates:

required repo variables exist

required labels exist

required milestones exist

required project exists

gh-pages layout exists

Writes:

telemetry/diagnostics-<run>.json

Diagnostics never fails; it emits structured warnings.

15. REST Enumeration Requirement

This rule exists because GitHub CLI’s gh issue list can omit issues in special states:

transferred

converted

UI migrations

partial deletions

missing label arrays

issues created by GitHub internal actions

REST API is the only reliable enumeration method.

All Codex workflows now use:

gh api ... --paginate --jq .

16. Future Enhancements
16.1 Issue Integrity Scanner (from your note)

Project Sync currently reports corrections but does not actively search for malformed issues. A future module should detect issues where:

labels array is missing

milestone reference is null or invalid

REST-visible but CLI-invisible

missing updatedAt or createdAt

label objects malformed

issues belong to deleted milestones or projects

Output would include:

"integrity": {
  "malformed": [
    {"number": 123, "reason": "missing labels[]"}
  ]
}

16.2 Codex as standalone SaaS

Codex is already architected to be extracted to its own repository.

16.3 Multi-repo federation

Codex may eventually manage multiple repositories from a single dashboard.

17. FAQ & Troubleshooting
Supervisor is empty

Likely missing track labels → run Project Sync manually.

Dashboard not updating

Telemetry Merge may not be running or push permissions missing.

Cleaner not deleting issues

Verify:

codex-selftest label exists

milestone=Codex Internal

retention rules applied

Activity Engine missing data

Check stale/escalation variables.

18. Glossary

Track — a logical grouping of Codex issues (main, dashboard).
Telemetry — JSON emitted by workflows for dashboard reporting.
Codex Internal — milestone containing all self-test issues.
REST Enumeration — fetching issues via GitHub REST API.
Stale — older than threshold; attention required.

19. Security & Secret-Handling Best Practices

Use GH_CI_PAT with minimum required scopes.

Never store PATs in vars; always use secrets.

Lock down gh-pages environment to write-only.

Rotate tokens every 90 days.

Avoid passing tokens through echo or logs.

20. Migrating Codex to Its Own Repository

Recommended structure:

codex/
  workflows/
  scripts/
  dashboard/
  docs/


Migration steps:

Move .github/workflows/codex-*

Move dashboard and telemetry to new repo

Update all REST paths to target multiple repos

Publish dashboard frontend as standalone SPA

Codex can then operate as:

a GitHub App

a SaaS

a repo-based automation suite

21. CLI Tools Reference

Primary commands used:

gh api — REST access

gh issue close

gh auth login

jq — JSON parsing

date — age computation

printf — safe structured output

22. Error & Recovery Scenarios
Missing milestone

Self-Test skips gracefully; Supervisor continues; Diagnostics reports.

Invalid labels

Project Sync repairs.

Broken dashboard

Telemetry Merge regenerates dashboard.json.

Token missing

Workflows abort early before running dangerous operations.

Large volume of malformed issues

Cleaner/Supervisor unaffected due to REST enumeration.

End of Codex Reference v1
