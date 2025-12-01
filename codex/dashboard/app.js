async function loadTelemetry() {
  const url = "/codex-data.json"; // root-level telemetry file

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderDashboard(data);
  } catch (err) {
    console.error("Failed to load telemetry:", err);
    document.getElementById("total-issues").innerText = "–";
  }
}

function renderDashboard(data) {
  if (!Array.isArray(data)) {
    console.warn("Invalid telemetry structure:", data);
    return;
  }

  // Flatten all issues from all snapshots
  const issues = [];
  const events = [];

  data.forEach(entry => {
    if (entry.project && entry.project.items) {
      entry.project.items.forEach(item => issues.push(item));
    }

    if (entry.activity && entry.activity.items) {
      entry.activity.items.forEach(a => events.push(a));
    }
  });

  // Deduplicate issues by ID or number
  const deduped = {};
  issues.forEach(i => {
    if (i && i.number) deduped[i.number] = i;
  });

  const issueList = Object.values(deduped);

  // Compute stats
  const total = issueList.length;
  const stale = issueList.filter(i => hasLabel(i, "stale")).length;
  const escalated = issueList.filter(i => hasLabel(i, "needs-attention")).length;

  // Render stats
  document.getElementById("total-issues").innerText = total;
  document.getElementById("stale-count").innerText = stale;
  document.getElementById("escalated-count").innerText = escalated;

  // Recent activity (sorted)
  const sortedEvents = events
    .filter(e => e && e.updatedAt)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 20);

  const eventList = document.getElementById("event-list");
  eventList.innerHTML = "";

  sortedEvents.forEach(ev => {
    const li = document.createElement("li");
    li.textContent = `#${ev.number}: ${ev.title} — updated ${timeAgo(ev.updatedAt)}`;
    eventList.appendChild(li);
  });

  document.getElementById("recent-activity-count").innerText =
    sortedEvents.length;
}

function hasLabel(issue, name) {
  if (!issue || !issue.labels) return false;
  return issue.labels.some(l => l.name === name);
}

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

// Auto-refresh every 60 seconds
setInterval(loadTelemetry, 60000);

// Initial load
loadTelemetry();
