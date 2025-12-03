📘 Codex Automation Architecture v1

Codex: GitHub Automation, Issue Management, and Dashboard Telemetry System
Last updated: v1.0 (stable)

1. Introduction

Codex is an automation layer that manages GitHub Issues, Milestones, Labels, Telemetry, and GitHub Pages dashboards. Its purpose is to provide:

Reliable, self-healing issue workflows

Fully automated tracking across multiple milestones (“tracks”)

Automated cleanup of self-test issues

Daily supervision of issue hygiene

A public-facing dashboard backed by telemetry

A consistent contract for future workflows

Codex integrates GitHub Issues, GitHub Projects, GitHub Actions, and GitHub Pages into one unified system.

This document is the source of truth for all Codex architecture, workflows, variables, and telemetry.

2. Directory Layout
.
├── .github/workflows/                      # Codex workflows
│   ├── codex-self-test.yml
│   ├── codex-cleaner-selftest.yml
│   ├── codex-supervisor.yml
│   ├── codex-supervisor-activity-engine.yml
│   ├── codex-telemetry-merge.yml
│   ├── codex-project-sync.yml
│   ├── codex-diagnostics.yml
│   └── ...
├── scripts/                               # Utility scripts
│   └── codex-patch-selftest-labels.sh
├── main/codex/dashboard/                  # Dashboard source (HTML/JS/CSS)
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── gh-pages/                              # GitHub Pages publishing branch
│   ├── dashboard/
│   │   ├── index.html
│   │   ├── app.js
│   │   └── styles.css
│   ├── telemetry/
│   │   ├── self-test-*.json
│   │   ├── supervisor-*.json
│   │   ├── cleaner-*.json
│   │   └── activity-*.json
│   └── dashboard.json                     # Final merged telemetry
└── docs/codex/
    └── codex-automation-architecture.md   # This document

3. Label Schema

Codex uses four primary labels.

1. codex

Attached to:

All codex-generated issues

All self-test issues

All human-created issues intended for Codex automation

This is the “membership” label.

2. codex-selftest

Attached to:

All self-test issues (created nightly or manually)

3. codex-trackmain

Attached to issues in the “Main” milestone (or future mainline milestones).

4. codex-trackdashboard

Attached to issues in “Dashboard” milestone.

Label Rules

Codex never removes the codex label.

Track labels reflect lineage; they are not removed after completion.

Self-test issues never receive track labels.

Project Sync ensures all milestone-based issues have correct track labels.

4. Milestone Schema

Codex uses a milestone-per-track model:

1. CODEX_MAIN_MILESTONE

Primary development track.

2. CODEX_DASHBOARD_MILESTONE

Dashboard / UI validation track.

3. CODEX_SELFTEST_MILESTONE

Milestone for self-tests.

If missing → fallback to "Codex Internal".

Milestone Rules

Issues inherit track labels based on their milestone.

Completed milestones do not require label cleanup.

Self-test milestone is fully ignored by Supervisor and Activity Engine.

Project Sync enforces correct milestone → track mapping.

5. Repository Variables (Configuration Contract)

Each repo variable has a clear meaning and default behavior.

Variable	Purpose	Example
CODEX_MAIN_MILESTONE	Current main milestone	“Sprint 4 Stabilization”
CODEX_DASHBOARD_MILESTONE	Current dashboard milestone	“Dashboard Validation”
CODEX_SELFTEST_MILESTONE	Self-test milestone	“Codex Internal”
CODEX_MAIN_STALE_DAYS	Days before main issue = stale	2
CODEX_MAIN_ESCALATE_DAYS	Days before main issue = escalate	3
CODEX_DASHBOARD_STALE_DAYS	Dashboard stale threshold	3
CODEX_DASHBOARD_ESCALATE_DAYS	Dashboard escalate threshold	4
CODEX_SELFTEST_RETAIN	How many newest self-test issues to keep	5
CODEX_SELFTEST_MAX_AGE_DAYS	Max age for self-test issues	7
CODEX_TELEMETRY_MAX_AGE_DAYS	Retention window for raw telemetry	30
CODEX_PROJECT_NUMBER	GitHub Project number	1
CODEX_PROJECT_URL	Project reference URL	https://github.com/users/.../projects/1
Deprecated Variables

CODEX_ACTIVITY_STALE_DAYS

CODEX_ACTIVITY_ESCALATE_DAYS

These are replaced by main/dashboard equivalents.

6. Secrets Schema

Codex requires a single GitHub Actions secret:

GH_CI_PAT

Permissions needed:

repo

project

issues

workflow

pages (optional, if using actions to push to gh-pages)

If this token expires, most Codex workflows will skip gracefully and log telemetry.

7. Workflow Overview

Below is a plain-English explanation of each workflow.

7.1 Self-Test v6

Purpose: Validate automation system by creating a test issue.

Behavior:

Uses CODEX_SELFTEST_MILESTONE or fallback: Codex Internal

Validates milestone existence

If missing → write telemetry + skip

Creates issue with labels:

codex

codex-selftest

Writes telemetry to:
gh-pages/telemetry/self-test-<run>.json

7.2 Self-Test Cleaner v2

