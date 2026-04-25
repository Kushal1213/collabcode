import { useEffect, useRef } from 'react';
import { initSocket } from '../socket';

/**
 * useSocket — initialises a Socket.IO connection and returns the socket ref.
 * Automatically cleans up on unmount to prevent ghost connections.
 *
 * @returns {React.MutableRefObject<import('socket.io-client').Socket | null>}
 */
export function useSocket() {
    const socketRef = useRef(null);

    useEffect(() => {
        let mounted = true;
        initSocket().then((socket) => {
            if (mounted) socketRef.current = socket;
        });
        return () => {
            mounted = false;
            socketRef.current?.disconnect();
        };
    }, []);

    return socketRef;
}
