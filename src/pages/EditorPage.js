import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

/**
 * EditorPage — the main collaboration screen.
 *
 * Responsibilities:
 * - Connect to the Socket.IO server and join the room from the URL.
 * - Maintain the live list of connected clients in sidebar.
 * - Sync current editor code to newcomers via SYNC_CODE.
 * - Handle disconnections gracefully with toast notifications.
 * - Provide "Copy Room ID" and "Leave" actions.
 */
const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef   = useRef(null);       // tracks latest editor content for sync
    const location  = useLocation();
    const navigate  = useNavigate();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            const handleErrors = (err) => {
                console.error('Socket error:', err);
                toast.error('Connection failed — please try again.');
                navigate('/');
            };

            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                // Don't notify yourself
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);

                // Sync current code to the newly joined peer
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                });
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter((c) => c.socketId !== socketId));
            });
        };

        init();

        return () => {
            socketRef.current?.disconnect();
            socketRef.current?.off(ACTIONS.JOINED);
            socketRef.current?.off(ACTIONS.DISCONNECTED);
        };
    }, []);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied to clipboard!');
        } catch {
            toast.error('Could not copy Room ID.');
        }
    };

    const leaveRoom = () => navigate('/');

    // Guard: redirect home if username wasn't passed through router state
    if (!location.state) return <Navigate to="/" />;

    return (
        <div className="mainWrap">
            <aside className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/code-sync.png" alt="CollabCode" />
                    </div>
                    <h3>Connected ({clients.length})</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy Room ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
            </aside>

            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => { codeRef.current = code; }}
                />
            </div>
        </div>
    );
};

export default EditorPage;
