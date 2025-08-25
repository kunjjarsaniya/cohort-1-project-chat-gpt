import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats
} from '../store/chatSlice.js';

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const input = useSelector(state => state.chat.input);
  const isSending = useSelector(state => state.chat.isSending);
  const [ sidebarOpen, setSidebarOpen ] = React.useState(false);
  const [ socket, setSocket ] = useState(null);

  // Use server id shape consistently
  // const activeChat = chats.find(c => c._id === activeChatId) || null;

  const [ messages, setMessages ] = useState([
    // {
    //   type: 'user',
    //   content: 'Hello, how can I help you today?'
    // },
    // {
    //   type: 'ai',
    //   content: 'Hi there! I need assistance with my account.'
    // }
  ]);

  const handleNewChat = async () => {
    // Prompt user for title of new chat, fallback to 'New Chat'
    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) return

    try {
      const response = await axios.post("http://localhost:3000/api/chat", {
        title
      }, {
        withCredentials: true
      })
      getMessages(response.data.chat._id);
      dispatch(startNewChat(response.data.chat));
      setSidebarOpen(false);
    } catch (err) {
      console.error('Failed to create chat', err);
      alert('Could not create chat. Please try again.');
    }
  }

  // Ensure at least one chat exists initially
  useEffect(() => {

    axios.get("http://localhost:3000/api/chat", { withCredentials: true })
      .then(response => {
        dispatch(setChats(response.data.chats.reverse()));
      })
      .catch(err => {
        console.error('Failed to load chats', err);
      })

    const tempSocket = io("http://localhost:3000", {
      withCredentials: true,
    })

    tempSocket.on("ai-response", (messagePayload) => {
      console.log("Received AI response:", messagePayload);

      setMessages((prevMessages) => [ ...prevMessages, {
        type: 'ai',
        content: messagePayload.content
      } ]);

      dispatch(sendingFinished());
    });

    setSocket(tempSocket);

    return () => {
      try { tempSocket?.disconnect(); } catch (err) {
        console.warn('Socket disconnect failed', err);
      }
    };

  }, [dispatch]);

  const sendMessage = async () => {

    const trimmed = input.trim();
    console.log("Sending message:", trimmed);
    if (!trimmed || !activeChatId || isSending) return;
    dispatch(sendingStarted());

    const newMessages = [ ...messages, {
      type: 'user',
      content: trimmed
    } ];

    console.log("New messages:", newMessages);

    setMessages(newMessages);
    dispatch(setInput(''));

    socket?.emit("ai-message", {
      chat: activeChatId,
      content: trimmed
    })

    // try {
    //   const reply = await fakeAIReply(trimmed);
    //   dispatch(addAIMessage(activeChatId, reply));
    // } catch {
    //   dispatch(addAIMessage(activeChatId, 'Error fetching AI response.', true));
    // } finally {
    //   dispatch(sendingFinished());
    // }
  }

  const getMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/chat/messages/${chatId}`, { withCredentials: true })
      setMessages(response.data.messages.map(m => ({
        type: m.role === 'user' ? 'user' : 'ai',
        content: m.content
      })));
    } catch (err) {
      console.error('Failed to fetch messages', err);
      setMessages([]);
    }
  }


return (
  <div className="chat-layout minimal">
    <ChatMobileBar
      onToggleSidebar={() => setSidebarOpen(o => !o)}
      onNewChat={handleNewChat}
    />
    <ChatSidebar
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={(id) => {
        dispatch(selectChat(id));
        setSidebarOpen(false);
        getMessages(id);
      }}
      onNewChat={handleNewChat}
      open={sidebarOpen}
    />
    <main className="chat-main" role="main">
      {messages.length === 0 && (
        <div className="chat-welcome" aria-hidden="true">
          <div className="chip">ChaturChokro Nu Prarambh</div>
          <h1>ChaturChokro</h1>
          <p>Poochho kai pan. Paste karo, vichar karo, ke jald samjuti lo. Tamaru chat sidebar ma rahe che, etle tame jetla vaar ichho tetla vaar vapas aavi shako.</p>
        </div>
      )}
      <ChatMessages messages={messages} isSending={isSending} />
      {
        activeChatId &&
        <ChatComposer
          input={input}
          setInput={(v) => dispatch(setInput(v))}
          onSend={sendMessage}
          isSending={isSending}
        />}
    </main>
    {sidebarOpen && (
      <button
        className="sidebar-backdrop"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />
    )}
  </div>
);
};

export default Home;
