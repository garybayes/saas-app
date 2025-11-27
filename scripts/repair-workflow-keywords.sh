#!/usr/bin/env bash
set -e

echo "🔧 Repairing corrupted GitHub workflow keywords…"

for f in .github/workflows/*.yml; do
  echo "  → Fixing $f"

  # Fix "true:" → "on:" but only when it’s a key, not boolean
  sed -i 's/^true:$/on:/' "$f"

  # Fix "runs-true:" → "runs-on:"
  sed -i 's/runs-true:/runs-on:/' "$f"
done

echo "✅ Keyword repair complete."
