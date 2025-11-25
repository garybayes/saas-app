/**
 * Codex Dashboard Generator
 * Adds Codex self-test telemetry support
 */

const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "..", "codex-build");
const OUTPUT_FILE = path.join(BUILD_DIR, "codex-data.json");
const SELFTEST_FILE = path.join(BUILD_DIR, "selftest.json");

if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR);
}

// -----------------------------------------
// Load existing dashboard data if present
// -----------------------------------------
let codexData = {};
if (fs.existsSync(OUTPUT_FILE)) {
  codexData = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
}

// -----------------------------------------
// Load Codex self-test telemetry
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
    average_duration: null
  }
};

if (fs.existsSync(SELFTEST_FILE)) {
  const latest = JSON.parse(fs.readFileSync(SELFTEST_FILE, "utf8"));

  // Ensure history array exists
  if (!codexData.telemetry || !codexData.telemetry.history) {
    codexData.telemetry = telemetry;
  }

  // Build history list
  let history = codexData.telemetry.history || [];

  // Add newest record
  history.unshift({
    timestamp: latest.timestamp,
    status: latest.status,
    duration_seconds: latest.duration_seconds,
    issue: latest.issue,
    pr: latest.pr
  });

  // Keep only last 30
  history = history.slice(0, 30);

  // Compute stats
  const successes = history.filter(h => h.status === "success").length;
  const failures = history.filter(h => h.status !== "success").length;
  const durations = history.map(h => h.duration_seconds).filter(n => n > 0);

  const avg = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : null;

  codexData.telemetry = {
    last_run: latest.timestamp,
    last_status: latest.status,
    last_issue: latest.issue,
    last_pr: latest.pr,
    history,
    stats: {
      total_runs: history.length,
      success_rate: successes / history.length,
      failures,
      average_duration: avg
    }
  };
}

// -----------------------------------------
// Write final dashboard data
// -----------------------------------------
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(codexData, null, 2));

console.log("Codex Dashboard generated with telemetry support");
