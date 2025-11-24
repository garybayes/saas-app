#!/bin/bash

# Set the ProjectV2 Status for a GitHub Issue
# Usage: ./scripts/set-project-status.sh <issue-number> <todo|inprogress|done>

PROJECT_ID="PVT_kwHODgSGMM4BI6BO"
STATUS_FIELD_ID="PVTSSF_lAHODgSGMM4BI6BOzg5OjrU"

TODO="f75ad846"
IN_PROGRESS="47fc9ee4"
DONE="98236657"

ISSUE_NUMBER="$1"
STATUS="$2"

if [[ -z "$ISSUE_NUMBER" || -z "$STATUS" ]]; then
  echo "Usage: set-project-status.sh <issue-number> <todo|inprogress|done>"
  exit 1
fi

case "$STATUS" in
  todo) OPTION_ID="$TODO" ;;
  inprogress) OPTION_ID="$IN_PROGRESS" ;;
  done) OPTION_ID="$DONE" ;;
  *) echo "Invalid status: $STATUS"; exit 1 ;;
esac

echo "🔄 Updating issue #$ISSUE_NUMBER → $STATUS"

# Find the project item for this issue
ITEM_ID=$(gh api graphql -f query="
{
  repository(owner:\"garybayes\", name:\"saas-app\") {
    issue(number:$ISSUE_NUMBER) {
      projectItems(first:10) {
        nodes { id }
      }
    }
  }
}
" --jq ".data.repository.issue.projectItems.nodes[0].id")

if [[ "$ITEM_ID" == "null" || -z "$ITEM_ID" ]]; then
  echo "❌ Issue #$ISSUE_NUMBER is not attached to the project."
  exit 0
fi

# Update the Status field for that item
gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: \"$PROJECT_ID\"
      itemId: \"$ITEM_ID\"
      fieldId: \"$STATUS_FIELD_ID\"
      value: { singleSelectOptionId: \"$OPTION_ID\" }
    }
  ) {
    projectV2Item { id }
  }
}
" >/dev/null

echo "✅ Successfully updated #$ISSUE_NUMBER → $STATUS"
