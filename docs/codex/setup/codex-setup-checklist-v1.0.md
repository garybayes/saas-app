# Codex Setup Checklist v1.0  
_Last updated: {{DATE}}_

This document defines the minimum required configuration for running the complete **Codex Dual-Track Development System** inside this repository.  
Follow this checklist **once per repo setup**, or after major refactors.

---

## ✅ 1. Required GitHub Repository Variables

These variables allow Codex workflows to operate without hard-coding sprint or milestone names.

Set them in:  
**Repository → Settings → Variables → Repository Variables**

| Variable | Example | Description |
|---------|---------|-------------|
| `CODEX_PROJECT_ID` | `PVT_xxxxx` | GitHub Project V2 ID (Dual-Track Board). |
| `CODEX_ACTIVE_SPRINT` | `Sprint 5 Completion` | Milestone for main development sprint issues. |
| `CODEX_DASHBOARD_MILESTONE` | `Dashboard Upgrades` | Milestone for telemetry/dashboard issues. |

---

## ✅ 2. Required GitHub Repository Secrets

Set in:  
**Repository → Settings → Secrets and Variables → Actions → Secrets**

| Secret | Description |
|--------|-------------|
| `GH_CI_PAT` | A PAT with: `repo`, `project`, `workflow`. Required for all Codex workflows. |

---

## ✅ 3. Required GitHub Branches

| Branch | Purpose |
|--------|---------|
| `main` | Source of code and workflow logic. |
| `gh-pages` | Stores telemetry JSON + dashboard. |

**Both branches MUST exist.**

---

## ✅ 4. Required Folder Structure (on main)

.github/workflows/
codex/
dashboard/
index.html
app.js
style.css

yaml
Copy code

---

## ✅ 5. Required Codex Workflows Installed

All of these must exist under `.github/workflows/`:

- `codex-dual-track-supervisor-v3.yml`
- `codex-supervisor-activity-engine-v2.yml`
- `codex-self-test-v4.yml`
- `codex-telemetry-merge.yml`
- `deploy-codex-dashboard.yml`
- `project-sync.yml` (optional but recommended)

---

## ✅ 6. Dashboard Build & Telemetry Layout

The following must exist **on gh-pages**:

codex-data.json
codex-selftest/latest.json
supervisor-telemetry/latest.json
dashboard/
index.html
app.js
style.css
.nojekyll

yaml
Copy code

---

## ✅ 7. Validate Telemetry Flow

Run each workflow manually at least once:

1. `Codex Self-Test v4`
2. `Codex Dual-Track Supervisor v3`
3. `Codex Supervisor Activity Engine v2`
4. `Codex Telemetry Merge`
5. `Deploy Codex Dashboard`

Then visit:

https://<username>.github.io/<repo>/dashboard/

yaml
Copy code

Verify:

- Supervisor telemetry appears  
- Self-test telemetry appears  
- Entries update on refresh (cache busting enabled)

---

## ✅ 8. Optional but Recommended

- Enable branch protection for `main` once Codex stabilizes  
- Add issues for upcoming improvements directly to Dual-Track project
- Tag enhancements with `codex` for visibility

---

## ✔ Completion

Once everything above is green, the repository is fully configured for:

- Dual-Track autosupervision
- Automated testing and issue lifecycle management
- Telemetry dashboard
- Event-driven workflow chaining

Codex is now **operational and safe**.

