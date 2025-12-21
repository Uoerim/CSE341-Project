import React, { useState, useEffect } from "react";
import "./mainNav.css";
import SearchBox from "../Global/searchBox/SearchBox";
import UserMenu from "../Global/UserMenu/UserMenu";

function MainNav({ onCreateClick, onHomeClick, searchBoxClick, onNotificationsClick, onAskClick, onChatClick, chatPanelOpen }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        fetchUnreadCount();
        fetchChatUnreadCount();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            fetchUnreadCount();
            fetchChatUnreadCount();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Refresh chat count when panel closes
    useEffect(() => {
        if (!chatPanelOpen) {
            fetchChatUnreadCount();
        }
    }, [chatPanelOpen]);

    const fetchUnreadCount = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${apiUrl}/notifications/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    };

    const fetchChatUnreadCount = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${apiUrl}/chats/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setChatUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error("Failed to fetch chat unread count:", error);
        }
    };

    return (
        <div className="main-nav">
            <img src="/logo-white.png" alt="Loopify" className="main-nav-logo"
             onClick={onHomeClick} style={{ cursor: "pointer"}}/>
            
            <div className="nav-search">
                <SearchBox onNavigate={searchBoxClick} onAskClick={onAskClick} />
            </div>
            
            <div className="nav-data">
                <button className="nav-chat-button" onClick={onChatClick}>
                    <svg viewBox="0 0 20 20">
                        <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2zm5.2-7.2a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zm-4 0a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zm-4 0a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"></path>
                    </svg>
                    {chatUnreadCount > 0 && <span className="chat-dot"></span>}
                </button>
                <button className="nav-create-button" onClick={onCreateClick}>
                    <svg rpl="" fill="currentColor" height="20" icon-name="add-square" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.7 2H5.3C3.481 2 2 3.48 2 5.3v9.4C2 16.519 3.48 18 5.3 18h9.4c1.819 0 3.3-1.48 3.3-3.3V5.3C18 3.481 16.52 2 14.7 2zm1.499 12.7a1.5 1.5 0 01-1.499 1.499H5.3A1.5 1.5 0 013.801 14.7V5.3A1.5 1.5 0 015.3 3.801h9.4A1.5 1.5 0 0116.199 5.3v9.4zM14 10.9h-3.1V14H9.1v-3.1H6V9.1h3.1V6h1.8v3.1H14v1.8z"></path>
                    </svg>
                    <span className="nav-create-text">Create</span>
                </button>
                <button className="nav-notifications-button" onClick={onNotificationsClick}>
                    <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.176 14.218l-.925-1.929a2.577 2.577 0 01-.25-1.105V8c0-3.86-3.142-7-7-7-3.86 0-7 3.14-7 7v3.184c0 .38-.088.762-.252 1.105l-.927 1.932A1.103 1.103 0 002.82 15.8h3.26A4.007 4.007 0 0010 19a4.008 4.008 0 003.918-3.2h3.26a1.1 1.1 0 00.934-.514 1.1 1.1 0 00.062-1.068h.002zM10 17.2c-.93 0-1.722-.583-2.043-1.4h4.087a2.197 2.197 0 01-2.043 1.4zM3.925 14l.447-.933c.28-.584.43-1.235.43-1.883V8c0-2.867 2.331-5.2 5.198-5.2A5.205 5.205 0 0115.2 8v3.184c0 .648.147 1.299.428 1.883l.447.933H3.925z"></path>
                    </svg>
                    {unreadCount > 0 && <span className="notification-dot"></span>}
                </button>

                {/* USER MENU COMPONENT */}
                <UserMenu />
                {/*                                         */}
            </div>
        </div>
    );
};

export default MainNav;
