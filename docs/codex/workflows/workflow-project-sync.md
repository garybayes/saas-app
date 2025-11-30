# Codex Workflow: Project Sync (v1)

Ensures that all NEW issues are automatically added to the Codex project board.

---

## Workflow File  
`/.github/workflows/codex-project-sync.yml`

---

## Purpose

1. Listen for new issue creation.
2. Add them automatically to the project.

This prevents the Activity Engine from needing to perform heavy sync work every run.

---

## Inputs

| Variable | Purpose |
|---------|---------|
| `CODEX_PROJECT_URL` | Required by `actions/add-to-project` |

---

## Version History

| Version | Changes |
|---------|---------|
| v1 | Initial release |
