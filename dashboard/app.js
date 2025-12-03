async function loadTelemetry() {
  const el = document.getElementById("container");

  try {
    const res = await fetch("../codex-data.json?" + Date.now(), {
      cache: "no-store"
    });

    if (!res.ok) {
      el.innerHTML = "<p>Error loading telemetry file.</p>";
      return;
    }

    const data = await res.json();
    el.innerHTML = "";

    //
    // Activity block
    //
    if (data.activity) {
      const a = data.activity;
      el.innerHTML += `
        <div class="entry">
          <strong>Activity Engine</strong><br>
          <strong>Timestamp:</strong> ${a.timestamp}<br>
          <strong>Items Checked:</strong> ${a.items_checked}<br>
        </div>
      `;
    }

    //
    // Self-Test block
    //
    if (data.selftest) {
      const s = data.selftest;
      el.innerHTML += `
        <div class="entry">
          <strong>Self-Test</strong><br>
          <strong>Timestamp:</strong> ${s.timestamp}<br>
          <strong>Status:</strong> ${s.status}<br>
          <strong>Issue:</strong> ${s.issue || "—"}<br>
        </div>
      `;
    }

    //
    // Supervisor block
    //
    if (data.supervisor) {
      const sup = data.supervisor;
      el.innerHTML += `
        <div class="entry">
          <strong>Supervisor</strong><br>
          <strong>Timestamp:</strong> ${sup.timestamp}<br>
          <strong>Status:</strong> ${sup.status}<br>
        </div>
      `;
    }

    //
    // Full merged object
    //
    el.innerHTML += `
      <div class="entry">
        <strong>Merged Data</strong><br>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;

  } catch (err) {
    console.error(err);
    el.innerHTML = "<p>Error loading telemetry.</p>";
  }
}

loadTelemetry();