Purpose: Remove old self-test issues & telemetry.

Behavior:

Keeps only:

newest CODEX_SELFTEST_RETAIN issues

issues newer than CODEX_SELFTEST_MAX_AGE_DAYS

Deletes telemetry older than CODEX_TELEMETRY_MAX_AGE_DAYS

Writes telemetry:
gh-pages/telemetry/cleaner-<run>.json

7.3 Supervisor v6

Purpose: Validate hygiene of main and dashboard tracks.

Behavior:

Reads:

CODEX_MAIN_MILESTONE

CODEX_DASHBOARD_MILESTONE

Excludes self-test milestones

Checks each codex issue for proper track label

Writes telemetry:
gh-pages/telemetry/supervisor-<run>.json

7.4 Activity Engine v3

Purpose: Evaluate stale & escalation thresholds.

Behavior:

Reads:

CODEX_MAIN_STALE_DAYS

CODEX_MAIN_ESCALATE_DAYS

CODEX_DASHBOARD_STALE_DAYS

CODEX_DASHBOARD_ESCALATE_DAYS

Flags stale, escalated issues

Writes telemetry:
gh-pages/telemetry/activity-<run>.json

7.5 Telemetry Merge v6

Purpose: Combine all telemetry into a single dashboard.json.

Behavior:

Reads all files under:
gh-pages/telemetry/*.json

Merges them by component:

selftest

supervisor

cleaner

activity

Writes updated:
gh-pages/dashboard.json

Commits & pushes to the gh-pages branch

7.6 Project Sync v8

Purpose: Enforce track labels & project membership.

Behavior:

Ensures all codex issues belong to the project (CODEX_PROJECT_NUMBER)

Ensures track label matches milestone:

main milestone → codex-trackmain

dashboard milestone → codex-trackdashboard

Self-test issues excluded

Writes no telemetry (diagnostics handles validation)

7.7 Diagnostics v3

Purpose: Validate configuration; help detect missing variables.

Checks:

All required repo variables

GH_CI_PAT exists

Milestone existence

Project number responsive

Telemetry folder readable

Outputs pass/warn/error summary.

8. Workflow Interaction Diagram (text)
            +----------------+
            |  Self-Test     |
            +--------+-------+
                     |
                     v
        gh-pages/telemetry/self-test-*.json
                     |
                     v
              Telemetry Merge
                     |
                     v
         gh-pages/dashboard.json
                     |
                     v
            GitHub Pages Dashboard


Additional paths:

Cleaner → telemetry/cleaner-*.json → Merge → dashboard.json
Supervisor → telemetry/supervisor-*.json → Merge
Activity Engine → telemetry/activity-*.json → Merge
Project Sync → fixes issue metadata (no telemetry)

9. Telemetry Specification

Each telemetry file includes:

{
  "component": "selftest" | "cleaner" | "supervisor" | "activity",
  "status": "ok" | "warning" | "error",
  "timestamp": "<ISO-8601>",
  "run_id": "<GitHub Run ID>",
  "run_number": "<GitHub Run Number>",
  "repository": "<owner/repo>",
  ...component-specific fields...
}


Dashboard JSON merges by component:

{
  "selftest": [...],
  "cleaner": [...],
  "supervisor": [...],
  "activity": [...]
}

10. Dashboard Architecture
Source

Lives in main/codex/dashboard/

Build

Copied to gh-pages/dashboard/ during the build pipeline

Runtime

JavaScript (app.js) fetches:
/dashboard.json

Renders summaries for:

Self-Test results

Supervisor hygiene status

Cleaner retention events

Activity Engine stale/escalation checks

Codex dashboard is fully separate from the SaaS dashboard.

11. Track Assignment Rules

Track labels indicate lineage and are never removed.

Main milestone → codex-trackmain
Dashboard milestone → codex-trackdashboard

During the Pending → Active transition:

Project Sync applies the correct track label immediately

Issues maintain track label after completion

There is no conflict with past sprints.

12. Sprint Transition Procedure
When moving to next sprint:

Create new milestone (e.g., “Sprint 5 Main”)

Update repo variable CODEX_MAIN_MILESTONE

Allow Project Sync to assign track labels automatically

Supervisor and Activity Engine automatically monitor new milestone

No cleanup of old labels required

This reduces operator overhead.

13. Failure Modes and Safety Guarantees

Codex workflows do not fail the pipeline.
They write telemetry instead.

Failure mode examples:

Missing milestone

GH_CI_PAT invalid

Missing project number

GitHub API downtime

Telemetry merge conflict

Guarantees:

Self-Test never fails

Supervisor never fails

Merge always attempts safe commit

Cleaner only deletes what is safe

No workflow deletes labels or milestones

14. One-Time Migration Steps
Required:

Run scripts/codex-patch-selftest-labels.sh

Adds codex-selftest to all issues with:

label codex, OR

milestone Codex Internal

Optional:

Remove deprecated repo variables

Clean old telemetry manually

15. Future-Proofing Notes

Codex is designed to expand:

Additional tracks can be added with new repo variables

Dashboard can evolve with new telemetry types

Workflows can be extended or disabled safely

Telemetry merge is agnostic to new components

The architecture is stable for long-term use.
