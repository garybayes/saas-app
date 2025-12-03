#!/usr/bin/env bash
set -euo pipefail

REPO="garybayes/saas-app"
TARGET_MILESTONE="Codex Internal"

echo "=============================================="
echo " Codex Issue State Repair"
echo " Phase A: Remove 'codex' label from issues with a milestone"
echo " Phase B: Add '$TARGET_MILESTONE' milestone to remaining codex issues"
echo "=============================================="
echo

# ------------------------------------------------------------------------------------
# Helper: Ask yes/no
# ------------------------------------------------------------------------------------
ask() {
  read -rp "$1 (y/n): " ans
  [[ "$ans" == "y" || "$ans" == "Y" ]]
}

# ------------------------------------------------------------------------------------
# Fetch ALL issues (open + closed) with pagination
# ------------------------------------------------------------------------------------
echo "Fetching complete issue list from GitHub..."

all_issues=$(gh api \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO/issues?state=all&per_page=100" \
  --paginate)

echo "Total issues fetched: $(echo "$all_issues" | jq length)"
echo

# ====================================================================================
# PHASE A — REMOVE 'codex' LABEL FROM ALL ISSUES THAT HAVE A MILESTONE
# ====================================================================================
echo "----------------------------------------------"
echo "Phase A: Remove 'codex' label from issues WITH a milestone"
echo "----------------------------------------------"

issues_with_codex_and_milestone=$(echo "$all_issues" | jq -r '
  map(select((.labels | any(.name=="codex")) and (.milestone != null))) | .[]
')

countA=$(echo "$issues_with_codex_and_milestone" | jq -s length)
echo "Issues with milestone + codex label: $countA"

if (( countA == 0 )); then
  echo "Nothing to clean in Phase A."
else
  if ask "Proceed with removing 'codex' label from $countA issues?"; then
    echo "$issues_with_codex_and_milestone" | jq -r '.number' | while read -r num; do
      echo "→ Removing 'codex' from issue #$num"
      gh issue edit "$num" --repo "$REPO" --remove-label "codex"
      sleep 0.5
    done
  else
    echo "Skipping Phase A."
  fi
fi

echo
echo "Phase A complete."
echo

# ====================================================================================
# PHASE B — ADD 'Codex Internal' MILESTONE TO REMAINING CODEX-LABELED ISSUES
# ====================================================================================
echo "----------------------------------------------"
echo "Phase B: Label codex issues with '$TARGET_MILESTONE'"
echo "----------------------------------------------"

echo "Checking if milestone '$TARGET_MILESTONE' exists..."
milestone_exists=$(gh api "/repos/$REPO/milestones" --jq "
  any(.[]; .title == \"$TARGET_MILESTONE\")
")

if [[ "$milestone_exists" != "true" ]]; then
  echo "Milestone missing → creating."
  gh api \
    -X POST \
    -f title="$TARGET_MILESTONE" \
    -f state=open \
    "/repos/$REPO/milestones" >/dev/null
  echo "Created milestone '$TARGET_MILESTONE'."
else
  echo "Milestone exists."
fi
echo

remaining_codex=$(echo "$all_issues" | jq -r '
  map(select((.labels | any(.name=="codex")) and (.milestone == null))) | .[]
')

countB=$(echo "$remaining_codex" | jq -s length)
echo "Codex-generated issues with NO milestone: $countB"

if (( countB > 0 )) && ask "Proceed with applying '$TARGET_MILESTONE' to $countB issues?"; then
  echo "$remaining_codex" | jq -r '.number' | while read -r num; do
    echo "→ Applying milestone '$TARGET_MILESTONE' to issue #$num"
    gh issue edit "$num" --repo "$REPO" --milestone "$TARGET_MILESTONE"
    sleep 0.5
  done
else
  echo "Skipping Phase B."
fi

echo
echo "Phase B complete."
