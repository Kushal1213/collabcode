import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

/**
 * Home — landing page where users create or join a collaboration room.
 *
 * - "Create new room" generates a UUID room ID and fills the input.
 * - "Join" validates both fields then navigates to /editor/:roomId,
 *   passing the username through router state.
 */
const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId]     = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('New room created — share the Room ID to collaborate!');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Both Room ID and username are required.');
            return;
        }
        navigate(`/editor/${roomId}`, { state: { username } });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') joinRoom();
    };

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img
                    className="homePageLogo"
                    src="/code-sync.png"
                    alt="CollabCode logo"
                />
                <h4 className="mainLabel">Paste invitation Room ID</h4>

                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInfo">
                        No invite?&nbsp;
                        <a onClick={createNewRoom} href="/" className="createNewBtn">
                            Create a new room
                        </a>
                    </span>
                </div>
            </div>

            <footer>
                <h4>Built with 💛 — Real-time collaboration powered by Socket.IO</h4>
            </footer>
        </div>
    );
};

export default Home;
