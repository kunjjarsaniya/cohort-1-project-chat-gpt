import React, { useState, useEffect, useRef } from 'react';
import './ChatTitleModal.css';

const ChatTitleModal = ({ isOpen, onSubmit, onCancel, pending }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setError('');
      if (inputRef.current) inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOk = () => {
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    if (!pending) onSubmit(title.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleOk();
    if (e.key === 'Escape') onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <h2>Enter a title for the new chat:</h2>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={e => { setTitle(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          className={error ? 'error' : ''}
          placeholder="Chat title..."
          disabled={pending}
        />
        {error && <div className="error-message">{error}</div>}
        <div className="chat-modal-actions">
          <button onClick={handleOk} className="ok-btn" disabled={pending}>
            {pending ? 'Creating...' : 'OK'}
          </button>
          <button onClick={onCancel} className="cancel-btn" disabled={pending}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChatTitleModal;
