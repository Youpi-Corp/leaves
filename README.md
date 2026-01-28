# Brainforest Frontend ("leaves") — Friendly Start

Hey! First time on GitHub? No stress. This repo is the **frontend** for Brainforest. The backend API lives in the **"sap"** project.

## What you need (local run)

- **Node.js** (and npm)

## Quick start (local)

1) **Install dependencies**

```bash
npm install
```

2) **(Optional) Point to your own API**

Create a file called `.env.local` and add:

```env
VITE_API_BASE_URL=http://localhost:8080
```

3) **Run the app**

```bash
npm run dev
```

You should see the app at the URL Vite prints in your terminal.

## Deploying (for schools/communities)

If you want to host this for a group, you’ll usually need:
- A Linux server (VPS)
- A web server (Nginx)
- A domain name + SSL (Let’s Encrypt)

There’s a more detailed deployment doc here:
- `DEPLOYMENT.md`

---

Start local, breathe, and you’ll be fine.
