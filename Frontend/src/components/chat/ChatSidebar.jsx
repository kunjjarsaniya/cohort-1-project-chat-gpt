import React, { useState } from 'react';
import './ChatSidebar.css';
import EditProfileModal from './EditProfileModal.jsx';


const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => {
  const [ showProfile, setShowProfile ] = useState(false);

  return (
    <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>
      <nav className="chat-list" aria-live="polite">
        {chats.map(c => (
          <button
            key={c._id}
            className={"chat-list-item " + (c._id === activeChatId ? 'active' : '')}
            onClick={() => onSelectChat(c._id)}
          >
            <span className="title-line">{c.title}</span>
          </button>
        ))}
        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>

      <div className="sidebar-footer">
        <button
          className="profile-btn"
          onClick={() => setShowProfile(true)}
          aria-haspopup="dialog"
          aria-expanded={showProfile ? 'true' : 'false'}
        >
          <span className="avatar" aria-hidden="true">👤</span>
          <span className="label">View Profile</span>
        </button>
      </div>

      {showProfile && (
        <EditProfileModal onClose={() => setShowProfile(false)} />
      )}
    </aside>
  );
};

export default ChatSidebar;
