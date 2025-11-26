#!/bin/bash

set -e

OWNER="garybayes"
REPO="saas-app"
PROJECT_ID="PVT_kwHODgSGMM4BI6BO"   # Codex Dual-Track Development

echo "📦 Adding Dashboard V3 issues to project: $PROJECT_ID"
echo ""

ISSUE_NUMBERS=$(gh issue list \
  --repo "$OWNER/$REPO" \
  --milestone "Dashboard V3" \
  --state open \
  --json number \
  --jq '.[].number')

for NUM in $ISSUE_NUMBERS; do
  echo "→ Processing issue #$NUM"

  ISSUE_NODE=$(gh api graphql -f query='
    query($repo: String!, $owner: String!, $num: Int!) {
      repository(name: $repo, owner: $owner) {
        issue(number: $num) { id }
      }
    }' \
    -F owner="$OWNER" \
    -F repo="$REPO" \
    -F num="$NUM" \
    --jq '.data.repository.issue.id')

  echo "   Node: $ISSUE_NODE"

  gh api graphql -f query='
    mutation($project: ID!, $item: ID!) {
      addProjectV2ItemById(input: {projectId: $project, contentId: $item}) {
        item { id }
      }
    }
  ' -F project="$PROJECT_ID" -F item="$ISSUE_NODE" >/dev/null

  echo "   Added to project"
  echo ""
done

echo "🎉 All Dashboard V3 issues added to project."
