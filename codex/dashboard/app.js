async function loadTelemetry() {
  const el = document.getElementById("container");

  try {
    const res = await fetch("../codex-data.json?" + Date.now());
    if (!res.ok) throw new Error("Telemetry not found");

    const data = await res.json();

    // Expecting object: { updated_at, supervisor, selftest }
    if (!data || typeof data !== "object") {
      el.innerHTML = "<p>Invalid telemetry format.</p>";
      return;
    }

    el.innerHTML = "";

    // Render supervisor block
    if (data.supervisor) {
      el.innerHTML += `
        <div class="entry">
          <strong>Supervisor</strong><br>
          <strong>Timestamp:</strong> ${data.supervisor.timestamp}<br>
          <strong>Status:</strong> ${data.supervisor.status}<br>
          <strong>Source:</strong> ${data.supervisor.source}<br>
        </div>
      `;
    }

    // Render self-test block
    if (data.selftest) {
      el.innerHTML += `
        <div class="entry">
          <strong>Self-Test</strong><br>
          <strong>Timestamp:</strong> ${data.selftest.timestamp}<br>
          <strong>Status:</strong> ${data.selftest.status}<br>
          <strong>Issue:</strong> ${data.selftest.issue ?? "—"}<br>
          <strong>Source:</strong> ${data.selftest.source}<br>
        </div>
      `;
    }

    // Render merged overview
    el.innerHTML += `
      <div class="entry">
        <strong>Merged Dataset</strong><br>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;

  } catch (err) {
    console.error(err);
    el.innerHTML = "<p>Error loading telemetry.</p>";
  }
}

loadTelemetry();
