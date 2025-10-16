# 🧠 Mind Forge – SaaS Platform

A modular **AI workflow automation platform** built with **Next.js + TailwindCSS**.  
Connect your favorite tools, automate tasks, and build no-code workflows in minutes.

---

## 🚀 Features
- 🔗 **App Connections** – Connect APIs from tools like Notion, Google Drive, or Slack  
- ⚙️ **Workflow Builder** – Drag-and-drop automation designer  
- 📊 **Dashboard** – Unified command center for tasks and analytics  
- 👋 **Guided Setup** – Easy onboarding with step-by-step wizard  
- 🌈 **Tailwind UI** – Clean, responsive, and theme-ready interface  

---

## 🛠️ Tech Stack
| Layer | Technology |
|--------|-------------|
| Frontend | Next.js 15, React, TailwindCSS |
| UI Components | ShadCN/UI, Lucide Icons |
| State / Logic | Zustand / React Context |
| Backend (planned) | Next.js API Routes or Supabase |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | Clerk / Auth.js (TBD) |

---

## 🧩 Project Structure
src/
├── app/
│ ├── globals.css
│ ├── layout.tsx
│ ├── page.tsx
│ ├── (screens)/
│ │ ├── screen1-welcome/
│ │ ├── screen2-connections/
│ │ └── screen3-dashboard/
├── components/
└── lib/
tailwind.config.js
postcss.config.js

---

## 🧰 Local Setup
```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/aibuddy-saas.git
cd aibuddy-saas

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

Then open http://localhost:3000
.

🧭 Deployment

Ready to deploy on:

Vercel (recommended)

Netlify or Cloudflare Pages

📅 Next Steps

 Add backend API connection tests

 Build workflow builder screen

 Configure CI/CD via GitHub Actions

 Write tests for connections & UI flows

© 2025 Mind Forge Inc. | All rights reserved.

