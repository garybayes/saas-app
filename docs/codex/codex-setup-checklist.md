# Codex Setup Checklist

Use this document when installing Codex into a new repository or performing a full reset.

---

## 1. Create Repository Variables

Go to:
GitHub → Settings → Secrets and Variables → Variables → Repository Variables

yaml
Copy code

Create the following:

### Core Project Vars
| Variable | Example |
|---------|----------|
| `CODEX_PROJECT_URL` | https://github.com/users/garybayes/projects/1 |
| `CODEX_PROJECT_ID` | PVT_lAHODgSGMM4BI6BO |
| `CODEX_PROJECT_NUMBER` | 1 |

### Milestones
| Variable | Example |
|---------|---------|
| `CODEX_SPRINT_MILESTONE` | Sprint 5 Completion |
| `CODEX_DASHBOARD_MILESTONE` | Dashboard V2 |

### Supervisor + Dashboard Rule Thresholds
| Variable | Example |
|---------|---------|
| `CODEX_SUPERVISOR_STALE_DAYS` | 3 |
| `CODEX_DASHBOARD_STALE_DAYS` | 5 |
| `CODEX_SUPERVISOR_ESCALATE_DAYS` | 7 |
| `CODEX_DASHBOARD_ESCALATE_DAYS` | 10 |

---

## 2. Create Required Milestones

Example:

### Sprint Track
- **Sprint 5 Completion**
- **Sprint 4 Stabilization**

### Dashboard Track
- **Dashboard V2**
- **Dashboard V3 Enhancements**

---

## 3. Create GitHub Projects (if missing)

Use:
gh project create --owner garybayes --title "Codex Dual-Track Development"

yaml
Copy code

---

## 4. Enable GitHub Actions → Pages

1. Branch deployment: **GitHub Actions**
2. Location: `gh-pages`

Also create:

gh-pages/.nojekyll

yaml
Copy code

---

## 5. Verify Telemetry File Structure

Must exist after first runs:

gh-pages/
supervisor-telemetry/latest.json
codex-selftest/latest.json
codex-data.json
dashboard/
index.html
app.js
style.css

yaml
Copy code

---

## 6. Validate Internal Workflows

Run each manually:

gh workflow run codex-self-test.yml
gh workflow run codex-dual-track-supervisor.yml
gh workflow run codex-supervisor-activity-engine.yml
gh workflow run codex-telemetry-merge.yml
gh workflow run deploy-codex-dashboard.yml

yaml
Copy code

---

## 7. Lock Repository After Validation

Enable:

- Main branch protection
- Require PR review
- Require checks to pass
- Prevent direct pushes
- Require PRs from workflows only via Codex supervisor
