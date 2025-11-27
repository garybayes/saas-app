#!/usr/bin/env bash
set -euo pipefail

WORKFLOW_DIR=".github/workflows"

echo "🔧 Auto-Fixing GitHub Workflows in $WORKFLOW_DIR"
echo "------------------------------------------------"

# Ensure directory exists
if [[ ! -d "$WORKFLOW_DIR" ]]; then
  echo "❌ Workflow directory not found."
  exit 1
fi

# Iterate over YAML workflows
for file in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
  [[ -e "$file" ]] || continue

  echo "⚙️ Processing: $file"

  # Backup original
  cp "$file" "$file.bak"

  # 1. Add missing document start '---'
  if ! grep -q "^---" "$file"; then
    sed -i '1s/^/---\n/' "$file"
    echo "  ✓ Added '---' header"
  fi

  # 2. Fix truthy warnings ("yes", "no", "on") → ("true", "false")
  sed -i \
    -e 's/\byes\b/true/g' \
    -e 's/\bno\b/false/g' \
    -e 's/\bon\b/true/g' \
    "$file"

  # 3. Fix heredoc indent blocks by rewriting <<EOF blocks flush-left
  # Handles EOF, GRAPHQL, JSON, DATA, etc.
  awk '
    BEGIN { in_heredoc = 0; tag = "" }
    {
      if (in_heredoc == 0) {
        # Detect start of heredoc
        if ($0 ~ /<<[A-Za-z0-9_]+$/) {
          match($0, /<<([A-Za-z0-9_]+)$/, m)
          tag = m[1]
          print $0
          in_heredoc = 1
        } else {
          print $0
        }
      } else {
        # Inside heredoc: write lines without leading indentation
        sub(/^[ \t]+/, "")

        # Detect terminator
        if ($0 == tag) {
          print $0
          in_heredoc = 0
        } else {
          print $0
        }
      }
    }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"

  echo "  ✓ Heredoc normalization complete"

done

echo "------------------------------------------------"
echo "🧹 Running YAML Lint…"

if command -v yamllint >/dev/null 2>&1; then
  yamllint .github/workflows || true
else
  echo "⚠️ yamllint not installed — run: npm install -D yamllint"
fi

echo "------------------------------------------------"
echo "🎉 Auto-fix completed. Backup files: *.bak"
