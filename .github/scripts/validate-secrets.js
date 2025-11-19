/**
 * Validate GitHub Repository Secrets
 *
 * This script ensures that all required secrets exist in GitHub Actions.
 * If any are missing, the CI build fails with a clear error message.
 */

const REQUIRED_SECRETS = [
  "AUTH_SECRET",
  "AUTH_SALT",
  "DATABASE_URL",
  "ENCRYPTION_KEY",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "JWT_SECRET",
  "GH_TOKEN"
];

async function main() {
  console.log("🔍 Validating GitHub repository secrets...\n");

  const missing = [];

  for (const key of REQUIRED_SECRETS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Missing required secrets:\n");
    for (const key of missing) {
      console.error("   - " + key);
    }
    console.error(
      "\n💡 Add these secrets at:\n  Settings → Secrets and variables → Actions\n"
    );
    process.exit(1);
  }

  console.log("✅ All required secrets found.");
}

main().catch((err) => {
  console.error("❌ Validator error:", err);
  process.exit(1);
});
