# Codex Naming Conventions

Codex uses a strict, purpose-driven naming convention to keep the system maintainable and predictable.

---

## 1. Variable Naming

Prefix:

CODEX_<CATEGORY>_<NAME>

yaml
Copy code

Examples:

| Variable | Meaning |
|---------|---------|
| `CODEX_PROJECT_URL` | URL for project |
| `CODEX_SPRINT_MILESTONE` | Main dev milestone |
| `CODEX_SUPERVISOR_STALE_DAYS` | Rule threshold |

Rules:

- All caps  
- Underscore separators  
- Prefix always `CODEX_`  
- No lowercase except internal metadata  

---

## 2. Workflow Naming

codex-<component>-<version>.yml

makefile
Copy code

Examples:
codex-dual-track-supervisor-v3.yml
codex-telemetry-merge.yml
codex-supervisor-activity-engine-v2.yml

yaml
Copy code

Versions increment only when behavior changes.

---

## 3. Directory Naming

All Codex documentation lives under:

docs/codex/

yaml
Copy code

Subdirectories follow architecture boundaries:

workflows/
telemetry/
dashboard/
supervisor/
activity-engine/

yaml
Copy code

---

## 4. Telemetry File Naming

All telemetry files live on `gh-pages/`:

| File | Purpose |
|------|---------|
| `codex-data.json` | Merged telemetry |
| `supervisor-telemetry/latest.json` | Supervisor + activity engine |
| `codex-selftest/latest.json` | Self-test output |

---

## 5. Dashboard Naming

dashboard/index.html
dashboard/app.js
dashboard/style.css

yaml
Copy code

---

## 6. Issue Naming Patterns

Codex-generated issues follow:

Codex Self-Test Issue
Codex Supervisor Alert: <type>
Codex Activity Engine Notice: <type>

yaml
Copy code

---

## 7. PR Naming Patterns

Codex-created PRs:

Codex Auto-PR: <description>

python
Copy code

GitHub prevents workflow self-triggering loops; Codex obeys all safety rules.
