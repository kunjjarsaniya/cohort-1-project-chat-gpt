
import React, { useEffect, useRef, useState } from 'react';
import './ChatMessages.css';
import { likeMessage, dislikeMessage, regenerateMessage } from '../../services/api';

// MessageActions: Modular controls for AI messages
const MessageActions = ({ onLike, onDislike, onSpeak, onRegenerate, isSpeaking, isLiked, isDisliked, canSpeak, content, setActionMsg }) => (
  <div className="msg-actions" role="group" aria-label="Message actions">
    <button
      type="button"
      aria-label="Copy message"
      className="glow-btn"
      onClick={() => {
        navigator.clipboard.writeText(content);
        setActionMsg && setActionMsg('Message copied!');  
      }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    </button>
    <button
      type="button"
      aria-label="Like response"
      aria-pressed={isLiked}
      className={`glow-btn${isLiked ? ' active' : ''}`}
      onClick={onLike}
      tabIndex={0}
    >
      <span role="img" aria-label="Like">👍</span>
    </button>
    <button
      type="button"
      aria-label="Dislike response"
      aria-pressed={isDisliked}
      className={`glow-btn${isDisliked ? ' active' : ''}`}
      onClick={onDislike}
      tabIndex={0}
    >
      <span role="img" aria-label="Dislike">👎</span>
    </button>
    <button
      type="button"
      aria-label="Speak message"
      className="glow-btn"
      aria-pressed={isSpeaking}
      onClick={onSpeak}
      disabled={!canSpeak}
    >
      <span role="img" aria-label="Speak">{isSpeaking ? '🔊' : '🔈'}</span>
    </button>
    <button
      type="button"
      aria-label="Regenerate"
      className="glow-btn"
      onClick={onRegenerate}
      tabIndex={0}
    >
      <span role="img" aria-label="Regenerate">🔁</span>
    </button>
  </div>
);

// Message: Modular message bubble with role, content, timestamp, and actions
const Message = ({ message, onLike, onDislike, onSpeak, onRegenerate, isSpeaking, isLiked, isDisliked, canSpeak, setActionMsg }) => {
  const { type, content, timestamp, username } = message;
  const isUser = type === 'user';
  const isAI = type === 'ai';
  const roleName = isUser ? `user${username ? `[${username}]` : ''}` : `Chatur Chokro`;
  const roleClass = isUser ? 'msg-user' : 'msg-ai';
  return (
    <div className={`msg ${roleClass}`}> 
      <div className="msg-role" aria-label={roleName}>{roleName}</div>
      <div className="msg-bubble">
        {content}
        <span className="msg-timestamp" aria-label="Timestamp">{timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
      </div>
      {isAI && (
        <MessageActions
          onLike={onLike}
          onDislike={onDislike}
          onSpeak={onSpeak}
          onRegenerate={onRegenerate}
          isSpeaking={isSpeaking}
          isLiked={isLiked}
          isDisliked={isDisliked}
          canSpeak={canSpeak}
          content={content}
          setActionMsg={setActionMsg}
        />
      )}
      {isUser && (
        <div className="msg-actions" role="group" aria-label="Message actions">
          <button
            type="button"
            aria-label="Copy message"
            className="glow-btn"
            onClick={() => { navigator.clipboard.writeText(content); setActionMsg && setActionMsg('Message copied!'); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};


const ChatMessages = ({ messages, isSending, onRegenerate }) => {
  const bottomRef = useRef(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [feedback, setFeedback] = useState({}); // { [msgIndex]: { liked: bool, disliked: bool } }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isSending]);

  // Speech synthesis support
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handleSpeak = (idx, content) => {
    if (!canSpeak) return;
    if (speakingId === idx) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      const utter = new window.SpeechSynthesisUtterance(content);
      utter.onend = () => setSpeakingId(null);
      window.speechSynthesis.speak(utter);
      setSpeakingId(idx);
    }
  };


  // Like/dislike logic: only one can be active at a time

  // Simple feedback state for action confirmation
  const [actionMsg, setActionMsg] = useState("");
  useEffect(() => {
    if (actionMsg) {
      const t = setTimeout(() => setActionMsg(""), 1200);
      return () => clearTimeout(t);
    }
  }, [actionMsg]);

  const handleLike = async idx => {
    const msg = messages[idx];
    try {
      await likeMessage(msg._id || msg.id);
      setFeedback(f => ({ ...f, [idx]: { liked: true, disliked: false } }));
      setActionMsg("You liked this message");
    } catch (e) {
      setActionMsg('Failed to like message');
    }
  };
  const handleDislike = async idx => {
    const msg = messages[idx];
    try {
      await dislikeMessage(msg._id || msg.id);
      setFeedback(f => ({ ...f, [idx]: { liked: false, disliked: true } }));
      setActionMsg("You disliked this message");
    } catch (e) {
      setActionMsg('Failed to dislike message');
    }
  };

  // Regenerate logic: call prop if provided, else call backend and update message
  const handleRegenerate = async (m, idx) => {
    if (onRegenerate) {
      onRegenerate(m, idx);
      setActionMsg("Regenerating response...");
      return;
    }
    try {
      const res = await regenerateMessage(m._id || m.id);
      if (res.data && res.data.newMessage) {
        setActionMsg("Response regenerated!");
      }
    } catch (e) {
      setActionMsg('Failed to regenerate message');
    }
  };

  return (
    <div className="messages" aria-live="polite">
      {actionMsg && (
        <div style={{position:'fixed',top:20,left:'50%',transform:'translateX(-50%)',background:'#222',color:'#fff',padding:'8px 18px',borderRadius:8,zIndex:1000,boxShadow:'0 2px 8px #0003',fontSize:'1rem'}}>{actionMsg}</div>
      )}
      {messages.map((m, idx) => (
        <Message
          key={idx}
          message={m}
          onLike={() => handleLike(idx)}
          onDislike={() => handleDislike(idx)}
          onSpeak={() => handleSpeak(idx, m.content)}
          onRegenerate={() => handleRegenerate(m, idx)}
          isSpeaking={speakingId === idx}
          isLiked={!!feedback[idx]?.liked}
          isDisliked={!!feedback[idx]?.disliked}
          canSpeak={canSpeak}
          setActionMsg={setActionMsg}
        />
      ))}
      {isSending && (
        <div className="msg msg-ai pending">
          <div className="msg-role" aria-hidden="true">AI[ChaturChokro]</div>
          <div className="msg-bubble typing-dots" aria-label="AI is typing">
            <span/><span/><span/>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
