# Codex Workflow: Dual-Track Supervisor (v3)

The Dual-Track Supervisor is the *primary orchestration layer* of Codex.  
It continuously monitors all work across:

- Main Sprint Milestone (SaaS App)
- Dashboard Milestone (Codex UI)
- Repository health
- Issue & PR lifecycle

It performs lightweight actions and writes supervisor telemetry snapshots.

---

## Workflow File  
`/.github/workflows/codex-dual-track-supervisor-v3.yml`

---

## Purpose

The Supervisor’s job is to:

1. Detect issues belonging to active milestones.
2. Apply stale and escalation rules using repository variables.
3. Add missing issues to the project board.
4. Maintain visibility across both tracks.
5. Produce telemetry snapshots for the dashboard.
6. Trigger telemetry merge after each update.

---

## Repository Variables Used

| Variable | Purpose |
|---------|---------|
| `CODEX_PROJECT_URL` | Base URL of the GitHub project |
| `CODEX_PROJECT_ID` | Project GraphQL ID |
| `CODEX_PROJECT_NUMBER` | Numeric project ID |
| `CODEX_SPRINT_MILESTONE` | Active sprint milestone name |
| `CODEX_DASHBOARD_MILESTONE` | Active dashboard milestone |
| `CODEX_SUPERVISOR_STALE_DAYS` | Supervisor stale threshold |
| `CODEX_SUPERVISOR_ESCALATE_DAYS` | Supervisor escalation threshold |

---

## Workflow Logic

### 1. Scan Issues & PRs

Supervisor gathers:

- Open PRs
- Open issues
- Sprint issues (milestone = sprint)
- Dashboard issues (milestone = dashboard)

### 2. Stale Detection  
Applies stale thresholds separately:

- Sprint issues use `CODEX_SUPERVISOR_STALE_DAYS`
- Dashboard issues use the same (for now; activity engine adds more granularity)

Stale rules use:

(updatedAt older than threshold)

markdown
Copy code

### 3. Escalation Logic

If work exceeds escalation threshold, Supervisor:

- Adds `needs-attention`
- Leaves an escalation comment

### 4. Telemetry Snapshot

Stored here:

gh-pages/supervisor-telemetry/latest.json

markdown
Copy code

Telemetry includes:

- Timestamp  
- Count of stale sprint issues  
- Count of stale dashboard issues  
- Count of open PRs  
- Count of escalations  
- Source = "dual-track-supervisor"

### 5. Trigger Telemetry Merge

Always triggers:

gh workflow run codex-telemetry-merge.yml

yaml
Copy code

---

## Safety Rules

- Never modifies code.
- Never pushes to `main`.
- Does not open PRs automatically.
- All supervisor actions are reversible.

---

## File Structure

Output example:

```json
{
  "timestamp": "2025-11-28T04:31:00Z",
  "status": "ok",
  "source": "dual-track-supervisor-v3",
  "pr_open": 3,
  "sprint_stale": 0,
  "dashboard_stale": 1,
  "escalations": 0
}
Interaction With Other Codex Systems
Component	Interaction
Activity Engine	Supervisor supplies lightweight detection; engine performs heavy lifting
Telemetry Merge	Supervisor triggers it
Self-Test	Validates Supervisor periodically
Dashboard	Displays supervisor telemetry in real time

Version Differences
Version	Changes
v1	Prototype; basic scanning
v2	Telemetry writing; project sync
v3	Full variable-driven configuration + dual-track milestone logic

Current version: v3

yaml
Copy code

---

# 📄 `workflow-activity-engine.md`

```markdown
# Codex Workflow: Supervisor Activity Engine (v2)

The Activity Engine performs deeper analysis than the Dual-Track Supervisor.  
Where Supervisor focuses on *lightweight rule enforcement*, the Activity Engine focuses on:

- PR staleness
- Issue blockers
- Commenting
- Labelling
- Automated reminders
- High-signal telemetry

---

## Workflow File  
`/.github/workflows/codex-supervisor-activity-engine-v2.yml`

---

## Purpose

1. Scan PRs and determine stale ones.
2. Detect issues marked as blocked.
3. Leave reminder comments on stale PRs.
4. Escalate blocked issues.
5. Sync sprint and dashboard items to the project.
6. Write deep telemetry snapshots.
7. Trigger the telemetry merge workflow.

---

## Repository Variables Used

| Variable | Meaning |
|---------|---------|
| `CODEX_PROJECT_URL` | Project root URL |
| `CODEX_PROJECT_ID` | GraphQL project ID |
| `CODEX_PROJECT_NUMBER` | Numeric project ID |
| `CODEX_SPRINT_MILESTONE` | Main sprint |
| `CODEX_DASHBOARD_MILESTONE` | Dashboard sprint |
| `CODEX_ACTIVITY_STALE_DAYS` | Activity-engine stale rule |
| `CODEX_ACTIVITY_ESCALATE_DAYS` | Activity-engine escalation rule |

---

## Engine Logic

### 1. PR Scan
Reads:

number, title, updatedAt, author, url

markdown
Copy code

Categorizes:

- Stale PRs (oldest updates)
- At-risk PRs
- Healthy PRs

### 2. Issue Scan

Downloads:

number, title, labels, updatedAt, milestone

markdown
Copy code

Detects:

- Blocked issues (label=blocked)
- Overdue issues (past threshold)
- Missing project items (auto-fix)

### 3. PR Reminders

Adds comments such as:

⏰ Codex Activity Engine: This PR has been inactive for X days.
Please update or close it.

markdown
Copy code

### 4. Escalations

If issue exceeds escalation rule:

- Adds `needs-attention`
- Adds escalation comment

### 5. Telemetry Snapshot

Stored at:

gh-pages/supervisor-telemetry/latest.json

yaml
Copy code

Fields include:

- PR count
- PR stale count
- Issue count
- Blocked count
- Sprint stale
- Dashboard stale
- Source = "activity-engine-v2"

---

## Safety Rules

- Never closes PRs automatically.
- Comments are non-destructive.
- Labels are additive.
- All actions are logged via telemetry.

---

## Version History

| Version | Changes |
|---------|---------|
| v1 | First heavy-engine build |
| **v2** | Full variable-driven thresholds + milestone sync |

