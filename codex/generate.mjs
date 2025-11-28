import fs from "fs";

/**
 * Safe JSON loader
 */
function loadJson(filePath, defaultValue = null) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Missing file: ${filePath} (using default)`);
      return defaultValue;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`Failed to read JSON from ${filePath}:`, err);
    return defaultValue;
  }
}

/**
 * Dashboard source of truth (already merged by telemetry-merge workflow)
 */
const DATA_FILE = "codex-data.json";
const HTML_FILE = "index.html";

// Read merged telemetry
const data = loadJson(DATA_FILE, {
  updated_at: null,
  supervisor: null,
  selftest: null,
});

/**
 * Generate dashboard HTML
 */
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Codex Telemetry Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .box { padding: 20px; border-radius: 8px; background: #f0f0f0; margin-bottom: 20px; }
    h1 { margin-top: 0; }
    pre {
      background: #1a1a1a;
      color: #0f0;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h1>📊 Codex Telemetry Dashboard</h1>
  <p><strong>Last Updated:</strong> ${data.updated_at || "unknown"}</p>

  <div class="box">
    <h2>Supervisor Telemetry</h2>
    <pre>${JSON.stringify(data.supervisor, null, 2)}</pre>
  </div>

  <div class="box">
    <h2>Self-Test Telemetry</h2>
    <pre>${JSON.stringify(data.selftest, null, 2)}</pre>
  </div>

  <div class="box">
    <h2>Merged Raw Data</h2>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  </div>
</body>
</html>
`;

// Write dashboard
fs.writeFileSync(HTML_FILE, html);
console.log(`✔ Dashboard written: ${HTML_FILE}`);
