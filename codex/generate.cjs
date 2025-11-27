#!/usr/bin/env node

/**
 * Codex Dashboard Generator v5
 * ----------------------------
 * Reads merged telemetry from codex-data.json (supervisor + self-test)
 * and generates a clean static dashboard: codex/index.html
 */

import fs from "fs";
import path from "path";

// ----------------------------------------------------------
// 1. Resolve input/output paths
// ----------------------------------------------------------

const inputPath = process.argv[2] || "codex-data.json";
const outputDir = "codex";
const outputPath = path.join(outputDir, "index.html");

console.log(`📥 Loading telemetry from: ${inputPath}`);

// ----------------------------------------------------------
// 2. Load telemetry
// ----------------------------------------------------------

let telemetry;
try {
  const raw = fs.readFileSync(inputPath, "utf8");
  telemetry = JSON.parse(raw);
} catch (err) {
  console.error("❌ ERROR: Failed to load telemetry:", err);
  process.exit(1);
}

// Safety: establish empty objects if missing
const supervisor = telemetry.supervisor || {};
const selftest = telemetry.selftest || {};
const merged = telemetry.merged || []; // array of unified entries

// ----------------------------------------------------------
// 3. HTML Helpers
// ----------------------------------------------------------

const escapeHTML = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Renders a section block
 */
function section(title, inner) {
  return `
    <section style="margin-bottom:40px;">
      <h2>${escapeHTML(title)}</h2>
      ${inner}
    </section>
  `;
}

/**
 * Renders JSON blocks
 */
function jsonBlock(obj) {
  return `
    <pre style="
      background:#111;
      color:#0f0;
      padding:16px;
      border-radius:8px;
      font-size:14px;
      overflow-x:auto;
    ">${escapeHTML(JSON.stringify(obj, null, 2))}</pre>
  `;
}

/**
 * Render merged table
 */
function mergedTable(items) {
  if (!items.length) return "<p>No merged telemetry available.</p>";

  const rows = items
    .map((it) => {
      return `
        <tr>
          <td>${escapeHTML(it.timestamp || "")}</td>
          <td>${escapeHTML(it.category || "")}</td>
          <td>${escapeHTML(it.issue || "")}</td>
          <td>${escapeHTML(it.status || "")}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%;">
      <thead>
        <tr style="background:#333; color:white;">
          <th>Timestamp</th>
          <th>Category</th>
          <th>Issue/PR</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ----------------------------------------------------------
// 4. Build HTML Page
// ----------------------------------------------------------

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Codex Telemetry Dashboard</title>
  <style>
    body {
      background: #1e1e1e;
      color: #e2e2e2;
      font-family: Arial, sans-serif;
      margin: 20px 40px;
    }
    h1, h2, h3 {
      color: #4dd0ff;
    }
    a { color: #82cfff; }
  </style>
</head>

<body>

  <h1>Codex Telemetry Dashboard</h1>
  <p>Auto-generated from <code>${escapeHTML(inputPath)}</code></p>

  ${section("Merged Telemetry (Supervisor + Self-Test)", mergedTable(merged))}

  ${section("Supervisor Latest Event", jsonBlock(supervisor))}

  ${section("Self-Test Latest Event", jsonBlock(selftest))}

</body>
</html>
`;

// ----------------------------------------------------------
// 5. Write output
// ----------------------------------------------------------

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(outputPath, html);

console.log(`✅ Dashboard generated: ${outputPath}`);
