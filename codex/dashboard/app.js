async function loadTelemetry() {
  const el = document.getElementById("container");

  try {
    const res = await fetch("../codex-data.json?" + Date.now());
    if (!res.ok) throw new Error("Telemetry not found");

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      el.innerHTML = "<p>No telemetry entries.</p>";
      return;
    }

    el.innerHTML = "";

    for (const entry of data.reverse()) {
      el.innerHTML += `
        <div class="entry">
          <strong>${entry.type}</strong><br>
          <strong>Timestamp:</strong> ${entry.timestamp}<br>
          <strong>Issue:</strong> ${entry.issue ?? "—"}<br>
          <strong>PR:</strong> ${entry.pr ?? "—"}<br>
          <strong>Status:</strong> ${entry.status}<br>
        </div>
      `;
    }
  } catch (err) {
    el.innerHTML = "<p>Error loading telemetry.</p>";
  }
}

loadTelemetry();
