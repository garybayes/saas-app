#!/usr/bin/env bash
set -euo pipefail

# Final Codex workflow order (Diagnostics first)
WORKFLOWS=(
  "codex-diagnostics.yml"
  "codex-self-test.yml"
  "codex-cleaner-selftest.yml"
  "codex-project-sync.yml"
  "codex-supervisor.yml"
  "codex-activity-engine.yml"
  "codex-telemetry-merge.yml"
)

# Ensure gh is authenticated
if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated. Run: gh auth login"
  exit 1
fi

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

echo "Running Codex pipeline against: $REPO"
echo "------------------------------------------------------------------"

start_workflow() {
  wf_file="$1"

  echo "▶ Starting workflow: $wf_file"

  # Trigger the run
  gh workflow run "$wf_file" --repo "$REPO" --ref main >/dev/null

  # Wait briefly for the run to register
  sleep 3

  # Fetch most recent run for that workflow
  run_id=$(
    gh run list \
      --repo "$REPO" \
      --workflow "$wf_file" \
      --limit 1 \
      --json databaseId \
      -q '.[0].databaseId'
  )

  if [ -z "$run_id" ] || [ "$run_id" = "null" ]; then
    echo "❌ ERROR: Could not determine run ID for $wf_file"
    exit 1
  fi

  echo "⏳ Waiting for run ID $run_id to complete..."

  gh run watch "$run_id" --repo "$REPO" --exit-status
  status=$?

  if [ $status -eq 0 ]; then
    echo "✔ Workflow $wf_file completed successfully"
  else
    echo "⚠ Workflow $wf_file finished with warnings or soft errors"
  fi

  echo "------------------------------------------------------------------"
}

# Run each workflow in sequence
for wf in "${WORKFLOWS[@]}"; do
  start_workflow "$wf"
done

echo "🎉 Codex pipeline complete. All workflows executed."
