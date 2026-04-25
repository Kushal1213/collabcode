const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ─── Serve React build ────────────────────────────────────────────────────────
app.use(express.static('build'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ─── In-memory map: socketId → username ──────────────────────────────────────
const userSocketMap = {};

/**
 * Returns the list of all connected clients in a given room.
 * @param {string} roomId
 * @returns {{ socketId: string, username: string }[]}
 */
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
        socketId,
        username: userSocketMap[socketId],
    }));
}

// ─── Socket.IO events ─────────────────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    /**
     * JOIN — a user enters a room with their username.
     * Notifies all existing members and syncs current code to the newcomer.
     */
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });

        console.log(`👤 ${username} joined room: ${roomId} (${clients.length} connected)`);
    });

    /**
     * CODE_CHANGE — broadcast updated code to everyone else in the room.
     */
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    /**
     * SYNC_CODE — send the current editor state to a newly joined socket.
     */
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    /**
     * disconnecting — notify room members before the socket leaves.
     */
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        console.log(`❌ ${userSocketMap[socket.id]} disconnected (${socket.id})`);
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
