#!/bin/bash

# ============================================================
# Create Dashboard V3 Issues
# Existing milestone: "Dashboard V3"
# Project: "Codex Dual-Track Development"
# Assignee: garybayes
# GH CLI compatible with your environment
# ============================================================

MILESTONE_TITLE="Dashboard V3"
PROJECT_TITLE="Codex Dual-Track Development"
ASSIGNEE="garybayes"

echo "📌 Using Milestone: $MILESTONE_TITLE"
echo "📌 Using Project: $PROJECT_TITLE"
echo ""

create_issue() {
  local TITLE="$1"
  local BODY="$2"

  echo "📝 Creating issue: $TITLE"

  ISSUE_URL=$(gh issue create \
    --title "$TITLE" \
    --body "$BODY" \
    --milestone "$MILESTONE_TITLE" \
    --assignee "$ASSIGNEE" \
    --project "$PROJECT_TITLE")

  if [[ $? -ne 0 ]]; then
    echo "❌ Failed to create issue: $TITLE"
  else
    echo "   ✔ Created: $ISSUE_URL"
  fi

  echo ""
}

# ============================================================
# DASHBOARD V3 ISSUES
# These are your new enhancement tasks
# ============================================================

create_issue \
  "Dashboard V3: Telemetry Visualization Layer" \
  "Implement advanced telemetry charts including request timing, internal Codex execution stats, and workflow event heatmaps."

create_issue \
  "Dashboard V3: Codex Integrity Monitor" \
  "Create a module that reports Codex automation failures, access token issues, and project sync inconsistencies."

create_issue \
  "Dashboard V3: Self-Healing Fallback Routines" \
  "Add automatic repair routines to detect broken workflows, missing dashboard files, or stalled PR chains."

create_issue \
  "Dashboard V3: Data Reliability Score" \
  "Compute and visualize a score representing dashboard freshness, self-test pass rate, and Codex uptime."

create_issue \
  "Dashboard V3: Historical Telemetry Timeline" \
  "Implement timeline graphs showing Codex activity, self-test events, and automated PR cycles."

echo "🎉 All Dashboard V3 issues created!"
