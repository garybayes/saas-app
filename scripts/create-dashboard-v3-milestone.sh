#!/bin/bash

set -e

OWNER="garybayes"
REPO="saas-app"
TITLE="Dashboard V3"
DESCRIPTION="Next-generation telemetry dashboards + integrity monitoring + self-healing automation."

echo "🚀 Creating Dashboard V3 milestone..."

MILESTONE_JSON=$(gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/$OWNER/$REPO/milestones \
  -f title="$TITLE" \
  -f description="$DESCRIPTION")

MILESTONE_ID=$(echo "$MILESTONE_JSON" | jq -r ".number")

echo "$TITLE" > scripts/.dashboard_v3_milestone_title
echo "$MILESTONE_ID" > scripts/.dashboard_v3_milestone_id

echo "🎉 Milestone created: $TITLE (ID: $MILESTONE_ID)"
