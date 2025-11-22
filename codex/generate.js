import fs from "fs";
import path from "path";

// ---- 1. Determine output directory ----
const OUTPUT_DIR =
  process.env.CODEX_OUTPUT_DIR ||
  "codex-build"; // default local build folder

const outDir = path.join(process.cwd(), OUTPUT_DIR);

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`📁 Created directory: ${OUTPUT_DIR}`);
} else {
  console.log(`📁 Using existing directory: ${OUTPUT_DIR}`);
}

// ---- 2. Collect test + CI + metrics data ----
// For now we stub it until Codex integration is ready.
// These can later be swapped for real collectors.

const data = {
  timestamp: new Date().toISOString(),
  message: "Local Codex Dashboard build OK",
  source: "local-build",
};

// Write JSON
fs.writeFileSync(
  path.join(outDir, "codex-data.json"),
  JSON.stringify(data, null, 2)
);

// ---- 3. Create minimal dashboard HTML (placeholder) ----
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Codex Dashboard - Local</title>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial; padding: 40px; background: #f8f9fa; }
    .box { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { margin-top: 0; }
  </style>
</head>
<body>
  <div class="box">
    <h1>📊 Codex Dashboard (Local Build)</h1>
    <p>This dashboard was generated locally.</p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, "index.html"), html);

console.log(`✅ Codex Dashboard generated at: ${OUTPUT_DIR}/index.html`);
