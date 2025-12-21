import "./chatPanel.css";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function ChatPanel({ isOpen, onClose }) {
  const [view, setView] = useState("list"); // list, chat, search
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  // Initialize socket connection
  useEffect(() => {
    if (!userId || !isOpen) return;

    socketRef.current = io(SOCKET_URL, {
      withCredentials: true
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      socketRef.current.emit("user:join", userId);
    });

    socketRef.current.on("chat:message", (data) => {
      if (currentChat && data.chatId === currentChat._id) {
        setMessages(prev => [...prev, data.message]);
      }
      // Refresh chat list to update last message
      fetchChats();
    });

    socketRef.current.on("chat:typing", (data) => {
      if (currentChat && data.chatId === currentChat._id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, isOpen, currentChat]);

  // Fetch chats on mount
  useEffect(() => {
    if (isOpen) {
      fetchChats();
      fetchUnreadCount();
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_URL}/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_URL}/chats/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const openChat = async (chat) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chats/${chat._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCurrentChat({
        _id: data._id,
        participant: data.participant
      });
      setMessages(data.messages);
      setView("chat");
      fetchUnreadCount();
    } catch (error) {
      console.error("Failed to open chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const startChatWithUser = async (user) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chats/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCurrentChat({
        _id: data._id,
        participant: data.participant
      });
      setMessages(data.messages || []);
      setView("chat");
      setSearchQuery("");
      setSearchResults([]);
      fetchChats();
    } catch (error) {
      console.error("Failed to start chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch(`${API_URL}/chats/${currentChat._id}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: messageContent })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, data.message]);
      
      // Emit socket event
      if (socketRef.current) {
        socketRef.current.emit("chat:message", {
          recipientId: data.recipientId,
          message: data.message,
          chatId: currentChat._id
        });
      }
      
      fetchChats();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = () => {
    if (!socketRef.current || !currentChat) return;

    socketRef.current.emit("chat:typing", {
      recipientId: currentChat.participant._id,
      chatId: currentChat._id,
      isTyping: true
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("chat:typing", {
        recipientId: currentChat.participant._id,
        chatId: currentChat._id,
        isTyping: false
      });
    }, 1000);
  };

  const searchFriends = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/chats/search-friends?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to search friends:", error);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 86400000) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (diff < 604800000) {
      return d.toLocaleDateString([], { weekday: "short" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const goBack = () => {
    if (view === "chat" || view === "search") {
      setView("list");
      setCurrentChat(null);
      setMessages([]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-panel-header">
        {view === "list" ? (
          <>
            <div className="chat-panel-logo">
              <svg fill="#ff4500" height="20" width="20" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm5.7 11.3c-.1.5-.3.9-.6 1.3-.3.4-.7.7-1.2.9s-1 .3-1.7.3c-.5 0-1-.1-1.5-.2-.5-.2-.9-.4-1.3-.6l-.6.6c-.2.2-.4.2-.6 0l-.7-.7c-.2-.2-.2-.4 0-.6l.6-.6c-.3-.4-.5-.8-.6-1.3-.2-.5-.2-1-.2-1.5 0-.7.1-1.2.3-1.7s.5-.9.9-1.2c.4-.3.8-.5 1.3-.6.5-.1 1-.2 1.5-.2s1 .1 1.5.2c.5.1.9.3 1.3.6.4.3.7.7.9 1.2.2.5.3 1 .3 1.7 0 .5-.1 1-.2 1.5z" />
              </svg>
              <span>Chats</span>
            </div>
            <div className="chat-panel-actions">
              <button 
                className="chat-panel-btn"
                onClick={() => setView("search")}
                title="New chat"
              >
                <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
                  <path d="M19 10h-8V2a1 1 0 00-2 0v8H1a1 1 0 000 2h8v8a1 1 0 002 0v-8h8a1 1 0 000-2z" />
                </svg>
              </button>
              <button className="chat-panel-btn" title="Settings">
                <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4zm0-6a2 2 0 100-4 2 2 0 000 4zm0 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
              <button className="chat-panel-close" onClick={onClose}>
                <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
                  <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            <button className="chat-panel-back" onClick={goBack}>
              <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
                <path d="M12.793 2.293a1 1 0 011.414 1.414L7.414 10l6.793 6.293a1 1 0 01-1.414 1.414l-7.5-7a1 1 0 010-1.414l7.5-7z" />
              </svg>
              {view === "chat" ? "Threads" : "Back"}
            </button>
            <button className="chat-panel-close" onClick={onClose}>
              <svg fill="currentColor" height="18" width="18" viewBox="0 0 20 20">
                <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="chat-panel-content">
        {view === "list" && (
          <>
            {chats.length === 0 ? (
              <div className="chat-panel-empty">
                <div className="chat-empty-icon">
                  <img src="/character/char.png" alt="" />
                </div>
                <h3>Welcome to chat!</h3>
                <p>Start a direct or group chat with other users.</p>
                <button 
                  className="chat-start-btn"
                  onClick={() => setView("search")}
                >
                  <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                    <path d="M19 10h-8V2a1 1 0 00-2 0v8H1a1 1 0 000 2h8v8a1 1 0 002 0v-8h8a1 1 0 000-2z" />
                  </svg>
                  Start new chat
                </button>
              </div>
            ) : (
              <div className="chat-list">
                {chats.map(chat => (
                  <div 
                    key={chat._id} 
                    className={`chat-list-item ${chat.unreadCount > 0 ? "unread" : ""}`}
                    onClick={() => openChat(chat)}
                  >
                    <img 
                      src={`/character/${chat.participant?.avatar || "char"}.png`} 
                      alt="" 
                      className="chat-avatar"
                    />
                    <div className="chat-list-content">
                      <div className="chat-list-header">
                        <span className="chat-list-name">{chat.participant?.username}</span>
                        <span className="chat-list-time">
                          {chat.lastMessage?.createdAt && formatTime(chat.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="chat-list-preview">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="chat-unread-badge">{chat.unreadCount}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === "search" && (
          <div className="chat-search">
            <div className="chat-search-input-wrapper">
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                <path d="M19.5 18.616l-4.178-4.178a7.878 7.878 0 10-.884.884l4.178 4.178a.625.625 0 00.884-.884zM8.75 15a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z" />
              </svg>
              <input
                type="text"
                placeholder="Search friends to chat..."
                value={searchQuery}
                onChange={(e) => searchFriends(e.target.value)}
                autoFocus
              />
            </div>
            
            {searchResults.length > 0 ? (
              <div className="chat-search-results">
                {searchResults.map(user => (
                  <div 
                    key={user._id} 
                    className="chat-search-item"
                    onClick={() => startChatWithUser(user)}
                  >
                    <img 
                      src={`/character/${user.avatar || "char"}.png`} 
                      alt="" 
                      className="chat-avatar"
                    />
                    <span>{user.username}</span>
                  </div>
                ))}
              </div>
            ) : searchQuery && (
              <div className="chat-search-empty">
                <p>No friends found matching "{searchQuery}"</p>
                <p className="chat-search-hint">You can only chat with friends. Add friends from their profile page.</p>
              </div>
            )}
          </div>
        )}

        {view === "chat" && currentChat && (
          <div className="chat-conversation">
            <div className="chat-conversation-header">
              <img 
                src={`/character/${currentChat.participant?.avatar || "char"}.png`} 
                alt="" 
                className="chat-avatar-large"
              />
              <span>{currentChat.participant?.username}</span>
            </div>
            
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-messages-empty">
                  <p>No messages yet. Say hi! 👋</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div 
                    key={msg._id || index}
                    className={`chat-message ${msg.sender?._id === userId || msg.sender === userId ? "sent" : "received"}`}
                  >
                    <div className="chat-message-content">
                      {msg.content}
                    </div>
                    <span className="chat-message-time">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="chat-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="chat-send-btn"
              >
                <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                  <path d="M1.5 2.74a.5.5 0 01.7-.46l15.5 7a.5.5 0 010 .92l-15.5 7a.5.5 0 01-.7-.46V11.5L11 10 1.5 8.5V2.74z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
