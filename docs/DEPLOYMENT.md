# Deployment Guide

## ⚠️ Important: Use Render, NOT Vercel

CollabCode uses persistent WebSocket connections (Socket.IO). Vercel's serverless functions do not support these. Use **Render**, **Railway**, or **Fly.io** instead.

---

## Render (Free Tier)

### Step 1 — Push to GitHub

```bash
git push origin main
```

### Step 2 — Create a Web Service on Render

1. Go to https://render.com → New → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Environment**: Node

### Step 3 — Set environment variables

In Render dashboard → Environment:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |

*(No `REACT_APP_BACKEND_URL` needed server-side — it's baked into the React build)*

### Step 4 — Update frontend env and redeploy

After your first deploy you'll have a URL like `https://collabcode.onrender.com`.

Update `.env`:
```
REACT_APP_BACKEND_URL=https://collabcode.onrender.com
```

Rebuild and push again so the React bundle points to the correct server.

---

## Local Development

```bash
# Terminal 1 — React (port 3000)
npm run start:front

# Terminal 2 — Express + Socket.IO (port 5000)
npm run server:dev
```

Ensure `.env` has:
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

---

## Testing multiple users locally

Open `http://localhost:3000` in two different browser tabs (or windows).  
Create a room in tab 1, copy the Room ID, paste it in tab 2, and join.  
You should see both users in the sidebar and keystrokes sync instantly.
