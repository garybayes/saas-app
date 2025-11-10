# 🧭 Codex Rebuild Dashboard

[![Codex Validation](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/garybayes/saas-app/main/.github/badges/codex-status.json)](https://github.com/garybayes/saas-app/issues)
[![Build Status](https://github.com/garybayes/saas-app/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/garybayes/saas-app/actions/workflows/ci-pipeline.yml)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/garybayes/saas-app/actions)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](../LICENSE)

---

## 🧩 Overview

The **Codex Rebuild Dashboard** tracks validation cycles, rebuild events, and CI status for the  
**SaaS-App** project — the workflow hub and automation engine for remote professionals.

Each time Codex completes a validation, this dashboard automatically updates:

- ✅ **Codex badge color and timestamp** (from `.github/badges/codex-status.json`)  
- 🧾 **History log** (`doc/Codex_Rebuild_History.md`)  
- 📈 **Test coverage and summary snapshot**  
- 🔁 **Active sprint branch and version tag**

---

## 🚀 Current Status

| Metric | Value |
|---------|--------|
| **Active Sprint** | `sprint-5-development` |
| **Latest Tag** | `v5.0.2-sprint5-review` |
| **Codex Validation** | ![Codex Status](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/garybayes/saas-app/main/.github/badges/codex-status.json) |
| **Last Verified** | Extracted automatically from badge JSON |
| **Environment** | WSL2 / Ubuntu / Node 22 / PostgreSQL 16 |
| **Next Validation Trigger** | After successful CI run on `sprint-6-prep` |

---

## 🧪 Test Coverage Snapshot

| Test Suite | Framework | Status | Command |
|-------------|------------|---------|----------|
| Unit & Integration | Vitest | ✅ Passing | `npm run test` |
| End-to-End | Playwright | ⚠️ Partial | `npm run test:e2e` |
| Database Migration | Prisma | ✅ Verified | `npx prisma migrate deploy` |
| Seeding & Encryption | Prisma + AES-256 | ✅ Working | `npx prisma db seed` |
| Authentication Flow | NextAuth | ✅ Validated | via `/api/auth/signup` + `/api/auth/callback` |

**Coverage Report (Next Codex Pull)**  
Codex will append test metrics (pass %, suite time, failed assertions) in the next rebuild cycle.

---

## 🧾 Rebuild History (from `/doc/Codex_Rebuild_History.md`)

| Date (UTC) | Branch | Status |
|-------------|---------|----------|
| 2025-11-08 22:34:17 UTC | sprint-5-development | passing |
| 2025-11-09 00:12:03 UTC | sprint-6-prep | failed |
| 2025-11-09 02:48:59 UTC | sprint-6-prep | passing |

> **Note:** This table auto-updates whenever a Codex validation event (`codex-validated`) is received.

---

## ⚙️ Validation Flow Summary

| Stage | Workflow File | Description |
|--------|----------------|--------------|
| 🧩 CI Pipeline | `.github/workflows/ci-pipeline.yml` | Runs build, tests, and badge update |
| 🚀 Codex Trigger | `codex-trigger` job in CI | Sends rebuild webhook when CI passes |
| 📬 Listener | `.github/workflows/codex-listener.yml` | Receives `codex-rebuild` events |
| 🕒 Validation Monitor | `.github/workflows/codex-validation-monitor.yml` | Updates badge + log with timestamps |
| 🧾 History Log | `/doc/Codex_Rebuild_History.md` | Records validation events persistently |

---

## 🧠 Developer Actions

### To manually trigger Codex rebuild:
```bash
curl -X POST \
  -H "Authorization: Bearer $(gh auth token)" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/garybayes/saas-app/dispatches \
  -d '{"event_type":"codex-rebuild","client_payload":{"branch":"sprint-6-prep"}}'

To manually record validation result:
curl -X POST \
  -H "Authorization: Bearer $(gh auth token)" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/garybayes/saas-app/dispatches \
  -d '{"event_type":"codex-validated","client_payload":{"status":"passing","color":"brightgreen","branch":"sprint-6-prep"}}'

🔍 References

Codex CI Integration Guide

Environment Variables Setup Guide

WSL Setup for Codex Rebuild

Branch Protection Policy Guide

Codex Rebuild History

👤 Maintainer

Gary G. Bayes, BABA, MBA
Project Owner & Lead Architect
📧 garybayes@github.io

🧾 License

This project is licensed under the MIT License.
See LICENSE
 for full details.
