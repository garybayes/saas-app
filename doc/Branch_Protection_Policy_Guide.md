🛡️ Branch Protection Policy Guide
SaaS-App Project — GitHub Workflow Governance
🧭 Purpose

This guide ensures all merges into production or stable branches meet the required review, test, and security standards.
It enforces quality control for Codex, Jules, and Gary G. Bayes through GitHub’s built-in branch protection rules.

🧱 1. Protected Branches

You’ll apply these rules to:

main

sprint-*-stable (e.g., sprint-5-stable, sprint-6-stable)

Optional: add to sprint-*-rebuild if Codex will handle PRs from those branches.

⚙️ 2. How to Configure in GitHub
Step 1 — Go to Repository Settings

Open your repository on GitHub.

Click Settings → Branches.

Under “Branch protection rules”, click Add rule.

Step 2 — Define Rule Target

Branch name pattern:

For main:

main


For all stable branches:

sprint-*-stable

Step 3 — Enable Protection Options

Check the following boxes:

Option	Description
✅ Require a pull request before merging	Prevents direct commits to protected branches.
✅ Require approvals	Enforces peer review.
✅ Require review from Code Owners	Ensures @garybayes must approve merges affecting owned files.
✅ Dismiss stale pull request approvals when new commits are pushed	Forces re-review after major updates.
✅ Require status checks to pass before merging	Prevents merging if tests fail.
✅ Require branches to be up to date before merging	Forces PR branches to rebase or merge main before approval.
✅ Include administrators	Ensures even admins (you) follow the same rules.
Step 4 — Set Required Status Checks

Under “Require status checks to pass before merging”, add:

Playwright E2E Tests
TypeScript Compile Check
Prisma Migration Validation


These map to your GitHub Actions workflows once you integrate CI (Codex can set these up automatically).

Step 5 — Save Changes

Click Create or Save changes.

🧩 3. Recommended Workflow Enforcement
Rule	Applies To	Result
Require PR approval	main, all sprint-*-stable	Codex or Jules cannot merge without your review.
Require passing tests	All	CI (Playwright + TypeScript) must pass before merge.
Require up-to-date branch	main	Prevents stale merges.
Require signed commits (optional)	main	Adds cryptographic signature validation.
🧰 4. Optional Enhancements

Require linear history:
Keeps a clean, rebased commit history — no merge bubbles.

Restrict who can push to matching branches:
Allow only you (@garybayes) and trusted bots like Codex.
In the rule:

“Restrict who can push to matching branches” → add your username.

Enable “Require conversation resolution”:
All PR comments must be resolved before merging.

🧪 5. Validation

After saving, test the rule:

Have Codex open a PR from sprint-5-rebuild → sprint-5-stable.

Confirm:

“Merge” button is disabled until you approve.

Status checks must show green before merging.

GitHub automatically requests your review via CODEOWNERS.

🧩 6. Example Configuration Summary
Setting	main	sprint-*-stable
Require PR	✅	✅
Require code owner review	✅	✅
Require status checks	✅	✅
Require up-to-date branch	✅	✅
Dismiss stale approvals	✅	✅
Include administrators	✅	✅
🧠 7. Notes

Codex and Jules can still push freely to development or rebuild branches.

Only you (Gary) can approve merges into stable or production branches.

If CI/CD integration is added later, Codex can configure GitHub Actions for:

playwright.yml

typescript-check.yml

prisma-validate.yml

✅ 8. Result

Once this policy is applied:

Every production merge will be type-checked, tested, and reviewed.

GitHub will automatically request your approval through CODEOWNERS.

Codex’s future regenerations (Sprint 5+) will remain version-safe and auditable.

End of Document
