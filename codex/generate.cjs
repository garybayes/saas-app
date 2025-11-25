// codex/generate.cjs
/**
 * Codex Dashboard Generator (Interactive Version)
 *
 * Responsibilities:
 *  - Build codex-data.json (including self-test telemetry)
 *  - Copy dashboard templates into codex-build/ (index.html + dashboard.js)
 *
 * This runs via:  npm run codex:build
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const BUILD_DIR = path.join(ROOT_DIR, "codex-build");
const OUTPUT_FILE = path.join(BUILD_DIR, "codex-data.json");

// Where codex-self-test drops its latest run (if present)
const SELFTEST_SOURCE = path.join(ROOT_DIR, "codex-selftest", "latest.json");
// Where the dashboard can also read raw telemetry directly
const SELFTEST_TARGET = path.join(BUILD_DIR, "selftest.json");

// Template locations
const TEMPLATE_DIR = path.join(ROOT_DIR, "codex", "templates");
const TEMPLATE_INDEX = path.join(TEMPLATE_DIR, "index.html");
const TEMPLATE_JS = path.join(TEMPLATE_DIR, "dashboard.js");

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// -----------------------------------------
// 1. Load existing codex-data (for history)
// -----------------------------------------
let codexData = {};

if (fs.existsSync(OUTPUT_FILE)) {
  try {
    codexData = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
  } catch (err) {
    console.warn("⚠️ Failed to parse existing codex-data.json, starting fresh.", err);
    codexData = {};
  }
}

// Make sure we always have a meta block
if (!codexData.meta) {
  codexData.meta = {};
}

codexData.meta.lastBuild = new Date().toISOString();
codexData.meta.version = (codexData.meta.version || 0) + 1;
codexData.meta.source = "codex-generate.cjs";

// -----------------------------------------
// 2. Load Codex self-test telemetry (optional)
// -----------------------------------------
let telemetry = {
  last_run: null,
  last_status: "unknown",
  last_issue: null,
  last_pr: null,
  history: [],
  stats: {
    total_runs: 0,
    success_rate: 0,
    failures: 0,
    average_duration: null,
  },
};

let latestSelftest = null;

if (fs.existsSync(SELFTEST_SOURCE)) {
  try {
    const raw = fs.readFileSync(SELFTEST_SOURCE, "utf8");
    latestSelftest = JSON.parse(raw);

    // Also copy to BUILD_DIR so the dashboard can read it directly if needed
    fs.writeFileSync(SELFTEST_TARGET, raw);

    console.log("✅ Loaded self-test telemetry from codex-selftest/latest.json");
  } catch (err) {
    console.warn("⚠️ Failed to parse self-test telemetry. Skipping.", err);
  }
}

// Seed from existing telemetry if present
if (codexData.telemetry && Array.isArray(codexData.telemetry.history)) {
  telemetry.history = codexData.telemetry.history;
}

// If we have a new self-test run, prepend it to history
if (latestSelftest && latestSelftest.timestamp) {
  // Avoid duplicating the exact same record at the head
  const alreadyHead =
    telemetry.history.length > 0 &&
    telemetry.history[0].timestamp === latestSelftest.timestamp;

  if (!alreadyHead) {
    telemetry.history.unshift({
      timestamp: latestSelftest.timestamp,
      status: latestSelftest.status || "unknown",
      duration_seconds:
        typeof latestSelftest.duration_seconds === "number"
          ? latestSelftest.duration_seconds
          : null,
      issue: latestSelftest.issue || null,
      pr: latestSelftest.pr || null,
    });
  }
}

// Trim history to last 30 records
telemetry.history = telemetry.history.slice(0, 30);

// Compute stats from history
if (telemetry.history.length > 0) {
  const successes = telemetry.history.filter(
    (h) => h.status && h.status.toLowerCase() === "success"
  ).length;

  const failures = telemetry.history.length - successes;

  const durations = telemetry.history
    .map((h) => h.duration_seconds)
    .filter((n) => typeof n === "number" && n > 0);

  const avg =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null;

  telemetry.stats = {
    total_runs: telemetry.history.length,
    success_rate: telemetry.history.length
      ? successes / telemetry.history.length
      : 0,
    failures,
    average_duration: avg,
  };

  const latest = telemetry.history[0];
  telemetry.last_run = latest.timestamp;
  telemetry.last_status = latest.status;
  telemetry.last_issue = latest.issue;
  telemetry.last_pr = latest.pr;
}

// Attach telemetry to codexData
codexData.telemetry = telemetry;

// -----------------------------------------
// 3. Write codex-data.json
// -----------------------------------------
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(codexData, null, 2));
console.log("✅ Wrote codex-build/codex-data.json");

// -----------------------------------------
// 4. Copy dashboard templates into build dir
// -----------------------------------------
if (!fs.existsSync(TEMPLATE_INDEX) || !fs.existsSync(TEMPLATE_JS)) {
  console.warn(
    "⚠️ Dashboard templates not found. Expected:",
    TEMPLATE_INDEX,
    "and",
    TEMPLATE_JS
  );
} else {
  fs.copyFileSync(TEMPLATE_INDEX, path.join(BUILD_DIR, "index.html"));
  fs.copyFileSync(TEMPLATE_JS, path.join(BUILD_DIR, "dashboard.js"));
  console.log("✅ Copied dashboard templates into codex-build/");
}

console.log("🎉 Codex Dashboard generated with interactive UI + telemetry");
