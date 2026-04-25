import { io } from 'socket.io-client';

/**
 * Initialises and returns a Socket.IO client instance.
 *
 * Uses WebSocket transport exclusively for lower latency.
 * The backend URL is read from the REACT_APP_BACKEND_URL environment variable
 * so the same build works in development and production without code changes.
 *
 * @returns {Promise<import('socket.io-client').Socket>}
 */
export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL, options);
};
