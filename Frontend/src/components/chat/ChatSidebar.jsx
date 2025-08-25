import React, { useState, useEffect } from 'react';
import './ChatSidebar.css';
import EditProfileModal from './EditProfileModal.jsx';
import { getProfile } from '../../services/api';

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [userInitials, setUserInitials] = useState('👤');
  const [isLoading, setIsLoading] = useState(false);

  // Load user profile to get initials for avatar
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getProfile();
        if (profile?.fullName?.firstName && profile?.fullName?.lastName) {
          const firstInitial = profile.fullName.firstName.charAt(0).toUpperCase();
          const lastInitial = profile.fullName.lastName.charAt(0).toUpperCase();
          setUserInitials(`${firstInitial}${lastInitial}`);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleProfileUpdated = (updatedProfile) => {
    if (updatedProfile?.fullName?.firstName && updatedProfile?.fullName?.lastName) {
      const firstInitial = updatedProfile.fullName.firstName.charAt(0).toUpperCase();
      const lastInitial = updatedProfile.fullName.lastName.charAt(0).toUpperCase();
      setUserInitials(`${firstInitial}${lastInitial}`);
    }
  };

  return (
    <>
      <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Chat sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button 
            className="small-btn" 
            onClick={onNewChat}
            aria-label="Start new chat"
          >
            New
          </button>
        </div>
        
        <nav className="chat-list" aria-live="polite">
          {chats.map(c => (
            <button
              key={c._id}
              className={"chat-list-item " + (c._id === activeChatId ? 'active' : '')}
              onClick={() => onSelectChat(c._id)}
              aria-current={c._id === activeChatId ? 'true' : 'false'}
            >
              <span className="title-line">{c.title}</span>
            </button>
          ))}
          {chats.length === 0 && (
            <p className="empty-hint">No chats yet. Click 'New' to start a conversation.</p>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            className="profile-btn"
            onClick={() => setShowProfile(true)}
            aria-haspopup="dialog"
            aria-expanded={showProfile ? 'true' : 'false'}
            aria-label="View and edit profile"
            disabled={isLoading}
          >
            <span className="avatar" aria-hidden="true">{userInitials}</span>
            <span className="label">View Profile</span>
          </button>
        </div>
      </aside>

      {showProfile && (
        <EditProfileModal 
          onClose={() => setShowProfile(false)} 
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </>
  );
};

export default ChatSidebar;
