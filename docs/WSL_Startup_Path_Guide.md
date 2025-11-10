🧭 WSL Startup Path Guide

Project: SaaS-App
Goal: Always start new WSL sessions inside your Linux home (~/projects/saas-app) instead of the Windows path (/mnt/c/Users/GaryB/projects/saas-app).

⚙️ 1. Why This Matters
Path	Filesystem	Notes
/mnt/c/...	Windows NTFS mount	❌ Slower I/O, permission issues (EPERM with Prisma, Playwright)
~/projects/...	Linux ext4 (native)	✅ Full compatibility, stable file locks, faster builds
//wsl$/Ubuntu/home/...	Windows view of Linux	✅ For use in VS Code (WSL Remote)

Keeping your project inside the Linux filesystem (~/projects) ensures that:

Prisma Studio and migrations run without permission errors

Playwright browsers and SQLite sockets work correctly

Node/npm performance is much faster

🧩 2. One-Time Command (For Ad-Hoc Use)

In PowerShell, you can launch WSL directly into your Linux project folder:

wsl -d Ubuntu --cd ~/projects/saas-app


✅ You’ll land in:

gary@LAPTOP-A917D90J:~/projects/saas-app$

🧱 3. Permanent Setup (Recommended)

You can make WSL or Windows Terminal always start in this directory automatically.

A. Set Default Folder in Windows Terminal

Open Windows Terminal

Click the ▼ arrow → Settings

Under Profiles → Ubuntu (WSL), scroll to Starting directory

Set:

//wsl$/Ubuntu/home/gary/projects/saas-app


Click Save

✅ From now on, every time you open Ubuntu, it starts in your project directory.

B. Edit /etc/wsl.conf (System-Wide Default)

If you prefer to set this directly inside WSL:

Launch WSL

Run:

sudo nano /etc/wsl.conf


Add or edit the following content:

[user]
default=gary

[automount]
enabled=true
root=/mnt/
options="metadata"

[interop]
appendWindowsPath=false

[terminal]
startingDirectory = //wsl$/Ubuntu/home/gary/projects/saas-app


Save (Ctrl+O, Enter) and exit (Ctrl+X).

Restart WSL:

wsl --shutdown
wsl


✅ You’ll now start in ~/projects/saas-app every time.

🧠 4. Opening VS Code in WSL Mode

When using VS Code, always use the WSL Remote extension:

cd ~/projects/saas-app
code .


This opens the project in VS Code inside WSL, with all Node, npm, and database tools running natively on Linux.

🧰 5. Quick Reference
Action	Command	Result
Open project from PowerShell	wsl -d Ubuntu --cd ~/projects/saas-app	One-time jump
Always start here (Windows Terminal)	Set profile to //wsl$/Ubuntu/home/gary/projects/saas-app	Persistent
Always start here (WSL system-wide)	Edit /etc/wsl.conf	Persistent
Edit code in VS Code	code . (inside WSL)	WSL-native dev
Restart WSL	wsl --shutdown	Applies new config
✅ Summary

Once set:

All WSL sessions start in your Linux-native path (~/projects/saas-app).

Prisma Studio, Playwright, and Next.js run without permission conflicts.

You never need to navigate away from /mnt/c/ again.

