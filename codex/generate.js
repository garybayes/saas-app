/**
 * Codex Dashboard Generator (FINAL VERSION)
 * -----------------------------------------
 * Produces dashboard data + releases + metrics in:
 *   /codex-build/codex-data.json
 *   /codex-build/index.html
 *
 * - Safe to run locally (gh optional)
 * - Fully CI-compatible
 * - No dependence on codex-local
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BUILD_DIR = path.join(process.cwd(), "codex-build");
const DATA_FILE = path.join(BUILD_DIR, "codex-data.json");
const INDEX_FILE = path.join(BUILD_DIR, "index.html");

/* ------------------------------------------------
   Utility: Safe JSON loading
---------------------------------------------------- */
function loadJSON(filename, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(filename, "utf-8"));
  } catch (err) {
    return fallback;
  }
}

/* ------------------------------------------------
   Fetch Releases from GitHub CLI (if available)
---------------------------------------------------- */
function fetchReleases() {
  try {
    // Check if gh CLI exists
    execSync("gh --version", { stdio: "ignore" });

    console.log("📦 Fetching GitHub Releases...");
    const raw = execSync(
      "gh release list --limit 20 --json tagName,name,createdAt,body",
      { encoding: "utf-8" }
    );
    return JSON.parse(raw);
  } catch (err) {
    console.log("⚠️ Release fetch skipped (gh unavailable)", err.message);
    return [];
  }
}

/* ------------------------------------------------
   Ensure build directory exists
---------------------------------------------------- */
if (!fs.existsSync(BUILD_DIR)) {
  console.log("📁 Creating codex-build directory...");
  fs.mkdirSync(BUILD_DIR);
} else {
  console.log("📁 Using existing codex-build directory.");
}

/* ------------------------------------------------
   Base dashboard structure
---------------------------------------------------- */
let data = {
  generatedAt: new Date().toISOString(),
  releases: [],
  metrics: {},
};

/* ------------------------------------------------
   Import existing codex-data.json if present
---------------------------------------------------- */
if (fs.existsSync(DATA_FILE)) {
  console.log("🔄 Loading existing dashboard data...");
  const existing = loadJSON(DATA_FILE);
  data = { ...existing, ...data };
}

/* ------------------------------------------------
   Fetch Release Notes and attach to dashboard JSON
---------------------------------------------------- */
data.releases = fetchReleases();

/* ------------------------------------------------
   Write updated dashboard JSON
---------------------------------------------------- */
fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
console.log(`✅ Dashboard data written → ${DATA_FILE}`);

/* ------------------------------------------------
   Generate index.html (Dashboard Shell)
   Uses JS to load codex-data.json for UI rendering
---------------------------------------------------- */
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Codex Dashboard</title>
    <style>
      body {
        background: #121212;
        color: #eee;
        font-family: sans-serif;
        padding: 20px;
      }
      .panel {
        margin-bottom: 3rem;
      }
      .release-item {
        padding: 1rem 0;
      }
      .release-body {
        white-space: pre-wrap;
        background: #1e1e1e;
        padding: .75rem;
        border-radius: .5rem;
      }
      .release-date {
        font-size: .85rem;
        color: #aaa;
      }
    </style>
</head>
<body>
    <h1>Codex Dashboard</h1>
    <p>Generated at ${new Date().toLocaleString()}</p>

    <section class="panel">
      <h2>📦 Release Notes</h2>
      <div id="release-notes">Loading...</div>
    </section>

    <script>
      fetch("codex-data.json")
        .then(r => r.json())
        .then(data => {
          const container = document.getElementById("release-notes");

          if (!data.releases || data.releases.length === 0) {
            container.innerHTML = "<p>No releases found.</p>";
            return;
          }

          container.innerHTML = data.releases.map(r => \`
            <div class="release-item">
              <h3>\${r.name}</h3>
              <p class="release-date">\${new Date(r.createdAt).toLocaleString()}</p>
              <pre class="release-body">\${r.body || "(no release notes)"}</pre>
              <hr/>
            </div>
          \`).join("");
        });
    </script>

</body>
</html>
`;

fs.writeFileSync(INDEX_FILE, htmlTemplate);
console.log(`✅ Dashboard HTML written → ${INDEX_FILE}`);

console.log("\n🎉 Codex Dashboard generation complete!");
