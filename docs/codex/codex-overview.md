# Codex Dual-Track Development — System Overview

Codex is an automated supervisor system designed to monitor, manage, and accelerate development across two parallel tracks:

- **Main Development Track (SaaS Application)**
- **Dashboard Track (Telemetry Visualizer and Codex UI)**

Codex leverages GitHub Actions, GitHub Projects, and a structured telemetry pipeline to:

1. Detect stale work.
2. Escalate blocked issues.
3. Create PRs when workflows require action.
4. Maintain continuous telemetry.
5. Ensure dashboard data is always fresh.

---

## Core Components

### 🧠 1. Dual-Track Supervisor (Primary Guardian)
- Scans issues and PRs in both tracks.
- Applies stale/escalation rules.
- Files supervisor telemetry snapshots.
- Ensures sprint and dashboard milestones remain active and progressing.

### ⚙️ 2. Activity Engine
- Deeper analysis engine for repository health.
- Looks for stale PRs, blocked issues, orphan issues, or abandoned work.
- Performs direct GitHub actions (comments, labels).
- Generates its own telemetry snapshot.

### 🧪 3. Self-Test Workflow
- Continuously validates that:
  - Issues can be created.
  - Issues can be added to the project.
  - Issues can be closed.
  - Telemetry is written.
- Ensures Codex's entire pipeline remains healthy.

### 🛰 4. Telemetry Merge Workflow
- Combines all telemetry streams into one unified file:
gh-pages/codex-data.json

yaml
Copy code
- Ensures the dashboard always reflects the latest combined state.

### 📊 5. Dashboard Deployment Workflow
- Rebuilds + deploys dashboard to `gh-pages/dashboard/*`
- Triggered only when dashboard source files in `main` are updated.

---

## Telemetry Sources

| Component           | Output Location                        |
|--------------------|-----------------------------------------|
| Supervisor         | `gh-pages/supervisor-telemetry/latest.json` |
| Self-Test          | `gh-pages/codex-selftest/latest.json`       |
| Activity Engine    | `gh-pages/supervisor-telemetry/latest.json` |
| Combined Data      | `gh-pages/codex-data.json`                  |

---

## Repository Variables

| Name | Description |
|------|-------------|
| **CODEX_PROJECT_URL** | Project root URL |
| **CODEX_PROJECT_ID** | GraphQL project ID |
| **CODEX_PROJECT_NUMBER** | Project number integer |
| **CODEX_SPRINT_MILESTONE** | Main sprint milestone name |
| **CODEX_DASHBOARD_MILESTONE** | Dashboard milestone name |
| **CODEX_SUPERVISOR_STALE_DAYS** | Supervisor stale threshold |
| **CODEX_DASHBOARD_STALE_DAYS** | Dashboard stale threshold |
| **CODEX_SUPERVISOR_ESCALATE_DAYS** | Supervisor escalation |
| **CODEX_DASHBOARD_ESCALATE_DAYS** | Dashboard escalation |

---

## Codex Philosophy

Codex follows a strict philosophy:

1. **Autonomy first**, but always transparent.
2. **Non-destructive** automation — actions must be reversible.
3. **Information is the backbone** — telemetry must never silently fail.
4. **Supervisor is the brains**, activity engine is the muscle.
5. **Dashboard is the truth source** for Codex state.

---
