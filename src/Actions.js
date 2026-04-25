/**
 * Socket.IO event name constants shared between server and client.
 * Using constants prevents typos in event names.
 */
const ACTIONS = {
    JOIN: 'join',           // Client requests to join a room
    JOINED: 'joined',       // Server confirms join + sends client list
    DISCONNECTED: 'disconnected', // Server notifies room of a departure
    CODE_CHANGE: 'code-change',   // Bidirectional: editor content changed
    SYNC_CODE: 'sync-code', // Client requests current code from host
    LEAVE: 'leave',         // Client initiates graceful leave
};

module.exports = ACTIONS;
