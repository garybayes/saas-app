#!/usr/bin/env bash
set -euo pipefail

###############################################
# Token Resolution (Option D)
###############################################

GH_TOKEN="$(gh auth token 2>/dev/null || true)"
GH_TOKEN="${GH_TOKEN:-${GH_TOKEN:-}}"
GH_TOKEN="${GH_TOKEN:-${GH_CI_PAT:-}}"

if [[ -z "$GH_TOKEN" ]]; then
  echo "ERROR: No authentication token available."
  exit 1
fi

export GH_TOKEN

###############################################
# Repo Resolution
###############################################

REPO_ENV="${GITHUB_REPOSITORY:-}"

if [[ -n "$REPO_ENV" ]]; then
  OWNER="${REPO_ENV%/*}"
  REPO="${REPO_ENV#*/}"
else
  if git remote get-url origin >/dev/null 2>&1; then
    url=$(git remote get-url origin)
    OWNER=$(echo "$url" | sed -E 's/.*github.com[:\/]([^\/]+)\/.*/\1/')
    REPO=$(echo "$url" | sed -E 's/.*github.com[:\/][^\/]+\/([^\.]+).*/\1/')
  fi

  if [[ -z "${OWNER:-}" || -z "${REPO:-}" ]]; then
    if [[ $# -ne 2 ]]; then
      echo "Usage:"
      echo "  ./scripts/codex-patch-selftest-labels.sh owner repo"
      exit 1
    fi
    OWNER="$1"
    REPO="$2"
  fi
fi

echo "Patching codex-selftest labels in $OWNER/$REPO…"

###############################################
# Fetch ALL issues for milestone 6 via REST API
###############################################

MS_ID=6

mapfile -t all_issues < <(
  gh api \
    -H "Accept: application/vnd.github+json" \
    "/repos/$OWNER/$REPO/issues?milestone=$MS_ID&state=all&per_page=100" \
    --paginate \
    --jq '.[].number'
)

echo "Total issues in milestone: ${#all_issues[@]}"

###############################################
# Apply Labels Safely
###############################################

for n in "${all_issues[@]}"; do
  echo "Adding codex-selftest to #$n"

  gh api \
    -X PATCH \
    -H "Accept: application/vnd.github+json" \
    "/repos/$OWNER/$REPO/issues/$n" \
    --raw-field labels[]=codex \
    --raw-field labels[]=codex-selftest \
    >/dev/null
done

echo "Patch complete."
