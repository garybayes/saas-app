🧱 Contributing Guidelines

For the SaaS-App Project (Better Value Business Services Inc.)

🧭 Purpose

This document defines how to contribute changes, manage sprint branches, and tag stable builds.
It ensures Codex, Jules, and Gary G. Bayes work from a unified, reproducible baseline for each sprint.

📂 1. Branching Conventions
Branch Type	Example	Purpose
Main (default)	main	Production-ready code. Only tested, tagged releases are merged here.
Sprint Development	sprint-5-development	Active sprint branch where Codex or Jules commits in-progress work.
Sprint Stable	sprint-5-stable	Feature-complete, fully tested version of a sprint before merge to main.
Rebuild / Fix Branch	sprint-5-rebuild or hotfix/sprint-5	Used for Codex regenerations or post-release patches.

Workflow summary:

sprint-X-development  →  sprint-X-stable  →  main
             ↘ rebuild/fix branches as needed

🧩 2. Tagging Policy
Tag	Meaning	Example
vX.Y.0-baseline	Clean environment snapshot before Codex rebuild.	v4.5.0-baseline
vX.Y.0-codex-verified	Sprint successfully rebuilt, tested, and merged.	v5.0.0-codex-verified
vX.Y.Z	Incremental patches or hotfixes.	v5.0.1

Always push tags after verification:

git tag -a v5.0.0-codex-verified -m "Sprint 5 regeneration verified"
git push origin v5.0.0-codex-verified

🧱 3. Commit Message Format

Follow the Conventional Commits standard:

Prefix	Usage Example	When to Use
feat:	feat: add workflow builder API	New feature or major addition
fix:	fix: resolve Prisma client import error	Bug fix or patch
refactor:	refactor: clean up theme toggle logic	Internal code improvement
docs:	docs: update WSL setup guide	Documentation change only
test:	test: add Playwright test for workflow CRUD	Adding or modifying tests
chore:	chore: upgrade dependencies	Non-functional change

Each commit message should be concise (≤ 72 chars in the first line) and, if needed, followed by a detailed description.

🧠 4. Pull Request Requirements

All pull requests must:

Be created from a sprint-development or rebuild branch.

Include the auto-loaded Pull Request Template (.github/pull_request_template.md).

Reference the relevant sprint issue (e.g., “Closes #12”).

Pass all automated checks.

✅ 5. Pre-Merge Checklist

Before merging into main or a -stable branch:

 npm install completes without warnings.

 npx prisma migrate reset runs successfully and seeds demo data.

 npx tsc --noEmit shows 0 errors.

 npx playwright test passes all tests.

 No sensitive information (NEXTAUTH_SECRET, API keys, etc.) in commits.

 README.md and /doc updated with relevant instructions.

 Version tag created and pushed.

🔐 6. Security and Secrets

Never commit .env or .env.local.

Always store example variables in .env.example.

Use environment-based encryption for API keys (crypto.ts).

Run npm audit after each dependency change.

📘 7. Documentation and Versioning

All environment or deployment notes must live in /doc/.
Each major sprint should include:

Sprint_X_Specification.docx

Sprint_X_Validation_Checklist.docx

WSL_Setup_for_Codex_Rebuild.md (if applicable)

🔄 8. Workflow Summary Diagram
[Sprint-X-Development]
          |
          |  (Code, Test, Validate)
          v
 [Sprint-X-Stable]
          |
          |  (Tag vX.Y.0-codex-verified)
          v
          main

🧩 9. How to Start a New Sprint

When Codex or Jules begins the next sprint:

git checkout sprint-4-stable
git pull
git checkout -b sprint-5-development


After completion:

git tag -a v5.0.0-codex-verified -m "Sprint 5 complete"
git push origin sprint-5-stable --tags

👥 10. Contributors

Gary G. Bayes, BABA, MBA — Project Owner & Architect

Codex — AI Development Assistant (Sprint Rebuilds)

Jules — Developer & Tester

End of Document
