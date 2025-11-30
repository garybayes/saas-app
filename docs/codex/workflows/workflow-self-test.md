# Codex Workflow: Self-Test (v4)

The Self-Test workflow validates that Codex’s internal ability to:

- Create issues  
- Add issues to the project  
- Close issues  
- Write telemetry  
- Trigger telemetry merge  

…remains functional at all times.

---

## Workflow File  
`/.github/workflows/codex-self-test-v4.yml`

---

## Purpose

1. Exercises a complete lifecycle:
   - Create → Add to project → Close.
2. Writes telemetry snapshot.
3. Verifies GH_PAT, project ID, and permissions.
4. Ensures Codex will not silently degrade.

---

## Telemetry Written To

gh-pages/codex-selftest/latest.json

css
Copy code

Example output:

```json
{
  "timestamp": "2025-11-28T04:10:44Z",
  "status": "success",
  "issue": 73,
  "source": "self-test-v4"
}
Triggering Telemetry Merge
Self-test workflow always triggers:

arduino
Copy code
gh workflow run codex-telemetry-merge.yml
This ensures the dashboard is always consistent.

Version History
Version	Changes
v3	printf-safe JSON writing
v4	Writes only to gh-pages + clean merge triggering

yaml
Copy code

---

# 📄 `workflow-telemetry-merge.md`

```markdown
# Codex Workflow: Telemetry Merge (v3)

The Telemetry Merge workflow consolidates ALL telemetry sources into:

gh-pages/codex-data.json

yaml
Copy code

This file is the *single source of truth* for the dashboard.

---

## Workflow File  
`/.github/workflows/codex-telemetry-merge.yml`

---

## Purpose

1. Read latest supervisor telemetry.
2. Read latest self-test telemetry.
3. Read latest activity engine telemetry (same folder).
4. Write unified data file.
5. Prevent merge conflicts using `pull --rebase`.

---

## Telemetry Inputs

| Component | Input File |
|----------|------------|
| Supervisor | `supervisor-telemetry/latest.json` |
| Activity Engine | same as supervisor |
| Self-Test | `codex-selftest/latest.json` |

---

## Output File Structure

Example:

```json
{
  "updated_at": "2025-11-28T04:33:22Z",
  "supervisor": {...},
  "selftest": {...}
}
Key Design Points
Must always pull before pushing.

Must gracefully handle missing telemetry.

Must NEVER overwrite unmerged remote commits.

Supervisor and Activity Engine share telemetry channel by design.

Version History
Version	Changes
v2	Added rebase protection
v3	Standardized JSON schema + safe fallback logic

yaml
Copy code

---

# 📄 `workflow-deploy-dashboard.md`

```markdown
# Codex Workflow: Deploy Dashboard (v2)

Responsible for building and deploying the dashboard to the `gh-pages` branch.

This workflow ONLY runs when:

- Dashboard source files change in `main`, or
- It is triggered manually.

---

## Workflow File  
`/.github/workflows/deploy-codex-dashboard.yml`

---

## Purpose

1. Copy dashboard files from:
main → codex/dashboard/

css
Copy code
2. Deploy to:
gh-pages/dashboard/

yaml
Copy code
3. Preserve `codex-data.json` and telemetry folders.
4. Maintain stateless dashboard architecture.

---

## Deployment Sequence

1. Checkout `main`.
2. Create worktree for `gh-pages`.
3. Copy dashboard files.
4. Commit & push if changes exist.

---

## Version History

| Version | Changes |
|---------|---------|
| v1 | Initial deployment logic |
| **v2** | Part of Option A: dashboard rebuild only on main changes |

