<div align="center">
  <h1>⚡ CollabCode</h1>
  <p><strong>Real-time collaborative code editor</strong> — multiple developers can write code together in the same room, with every keystroke synced instantly via WebSockets.</p>

  <p>
    <img src="https://img.shields.io/badge/React-17-61DAFB?logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white" />
    <img src="https://img.shields.io/badge/CodeMirror-5-D30707?logoColor=white" />
    <img src="https://img.shields.io/badge/Node.js-16%2B-339933?logo=node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" />
  </p>
</div>

-----

## 📸 Preview

> Create a room → share the Room ID → collaborate in real time

*(Add a screenshot or GIF here)*

---

## ✨ Features

| Feature | Description |
|---|---|
| **Real-time sync** | Every keystroke broadcast to all room members via Socket.IO WebSockets |
| **Room system** | UUID-based rooms — share an ID to invite collaborators |
| **Live user list** | Sidebar shows all connected users with avatar initials |
| **Join / Leave toasts** | Instant notifications when someone enters or leaves |
| **Code sync on join** | Newcomers receive the full current editor state immediately |
| **Dracula theme** | CodeMirror 5 with syntax highlighting, line numbers, and auto-close |
| **Copy Room ID** | One-click clipboard copy for easy sharing |

---

## 🏗️ Architecture

```
Browser A                    Node.js Server              Browser B
─────────                    ──────────────              ─────────
type code  ──CODE_CHANGE──►  broadcast to room  ──────►  update editor
join room  ──JOIN──────────► notify all members ──────►  show toast
                             SYNC_CODE          ──────►  receive current code
```

**Key design decisions:**
- `origin !== 'setValue'` guard in the editor prevents broadcast loops when the editor is updated programmatically from a socket event.
- Code is tracked in a `ref` (not state) to avoid stale closure issues when syncing to newcomers.
- Socket cleanup runs on unmount to prevent memory leaks and ghost connections.

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 16

### 1 — Clone & install

```bash
git clone https://github.com/Kushal1213/collabcode.git
cd collabcode
npm install
```

### 2 — Configure environment

```bash
cp .env.example .env
# Set REACT_APP_BACKEND_URL=http://localhost:5000
```

### 3 — Run in development

**Terminal 1 — React dev server:**
```bash
npm run start:front
```

**Terminal 2 — Socket.IO backend:**
```bash
npm run server:dev
```

Open `http://localhost:3000`, create a room, then open a second tab and join with the same Room ID.

### 4 — Production build

```bash
npm run start   # builds React then starts the Express server
```

---

## 📁 Project Structure

```
collabcode/
├── server.js               # Express + Socket.IO server
├── package.json
├── .env.example            # Environment variable template
│
├── public/
│   ├── index.html
│   └── code-sync.png       # App logo
│
└── src/
    ├── Actions.js           # Socket event name constants
    ├── socket.js            # Socket.IO client initialisation
    ├── App.js               # Router setup
    ├── index.js             # React entry point
    │
    ├── hooks/
    │   └── useSocket.js     # Socket lifecycle hook
    │
    ├── components/
    │   ├── Client.js        # Connected user avatar card
    │   └── Editor.js        # CodeMirror wrapper with socket sync
    │
    └── pages/
        ├── Home.js          # Landing page — create/join room
        └── EditorPage.js    # Collaboration room with sidebar + editor
```

---

## 🌐 Deployment

### Render (recommended — free tier supports WebSockets)

1. Push this repo to GitHub
2. Create a **Web Service** on [Render](https://render.com)
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `node server.js`
5. Add environment variable: *(none needed server-side)*
6. After deploy, set `REACT_APP_BACKEND_URL` to your Render URL and redeploy

### Railway / Fly.io

Both support WebSockets out of the box — use the same build + start commands above.

> ⚠️ **Vercel does not support persistent WebSocket connections.** Use Render, Railway, or Fly.io instead.

---

## 🛠️ Tech Stack

**Frontend:** React 17 · React Router v6 · CodeMirror 5 · react-hot-toast · react-avatar  
**Backend:** Node.js · Express 4 · Socket.IO 4  
**Transport:** WebSocket (via Socket.IO)  
**Room IDs:** UUID v4  

---

## 📄 License

MIT
