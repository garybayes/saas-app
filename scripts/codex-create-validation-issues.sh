#!/usr/bin/env bash
set -euo pipefail

echo "=== Codex Validation Issue Creator ==="

REPO="garybayes/saas-app"

# ------------------------------------------------------------
# Load repository variables directly
# ------------------------------------------------------------
MAIN_MILESTONE=$(gh variable get CODEX_MAIN_MILESTONE   -R "$REPO" --json name,value | jq -r '.value')
DASH_MILESTONE=$(gh variable get CODEX_DASHBOARD_MILESTONE -R "$REPO" --json name,value | jq -r '.value')

PROJECT_URL=$(gh variable get CODEX_PROJECT_URL -R "$REPO" --json name,value | jq -r '.value')
PROJECT_NUMBER=$(gh variable get CODEX_PROJECT_NUMBER -R "$REPO" --json name,value | jq -r '.value')

echo "Loaded Variables:"
echo "  MAIN_MILESTONE      = $MAIN_MILESTONE"
echo "  DASH_MILESTONE      = $DASH_MILESTONE"
echo "  PROJECT_URL         = $PROJECT_URL"
echo "  PROJECT_NUMBER      = $PROJECT_NUMBER"
echo ""

# ------------------------------------------------------------
# Helper: Ensure milestone exists (create if missing)
# ------------------------------------------------------------
ensure_milestone() {
  local TITLE="$1"

  echo "Ensuring milestone exists: $TITLE"

  # Does milestone already exist?
  if gh api "repos/$REPO/milestones" --paginate --jq '.[] | .title' | grep -Fxq "$TITLE"; then
    echo "  ✓ Milestone already exists: $TITLE"
  else
    echo "  → Creating milestone: $TITLE"
    gh api \
      -X POST \
      -H "Accept: application/vnd.github+json" \
      "/repos/$REPO/milestones" \
      -f title="$TITLE" \
      -f state="open" >/dev/null

    echo "  ✓ Created milestone"
  fi
}

ensure_milestone "$MAIN_MILESTONE"
ensure_milestone "$DASH_MILESTONE"

# ------------------------------------------------------------
# Function to create an issue
# ------------------------------------------------------------
create_issue() {
  local TITLE="$1"
  local BODY="$2"
  local MILESTONE="$3"

  echo ""
  echo "→ Creating issue: $TITLE"

  ISSUE_URL=$(gh issue create \
    --repo "$REPO" \
    --title "$TITLE" \
    --body "$BODY" \
    --milestone "$MILESTONE")

  echo "  ✓ Issue created: $ISSUE_URL"

  # Add to project
  echo "  → Adding to project..."
  gh project item-add "$PROJECT_NUMBER" \
    --owner "garybayes" \
    --url "$ISSUE_URL" >/dev/null

  echo "  ✓ Added to project"
}

# ------------------------------------------------------------
# Sprint 4 Stabilization Issues (5)
# ------------------------------------------------------------
echo ""
echo "=== Creating Sprint 4 Stabilization Issues ==="

create_issue \
  "E2E: Login Route Coverage" \
  "Restore Playwright coverage for the login route and verify full authentication flow." \
  "$MAIN_MILESTONE"

create_issue \
  "E2E: Signup Flow Coverage" \
  "Restore Playwright tests for the signup route including validation cases." \
  "$MAIN_MILESTONE"

create_issue \
  "E2E: Dashboard Coverage" \
  "Rebuild Playwright tests covering dashboard rendering, data loading, and navigation." \
  "$MAIN_MILESTONE"

create_issue \
  "E2E: Connections Module Coverage" \
  "Restore E2E coverage for add/edit/delete connection flows." \
  "$MAIN_MILESTONE"

create_issue \
  "E2E: Workflow Setup Route Coverage" \
  "Restore missing E2E tests for workflow-setup route ensuring layout + action reliability." \
  "$MAIN_MILESTONE"

# ------------------------------------------------------------
# Dashboard Validation Issues (3)
# ------------------------------------------------------------
echo ""
echo "=== Creating Dashboard Validation Issues ==="

create_issue \
  "Dashboard: Add Last-Updated Timestamp" \
  "Display the telemetry file's updated_at field prominently at the top of the dashboard." \
  "$DASH_MILESTONE"

create_issue \
  "Dashboard: Refresh Indicator" \
  "Implement a subtle toast/banner when new telemetry data is detected." \
  "$DASH_MILESTONE"

create_issue \
  "Dashboard: Error Heatmap (Prototype)" \
  "Create a prototype of a 'quick glance' heatmap to visualize # of errors/day." \
  "$DASH_MILESTONE"

echo ""
echo "=== All validation issues created successfully ==="
