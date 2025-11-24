#!/bin/bash

echo "🔧 Creating issues for the Codex Dual-Track Development project..."
echo ""

create_issue() {
  local TITLE="$1"
  local BODY="$2"
  local MILESTONE="$3"

  echo "📝 Creating issue: $TITLE"

  ISSUE_URL=$(gh issue create \
    --title "$TITLE" \
    --body "$BODY" \
    --milestone "$MILESTONE" \
    --web=false 2>&1)

  # Extract the URL from output
  ISSUE_URL=$(echo "$ISSUE_URL" | grep -o "https://github.com[^ ]*")

  echo "   ✔ Created: $ISSUE_URL"
  echo ""
}

SPRINT_MILESTONE="Sprint 5 Completion"

create_issue "Fix drag-and-drop node placement" "Part of Workflow Builder V1 finalization." "$SPRINT_MILESTONE"
create_issue "Implement connector line rendering" "Ensure correct visual connection between nodes." "$SPRINT_MILESTONE"
create_issue "Validate workflow JSON schema" "Add backend schema validation for workflows." "$SPRINT_MILESTONE"
create_issue "Implement SAVE workflow endpoint" "Create database persistence with validation." "$SPRINT_MILESTONE"
create_issue "Implement LOAD workflow endpoint" "Support retrieving workflows by ID and user." "$SPRINT_MILESTONE"
create_issue "Add workflow integration tests" "Test all workflow-related API routes." "$SPRINT_MILESTONE"
create_issue "Fix Prisma migration chain" "Resolve schema drift between Sprint 4 → Sprint 5." "$SPRINT_MILESTONE"
create_issue "Rewrite seed script for Sprint 5" "Ensure correct workflow starter data." "$SPRINT_MILESTONE"
create_issue "Rebuild unit tests for Sprint 5" "Replace deleted tests with updated versions." "$SPRINT_MILESTONE"
create_issue "Rebuild Playwright suite" "Add login, dashboard, theme, workflow tests." "$SPRINT_MILESTONE"
create_issue "Fix Playwright flakiness" "Add proper waits, adjust timeouts." "$SPRINT_MILESTONE"
create_issue "Stabilize CI Pipeline" "Fix CI failures and ensure clean builds." "$SPRINT_MILESTONE"

DASHBOARD_MILESTONE="Codex Dashboard V2"

create_issue "Redesign dashboard layout" "Two-column desktop / single-column mobile layout." "$DASHBOARD_MILESTONE"
create_issue "Add mobile sidebar navigation" "Off-canvas menu for smaller screens." "$DASHBOARD_MILESTONE"
create_issue "Add mobile-friendly tab navigation" "Swipe/tap for chart & panel switching." "$DASHBOARD_MILESTONE"
create_issue "Implement touch-friendly charts" "ECharts/Chart.js touch handlers." "$DASHBOARD_MILESTONE"
create_issue "Add commit timeline chart" "Visualize commit history chronologically." "$DASHBOARD_MILESTONE"
create_issue "Add workflow duration trend chart" "Track CI pipeline durations over time." "$DASHBOARD_MILESTONE"
create_issue "Add test pass/fail bar chart" "Track test stability across days." "$DASHBOARD_MILESTONE"
create_issue "Add error heatmap" "Show frequency of CI errors by category and day." "$DASHBOARD_MILESTONE"
create_issue "Add branch comparison view" "Compare CI stability across branches." "$DASHBOARD_MILESTONE"
create_issue "Add PR history panel" "List PRs with status and commit metadata." "$DASHBOARD_MILESTONE"
create_issue "Split Codex data into modular JSON files" "Create metrics/commits.json, tests.json, etc." "$DASHBOARD_MILESTONE"
create_issue "Enable lazy-loading of charts" "Improve performance, especially on mobile." "$DASHBOARD_MILESTONE"
create_issue "Compress and minify dashboard data" "Minify or gzip JSON data." "$DASHBOARD_MILESTONE"
create_issue "Add last-updated timestamp" "Show freshness of dashboard data." "$DASHBOARD_MILESTONE"

echo "🎉 All issues created successfully!"
