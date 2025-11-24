#!/bin/bash

# ===========================================================
# Reset the Codex Dual-Track project board
# Moves all issues back to the "Todo" option
# Works with GitHub Projects V2 (GraphQL API)
# ===========================================================

PROJECT_ID="PVT_kwHODgSGMM4BI6BO"
STATUS_FIELD_ID="PVTSSF_lAHODgSGMM4BI6BOzg5OjrU"
TODO_OPTION_ID="f75ad846"

echo "🔄 Resetting project board for $PROJECT_ID"
echo "📌 Status field: $STATUS_FIELD_ID"
echo "📌 Todo option: $TODO_OPTION_ID"
echo ""

# 1. Fetch ALL project items (up to 100 — GitHub limit)
ITEMS=$(gh api graphql -f query="
{
  node(id: \"$PROJECT_ID\") {
    ... on ProjectV2 {
      items(first: 100) {
        nodes {
          id
          content {
            ... on Issue {
              number
            }
          }
        }
      }
    }
  }
}
")

# 2. Loop over all project items
echo "$ITEMS" | jq -c ".data.node.items.nodes[]" | while read -r ITEM; do
  ITEM_ID=$(echo "$ITEM" | jq -r '.id')
  ISSUE_NUMBER=$(echo "$ITEM" | jq -r '.content.number')

  # Skip null content (non-issue items)
  if [[ "$ISSUE_NUMBER" == "null" ]]; then
    continue
  fi

  echo "➡️ Moving Issue #$ISSUE_NUMBER → Todo"

  # Update the Status field for this item
  gh api graphql -f query="
    mutation {
      updateProjectV2ItemFieldValue(
        input: {
          projectId: \"$PROJECT_ID\"
          itemId: \"$ITEM_ID\"
          fieldId: \"$STATUS_FIELD_ID\"
          value: { singleSelectOptionId: \"$TODO_OPTION_ID\" }
        }
      ) {
        projectV2Item {
          id
        }
      }
    }
  " >/dev/null
done

echo ""
echo "✅ Reset Complete — All issues set to Todo"
