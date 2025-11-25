// codex/templates/dashboard.js

async function loadJson(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`⚠️ Failed to load ${url}:`, err);
    return null;
  }
}

function formatTimestamp(ts) {
  if (!ts) return "–";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

function percent(value) {
  if (typeof value !== "number") return "–";
  return `${Math.round(value * 100)}%`;
}

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "–";
  if (seconds < 90) return `${seconds}s`;
  const mins = Math.round(seconds / 60);
  return `${mins}m`;
}

function applyMeta(meta, telemetry) {
  const versionEl = document.getElementById("meta-build-version");
  const timeEl = document.getElementById("meta-build-time");
  const pillEl = document.getElementById("meta-selftest-pill");

  if (versionEl) {
    versionEl.textContent = `Version ${meta?.version ?? "–"}`;
  }

  if (timeEl) {
    timeEl.textContent = `Last build ${formatTimestamp(meta?.lastBuild)}`;
  }

  if (pillEl) {
    const dot = pillEl.querySelector(".pill-dot");
    const textSpan = pillEl.querySelector("span:last-child");

    const status = (telemetry?.last_status || "unknown").toLowerCase();
    let label = "Self-test: unknown";

    if (status === "success") {
      dot.classList.add("success");
      label = "Self-test: passing";
    } else if (status === "failure" || status === "failed" || status === "error") {
      dot.classList.add("danger");
      label = "Self-test: failing";
    }

    textSpan.textContent = label;
  }
}

function applySummary(telemetry) {
  const lastRunEl = document.getElementById("status-last-run");
  const successRateEl = document.getElementById("status-success-rate");
  const avgDurationEl = document.getElementById("status-avg-duration");
  const badgeEl = document.getElementById("status-badge");
  const issueTag = document.getElementById("tag-last-issue");
  const prTag = document.getElementById("tag-last-pr");

  if (!telemetry) {
    if (lastRunEl) lastRunEl.textContent = "No data";
    if (successRateEl) successRateEl.textContent = "–";
    if (avgDurationEl) avgDurationEl.textContent = "–";
    if (badgeEl) {
      badgeEl.textContent = "NO DATA";
      badgeEl.classList.add("fail");
    }
    return;
  }

  if (lastRunEl) lastRunEl.textContent = formatTimestamp(telemetry.last_run);
  if (successRateEl)
    successRateEl.textContent = percent(telemetry.stats?.success_rate);
  if (avgDurationEl)
    avgDurationEl.textContent = formatDuration(
      telemetry.stats?.average_duration
    );

  if (badgeEl) {
    const status = (telemetry.last_status || "unknown").toLowerCase();
    if (status === "success") {
      badgeEl.textContent = "PASSING";
      badgeEl.classList.add("ok");
    } else if (
      status === "failure" ||
      status === "failed" ||
      status === "error"
    ) {
      badgeEl.textContent = "FAILING";
      badgeEl.classList.add("fail");
    } else {
      badgeEl.textContent = "UNKNOWN";
    }
  }

  if (issueTag) {
    const span = issueTag.querySelector("span:last-child");
    span.textContent = telemetry.last_issue || "–";
  }

  if (prTag) {
    const span = prTag.querySelector("span:last-child");
    span.textContent = telemetry.last_pr || "–";
  }
}

function renderHistory(telemetry) {
  const listEl = document.getElementById("history-list");
  const emptyEl = document.getElementById("history-empty");

  if (!listEl || !emptyEl) return;

  const history = telemetry?.history || [];

  if (!history.length) {
    listEl.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }

  emptyEl.style.display = "none";

  listEl.innerHTML = "";
  history.forEach((run) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const left = document.createElement("div");
    left.className = "history-left";

    const statusSpan = document.createElement("div");
    statusSpan.className = "history-status";
    const st = (run.status || "unknown").toLowerCase();
    if (st === "success") statusSpan.classList.add("success");
    else if (st === "failure" || st === "failed" || st === "error")
      statusSpan.classList.add("failure");
    statusSpan.textContent = st.toUpperCase();

    const metaSpan = document.createElement("div");
    metaSpan.className = "history-meta";
    const issue = run.issue ? `#${run.issue}` : "no issue";
    const pr = run.pr ? `PR #${run.pr}` : "no PR";
    metaSpan.textContent = `${issue} • ${pr}`;

    left.appendChild(statusSpan);
    left.appendChild(metaSpan);

    const right = document.createElement("div");
    right.className = "history-right";
    right.innerHTML = `${formatTimestamp(run.timestamp)}<br/>${formatDuration(
      run.duration_seconds
    )}`;

    li.appendChild(left);
    li.appendChild(right);
    listEl.appendChild(li);
  });
}

function renderChart(telemetry) {
  const ctx = document.getElementById("selftestChart");
  if (!ctx || !telemetry || !Array.isArray(telemetry.history)) return;

  const labels = telemetry.history
    .slice()
    .reverse()
    .map((run) => {
      const d = new Date(run.timestamp);
      if (Number.isNaN(d.getTime())) return run.timestamp;
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    });

  const durations = telemetry.history
    .slice()
    .reverse()
    .map((run) => run.duration_seconds || 0);

  const statuses = telemetry.history
    .slice()
    .reverse()
    .map((run) =>
      (run.status || "unknown").toLowerCase() === "success" ? 1 : 0
    );

  // eslint-disable-next-line no-undef
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Duration (s)",
          data: durations,
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 2,
        },
        {
          label: "Success (1) / Fail (0)",
          data: statuses,
          borderWidth: 1,
          tension: 0.2,
          pointRadius: 1.5,
          borderDash: [4, 4],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#9ca3af",
            font: { size: 11 },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#6b7280",
            maxRotation: 45,
            minRotation: 0,
          },
          grid: {
            color: "rgba(31,41,55,0.6)",
          },
        },
        y: {
          ticks: {
            color: "#6b7280",
          },
          grid: {
            color: "rgba(31,41,55,0.5)",
          },
        },
      },
    },
  });
}

async function initDashboard() {
  const data = await loadJson("codex-data.json");
  if (!data) {
    console.warn("No codex-data.json found; dashboard in empty-state mode.");
    applySummary(null);
    return;
  }

  applyMeta(data.meta, data.telemetry);
  applySummary(data.telemetry);
  renderHistory(data.telemetry);
  renderChart(data.telemetry);
}

document.addEventListener("DOMContentLoaded", initDashboard);
