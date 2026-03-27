# 🛡️ Devika Krishnan — Portfolio Project

A cybersecurity-themed portfolio website with a full modern web development workflow.

---

## 📁 Project Structure

```
devika-portfolio/          ← Frontend (GitHub Pages)
├── index.html             ← Your portfolio website
├── package.json           ← NPM scripts for lint & test
├── .eslintrc.json         ← ESLint config
├── .gitignore
└── .github/
    └── workflows/
        └── ci.yml         ← GitHub Actions CI/CD

devika-backend/            ← Backend (Render.com)
├── server.js              ← Express + PostgreSQL API
├── package.json
├── .env.example           ← Copy to .env and fill values
└── .gitignore
```

---

## 🚀 Setup Instructions

### Step 1 — Install Git
Download from: https://git-scm.com/download/win

```bash
git config --global user.name "Devika Krishnan"
git config --global user.email "your-email@gmail.com"
```

---

### Step 2 — Frontend Setup

```bash
cd devika-portfolio
git init
git add .
git commit -m "Initial commit: Add portfolio website"
git remote add origin https://github.com/YOUR_USERNAME/devika-portfolio.git
git branch -M main
git push -u origin main
```

---

### Step 3 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages → Source: Deploy from branch → main / root
3. Your site will be live at: https://YOUR_USERNAME.github.io/devika-portfolio

---

### Step 4 — GitHub Actions (Auto-runs on push)
The `.github/workflows/ci.yml` file is already included.
Every time you push code, it will automatically lint and test. ✅

---

### Step 5 — Backend Setup (Local)

```bash
cd devika-backend
npm install
cp .env.example .env
# Edit .env and add your PostgreSQL URL
npm run dev
# Visit http://localhost:3000
```

---

### Step 6 — Deploy Backend on Render.com
1. Create account at https://render.com
2. New → Web Service → Connect your devika-backend GitHub repo
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. New → PostgreSQL → Create free database
6. Copy the Internal Database URL
7. In your Web Service → Environment → Add:
   - KEY: `DATABASE_URL`
   - VALUE: (paste the PostgreSQL URL)
8. Deploy! You get a URL like: https://devika-backend.onrender.com

---

### Step 7 — Connect Frontend to Backend
In `index.html`, find this line and update it:

```javascript
const BACKEND_URL = 'https://devika-backend.onrender.com/api/contact';
```

Then push:
```bash
git add .
git commit -m "Connect contact form to backend"
git push
```

---

## 🔗 API Endpoints

| Method | Endpoint        | Description                  |
|--------|----------------|------------------------------|
| GET    | /               | Health check                 |
| POST   | /api/contact    | Save contact form message    |
| GET    | /api/contacts   | View all messages (yours)    |

---

## 🌐 Workflow Summary

```
VS Code → git push → GitHub → GitHub Actions (CI/CD) → GitHub Pages + Render.com → Browser
```

---

Built with 💖 by Devika Krishnan
