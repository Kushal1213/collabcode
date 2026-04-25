import React from 'react';
import Avatar from 'react-avatar';

/**
 * Client — displays a single connected user's avatar and username in the sidebar.
 * @param {{ username: string }} props
 */
const Client = ({ username }) => (
    <div className="client">
        <Avatar name={username} size={50} round="14px" />
        <span className="userName">{username}</span>
    </div>
);

export default Client;
