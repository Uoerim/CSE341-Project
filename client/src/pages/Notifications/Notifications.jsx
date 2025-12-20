import "./notifications.css";
import { useEffect, useState } from "react";
import Spinner from "../../components/Global/Spinner/Spinner";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, invites, messages

  const token = localStorage.getItem("authToken");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${apiUrl}/notifications/mark-all-read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleRespondToInvite = async (notificationId, response) => {
    try {
      await fetch(`${apiUrl}/notifications/${notificationId}/respond`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ response })
      });
      // Update local state
      setNotifications(notifications.map(n => 
        n._id === notificationId 
          ? { ...n, status: response === "accept" ? "accepted" : "declined", read: true }
          : n
      ));
    } catch (error) {
      console.error("Failed to respond to invite:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await fetch(`${apiUrl}/notifications/${notificationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(`${apiUrl}/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "invites") return n.type === "mod_invite";
    if (filter === "messages") return n.type === "mod_message";
    return true;
  });

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now - notifDate;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notifDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="notifications-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-filters">
        <button 
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === "invites" ? "active" : ""}`}
          onClick={() => setFilter("invites")}
        >
          Mod Invites
        </button>
        <button 
          className={`filter-btn ${filter === "messages" ? "active" : ""}`}
          onClick={() => setFilter("messages")}
        >
          Messages
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <svg fill="currentColor" height="48" width="48" viewBox="0 0 20 20">
              <path d="M18.176 14.218l-.925-1.929a2.577 2.577 0 01-.25-1.105V8c0-3.86-3.142-7-7-7-3.86 0-7 3.14-7 7v3.184c0 .38-.088.762-.252 1.105l-.927 1.932A1.103 1.103 0 002.82 15.8h3.26A4.007 4.007 0 0010 19a4.008 4.008 0 003.918-3.2h3.26a1.1 1.1 0 00.934-.514 1.1 1.1 0 00.062-1.068z" />
            </svg>
            <p>No notifications yet</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-item ${!notification.read ? "unread" : ""}`}
              onClick={() => !notification.read && handleMarkAsRead(notification._id)}
            >
              <div className="notification-icon">
                {notification.type === "mod_invite" ? (
                  <svg fill="currentColor" height="24" width="24" viewBox="0 0 20 20">
                    <path d="M10 0L2 4v6c0 5.25 3.45 10 8 11 4.55-1 8-5.75 8-11V4l-8-4z" />
                  </svg>
                ) : (
                  <svg fill="currentColor" height="24" width="24" viewBox="0 0 20 20">
                    <path d="M18 4H2a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1zm-1 10H3V6.5l7 4.5 7-4.5V14z" />
                  </svg>
                )}
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-sender">
                    <img 
                      src={`/character/${notification.sender?.avatar || "char"}.png`} 
                      alt="" 
                      className="sender-avatar"
                    />
                    <span className="sender-name">{notification.sender?.username}</span>
                    {notification.community && (
                      <span className="community-name">in r/{notification.community?.name}</span>
                    )}
                  </div>
                  <span className="notification-time">{formatTime(notification.createdAt)}</span>
                </div>

                <p className="notification-message">{notification.message}</p>

                {notification.type === "mod_invite" && notification.status === "pending" && (
                  <div className="notification-actions">
                    <button 
                      className="accept-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRespondToInvite(notification._id, "accept");
                      }}
                    >
                      Accept
                    </button>
                    <button 
                      className="decline-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRespondToInvite(notification._id, "decline");
                      }}
                    >
                      Decline
                    </button>
                  </div>
                )}

                {notification.type === "mod_invite" && notification.status !== "pending" && (
                  <div className={`invite-status ${notification.status}`}>
                    {notification.status === "accepted" ? "✓ Accepted" : "✗ Declined"}
                  </div>
                )}
              </div>

              <button 
                className="delete-notification-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notification._id);
                }}
              >
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
