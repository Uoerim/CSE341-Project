import "./communityPage.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../utils/api";
import Post from "../../components/Post/Post";
import Spinner from "../../components/Global/Spinner/Spinner";
import { addRecentCommunity } from "../../utils/recentsService";

export default function CommunityPage({ communityName: propName, embedded = false, onPostClick }) {
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editName, setEditName] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [editRules, setEditRules] = useState([]);
  const [showMessageModModal, setShowMessageModModal] = useState(false);
  const [modMessage, setModMessage] = useState("");
  const [showInviteModModal, setShowInviteModModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  
  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!propName) return;

    setNotFound(false);
    setLoading(true);

    // Fetch community data
    apiGet(`/communities/r/${propName}`)
      .then((data) => {
        setCommunity(data);
        setMemberCount(data.members?.length || 0);
        setEditDescription(data.description || "");
        setEditName(data.name || "");
        setEditRules(data.rules || []);
        
        // Add to recent items
        addRecentCommunity(data);
        
        // Check if current user is owner
        const creatorId = data.creator?._id || data.creator;
        setIsOwner(creatorId === currentUserId);
        
        // Check if current user is a moderator
        setIsMod(data.moderators?.some(m => (m._id || m) === currentUserId) || false);
        
        // Check if current user is a member
        setIsMember(data.members?.some(m => (m._id || m) === currentUserId) || false);
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 404) {
          setNotFound(true);
        }
      });

    // Fetch community posts
    apiGet(`/communities/r/${propName}/posts`)
      .then((data) => {
        setPosts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [propName, currentUserId]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${apiUrl}/communities/${community._id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMembers(data.members || []);
      setModerators(data.moderators || []);
      setBannedUsers(data.bannedUsers || []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const handleJoinLeave = async () => {
    try {
      const endpoint = isMember 
        ? `/communities/${community._id}/leave`
        : `/communities/${community._id}/join`;
      
      await apiGet(endpoint);
      setIsMember(!isMember);
      setMemberCount(prev => isMember ? prev - 1 : prev + 1);
    } catch (error) {
      console.error("Failed to join/leave community:", error);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await fetch(`${apiUrl}/communities/${community._id}/members`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      setMembers(members.filter(m => m._id !== userId));
      setMemberCount(prev => prev - 1);
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await fetch(`${apiUrl}/communities/${community._id}/ban`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      // Move user from members to banned
      const user = members.find(m => m._id === userId);
      if (user) {
        setMembers(members.filter(m => m._id !== userId));
        setBannedUsers([...bannedUsers, user]);
        setMemberCount(prev => prev - 1);
      }
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await fetch(`${apiUrl}/communities/${community._id}/unban`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      setBannedUsers(bannedUsers.filter(u => u._id !== userId));
    } catch (error) {
      console.error("Failed to unban user:", error);
    }
  };

  const handleAddModerator = async (userId) => {
    try {
      await fetch(`${apiUrl}/communities/${community._id}/moderators`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const user = members.find(m => m._id === userId);
      if (user) {
        setModerators([...moderators, user]);
      }
    } catch (error) {
      console.error("Failed to add moderator:", error);
    }
  };

  const handleRemoveModerator = async (userId) => {
    try {
      await fetch(`${apiUrl}/communities/${community._id}/moderators`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      setModerators(moderators.filter(m => m._id !== userId));
    } catch (error) {
      console.error("Failed to remove moderator:", error);
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      await fetch(`${apiUrl}/communities/${community._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/app');
    } catch (error) {
      console.error("Failed to delete community:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await fetch(`${apiUrl}/communities/${community._id}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(p => p._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const updateData = { description: editDescription };
      if (isOwner) {
        updateData.name = editName;
      }
      
      const res = await fetch(`${apiUrl}/communities/${community._id}/settings`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Failed to update settings");
        return;
      }
      
      const updatedCommunity = await res.json();
      setCommunity(updatedCommunity);
      setShowSettingsModal(false);
      
      // If name changed, navigate to new URL
      if (isOwner && editName !== community.name) {
        navigate(`/app?r=${editName}`, { replace: true });
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleUpdateRules = async () => {
    try {
      await fetch(`${apiUrl}/communities/${community._id}/settings`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rules: editRules })
      });
      setCommunity({ ...community, rules: editRules });
      setShowGuideModal(false);
    } catch (error) {
      console.error("Failed to update rules:", error);
    }
  };

  const handleSendModMessage = async () => {
    if (!modMessage.trim()) return;
    
    try {
      await fetch(`${apiUrl}/notifications/mod-message`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          communityId: community._id,
          message: modMessage 
        })
      });
      setModMessage("");
      setShowMessageModModal(false);
      alert("Message sent to moderators!");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleInviteMod = async (userId) => {
    try {
      await fetch(`${apiUrl}/notifications/mod-invite`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          communityId: community._id,
          userId 
        })
      });
      alert("Moderator invitation sent!");
      setShowInviteModModal(false);
      setInviteSearch("");
    } catch (error) {
      console.error("Failed to invite moderator:", error);
      alert("Failed to send invite. User may already have a pending invite.");
    }
  };

  const addRule = () => {
    setEditRules([...editRules, { title: "", description: "" }]);
  };

  const updateRule = (index, field, value) => {
    const newRules = [...editRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setEditRules(newRules);
  };

  const removeRule = (index) => {
    setEditRules(editRules.filter((_, i) => i !== index));
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadRes = await fetch(`${apiUrl}/uploads/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await uploadRes.json();
      // Construct full URL from the relative path returned by backend
      const fullUrl = `${apiUrl}${data.url.replace('/api', '')}`;
      
      await fetch(`${apiUrl}/communities/${community._id}/settings`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ icon: fullUrl })
      });
      setCommunity({ ...community, icon: fullUrl });
    } catch (error) {
      console.error("Failed to upload icon:", error);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadRes = await fetch(`${apiUrl}/uploads/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await uploadRes.json();
      // Construct full URL from the relative path returned by backend
      const fullUrl = `${apiUrl}${data.url.replace('/api', '')}`;
      
      await fetch(`${apiUrl}/communities/${community._id}/settings`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ banner: fullUrl })
      });
      setCommunity({ ...community, banner: fullUrl });
    } catch (error) {
      console.error("Failed to upload banner:", error);
    }
  };

  const handlePostClick = (postId) => {
    if (onPostClick) {
      onPostClick(postId);
    }
  };

  const openMembersModal = () => {
    fetchMembers();
    setShowMembersModal(true);
  };

  if (notFound) {
    return (
      <div className="community-page-not-found">
        <div className="community-page-not-found-content">
          <svg className="community-page-not-found-icon" fill="currentColor" height="80" width="80" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13a1 1 0 012 0v6a1 1 0 01-2 0V5zm1 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
          </svg>
          <h2>Community Not Found</h2>
          <p>The community r/{propName} does not exist or has been removed.</p>
          <button className="community-page-not-found-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading || !community) {
    return (
      <div className="community-page-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="community-page">
      {/* Banner with edit option for owner */}
      <div className="community-page-banner">
        {community.banner && (
          <>
            <img src={community.banner} alt="" className="banner-blur-bg" />
            <img src={community.banner} alt="" className="banner-main-img" />
          </>
        )}
        {(isOwner || isMod) && (
          <button className="banner-edit-btn" onClick={() => bannerInputRef.current?.click()}>
            <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 4v12h12v-6l2-2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h8l-2 2H4z"></path>
            </svg>
          </button>
        )}
        <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} accept="image/*" hidden />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="community-page-layout">
        {/* Left - Posts Section */}
        <main className="community-page-main">
          {/* Community Title Header */}
          <div className="community-page-title-section">
            <div className="community-page-icon-wrapper">
              <div className="community-page-icon">
                {community.icon ? (
                  <img src={community.icon} alt="" className="icon-main-img" />
                ) : (
                  <div className="community-page-icon-placeholder">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806v6.527c-2.966-.076-5.556-2.66-5.556-5.951a5.81 5.81 0 0 1 9.489-4.488l-3.733 3.107Zm2.024 3.227 3.733-3.107a5.754 5.754 0 0 1 .49 2.262c0 3.275-2.554 5.875-5.463 5.951V9.561a1.616 1.616 0 0 0-.76-2.701Z" />
                    </svg>
                  </div>
                )}
              </div>
              {(isOwner || isMod) && (
                <button className="icon-edit-btn" onClick={() => iconInputRef.current?.click()}>
                  <svg fill="currentColor" height="12" width="12" viewBox="0 0 20 20">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 4v12h12v-6l2-2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h8l-2 2H4z"></path>
                  </svg>
                </button>
              )}
              <input type="file" ref={iconInputRef} onChange={handleIconUpload} accept="image/*" hidden />
            </div>
            <div className="community-page-title-info">
              <h1 className="community-page-name">{community.name}</h1>
              <span className="community-page-handle">r/{community.name}</span>
            </div>
            <div className="community-page-title-actions">
              {isOwner ? (
                <button className="community-mod-btn">
                  <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                    <path d="M10 0L2 4v6c0 5.25 3.45 10 8 11 4.55-1 8-5.75 8-11V4l-8-4zm0 17.93c-3.62-1.02-6-4.88-6-8.93V5.25l6-3 6 3v3.75c0 4.05-2.38 7.91-6 8.93z"></path>
                  </svg>
                  Mod
                </button>
              ) : isMember ? (
                <button className="community-joined-btn" onClick={handleJoinLeave}>
                  Joined ▾
                </button>
              ) : (
                <button className="community-join-btn" onClick={handleJoinLeave}>
                  Join
                </button>
              )}
            </div>
          </div>

          {/* Posts */}
          <section className="community-page-posts">
            {posts.length === 0 ? (
              <div className="community-page-empty-state">
                <h2>No posts yet</h2>
                <p>Be the first to post in this community!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="community-post-wrapper">
                  <Post post={post} onPostClick={handlePostClick} />
                  {(isOwner || isMod) && (
                    <button 
                      className="delete-post-btn"
                      onClick={() => handleDeletePost(post._id)}
                      title="Delete post"
                    >
                      <svg fill="currentColor" height="14" width="14" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v11a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 5a1 1 0 112 0v7a1 1 0 11-2 0V7zm4 0a1 1 0 112 0v7a1 1 0 11-2 0V7z"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </section>
        </main>

        {/* Right - Sidebar */}
        <aside className="community-page-sidebar">
          {/* About Card */}
          <div className="community-sidebar-card">
            <div className="sidebar-card-header">
              <h3>{community.name}</h3>
              {(isOwner || isMod) && (
                <button className="sidebar-edit-btn" onClick={() => setShowSettingsModal(true)}>
                  <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 4v12h12v-6l2-2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h8l-2 2H4z"></path>
                  </svg>
                </button>
              )}
            </div>
            <p className="sidebar-description">{community.description || "No description yet."}</p>
            
            <div className="sidebar-meta">
              <div className="sidebar-meta-item">
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0 4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"></path>
                </svg>
                <span>Created {new Date(community.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="sidebar-meta-item">
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z"></path>
                </svg>
                <span>{community.type === 'public' ? 'Public' : community.type}</span>
              </div>
              <div 
                className={`sidebar-meta-item ${(isOwner || isMod) ? 'clickable' : ''}`}
                onClick={(isOwner || isMod) ? openMembersModal : undefined}
                title={(isOwner || isMod) ? 'Click to manage members' : ''}
              >
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M10 8a2 2 0 100-4 2 2 0 000 4zm0 1a5.01 5.01 0 00-4.9 4H2v2h16v-2h-3.1A5.01 5.01 0 0010 9z"></path>
                </svg>
                <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                {(isOwner || isMod) && (
                  <svg className="expand-icon" fill="currentColor" height="12" width="12" viewBox="0 0 20 20">
                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                  </svg>
                )}
              </div>
            </div>

            {(isOwner || isMod) && (
              <button className="sidebar-guide-btn" onClick={() => setShowGuideModal(true)}>
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 100 20 10 10 0 000-20zM9 5a1 1 0 012 0v6a1 1 0 01-2 0V5zm1 10a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"></path>
                </svg>
                {community.rules?.length ? 'Edit Community Rules' : 'Add Community Rules'}
              </button>
            )}

            {/* Community Rules */}
            {community.rules && community.rules.length > 0 && (
              <div className="sidebar-rules">
                <h4>Community Rules</h4>
                <ol className="rules-list">
                  {community.rules.map((rule, index) => (
                    <li key={index} className="rule-item">
                      <span className="rule-title">{rule.title}</span>
                      {rule.description && <p className="rule-description">{rule.description}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Moderators Card */}
          <div className="community-sidebar-card">
            <h3 className="sidebar-card-title">MODERATORS</h3>
            
            <button className="message-mods-btn" onClick={() => setShowMessageModModal(true)}>
              <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                <path d="M18 4H2a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1zm-1 10H3V6.5l7 4.5 7-4.5V14z"></path>
              </svg>
              Message Mods
            </button>

            {isOwner && (
              <button className="invite-mod-btn" onClick={() => {
                fetchMembers();
                setShowInviteModModal(true);
              }}>
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm5 11h-4v4H9v-4H5V9h4V5h2v4h4v2z"></path>
                </svg>
                Invite Mod
              </button>
            )}

            {(isOwner || isMod) && (
              <button className="manage-members-btn" onClick={openMembersModal}>
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M15 12.05c1.08 0 1.95.87 1.95 1.95s-.87 1.95-1.95 1.95-1.95-.87-1.95-1.95.87-1.95 1.95-1.95zm0-1.8c-2.07 0-3.75 1.68-3.75 3.75 0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75zM5 12.05c1.08 0 1.95.87 1.95 1.95S6.08 15.95 5 15.95 3.05 15.08 3.05 14s.87-1.95 1.95-1.95zm0-1.8c-2.07 0-3.75 1.68-3.75 3.75 0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75zM10 4.05c1.08 0 1.95.87 1.95 1.95S11.08 7.95 10 7.95 8.05 7.08 8.05 6 8.92 4.05 10 4.05zm0-1.8C7.93 2.25 6.25 3.93 6.25 6c0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75z"></path>
                </svg>
                Manage Members
              </button>
            )}

            {isOwner && (
              <button className="delete-community-btn" onClick={() => setShowDeleteConfirm(true)}>
                <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v11a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6z"></path>
                </svg>
                Delete Community
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Members Modal */}
      {showMembersModal && (
        <div className="modal-overlay" onClick={() => setShowMembersModal(false)}>
          <div className="members-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Community Members</h2>
              <button className="modal-close-btn" onClick={() => setShowMembersModal(false)}>×</button>
            </div>
            
            <div className="modal-tabs">
              <button 
                className={`modal-tab ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                Members ({members.length})
              </button>
              <button 
                className={`modal-tab ${activeTab === 'moderators' ? 'active' : ''}`}
                onClick={() => setActiveTab('moderators')}
              >
                Moderators ({moderators.length})
              </button>
              <button 
                className={`modal-tab ${activeTab === 'banned' ? 'active' : ''}`}
                onClick={() => setActiveTab('banned')}
              >
                Banned ({bannedUsers.length})
              </button>
            </div>

            <div className="modal-content">
              {activeTab === 'members' && (
                <div className="members-list">
                  {members.map(member => (
                    <div key={member._id} className="member-item">
                      <img 
                        src={`/character/${member.avatar || 'char'}.png`} 
                        alt="" 
                        className="member-avatar"
                      />
                      <span className="member-name">{member.username}</span>
                      {(isOwner || isMod) && member._id !== currentUserId && (
                        <div className="member-actions">
                          {isOwner && (
                            <button onClick={() => handleAddModerator(member._id)} title="Make Moderator">
                              <svg fill="currentColor" height="14" width="14" viewBox="0 0 20 20">
                                <path d="M10 0L2 4v6c0 5.25 3.45 10 8 11 4.55-1 8-5.75 8-11V4l-8-4z"></path>
                              </svg>
                            </button>
                          )}
                          <button onClick={() => handleBanUser(member._id)} title="Ban User">
                            <svg fill="currentColor" height="14" width="14" viewBox="0 0 20 20">
                              <path d="M10 0a10 10 0 100 20 10 10 0 000-20zM2 10a8 8 0 0112.9-6.3L4.7 13.9A7.9 7.9 0 012 10zm8 8a7.9 7.9 0 01-3.9-1L16.3 6.1A8 8 0 0110 18z"></path>
                            </svg>
                          </button>
                          <button onClick={() => handleRemoveMember(member._id)} title="Remove">
                            <svg fill="currentColor" height="14" width="14" viewBox="0 0 20 20">
                              <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm4 11H6V9h8v2z"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {members.length === 0 && <p className="empty-list">No members yet</p>}
                </div>
              )}

              {activeTab === 'moderators' && (
                <div className="members-list">
                  {moderators.map(mod => (
                    <div key={mod._id} className="member-item">
                      <img 
                        src={`/character/${mod.avatar || 'char'}.png`} 
                        alt="" 
                        className="member-avatar"
                      />
                      <span className="member-name">{mod.username}</span>
                      <span className="mod-badge">MOD</span>
                      {isOwner && mod._id !== currentUserId && (
                        <button 
                          className="remove-mod-btn"
                          onClick={() => handleRemoveModerator(mod._id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {moderators.length === 0 && <p className="empty-list">No moderators yet</p>}
                </div>
              )}

              {activeTab === 'banned' && (
                <div className="members-list">
                  {bannedUsers.map(user => (
                    <div key={user._id} className="member-item">
                      <img 
                        src={`/character/${user.avatar || 'char'}.png`} 
                        alt="" 
                        className="member-avatar"
                      />
                      <span className="member-name">{user.username}</span>
                      <span className="banned-badge">BANNED</span>
                      {(isOwner || isMod) && (
                        <button 
                          className="unban-btn"
                          onClick={() => handleUnbanUser(user._id)}
                        >
                          Unban
                        </button>
                      )}
                    </div>
                  ))}
                  {bannedUsers.length === 0 && <p className="empty-list">No banned users</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Community Settings</h2>
              <button className="modal-close-btn" onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <div className="modal-content">
              {isOwner && (
                <>
                  <label>Community Name</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Community name"
                    className="settings-input"
                  />
                </>
              )}
              <label>Description</label>
              <textarea 
                className="settings-input"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Describe your community..."
                rows={4}
              />
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowSettingsModal(false)}>Cancel</button>
                <button className="save-btn" onClick={handleUpdateSettings}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <h2>Delete Community?</h2>
            <p>This action cannot be undone. All posts will be permanently deleted.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="delete-btn" onClick={handleDeleteCommunity}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Community Rules/Guide Modal */}
      {showGuideModal && (
        <div className="modal-overlay" onClick={() => setShowGuideModal(false)}>
          <div className="settings-modal rules-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Community Rules</h2>
              <button className="modal-close-btn" onClick={() => setShowGuideModal(false)}>×</button>
            </div>
            <div className="modal-content">
              {editRules.map((rule, index) => (
                <div key={index} className="rule-edit-item">
                  <div className="rule-edit-header">
                    <span className="rule-number">{index + 1}.</span>
                    <button className="rule-remove-btn" onClick={() => removeRule(index)}>×</button>
                  </div>
                  <input 
                    type="text"
                    value={rule.title}
                    onChange={(e) => updateRule(index, 'title', e.target.value)}
                    placeholder="Rule title"
                    className="settings-input"
                  />
                  <textarea 
                    value={rule.description}
                    onChange={(e) => updateRule(index, 'description', e.target.value)}
                    placeholder="Rule description (optional)"
                    rows={2}
                  />
                </div>
              ))}
              <button className="add-rule-btn" onClick={addRule}>
                <svg fill="currentColor" height="14" width="14" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm5 11h-4v4H9v-4H5V9h4V5h2v4h4v2z"></path>
                </svg>
                Add Rule
              </button>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowGuideModal(false)}>Cancel</button>
                <button className="save-btn" onClick={handleUpdateRules}>Save Rules</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Mods Modal */}
      {showMessageModModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModModal(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message Moderators</h2>
              <button className="modal-close-btn" onClick={() => setShowMessageModModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <label>Your Message</label>
              <textarea 
                value={modMessage}
                onChange={(e) => setModMessage(e.target.value)}
                placeholder="Write your message to the moderators..."
                rows={5}
              />
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowMessageModModal(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSendModMessage}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Mod Modal */}
      {showInviteModModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModModal(false)}>
          <div className="members-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invite Moderator</h2>
              <button className="modal-close-btn" onClick={() => setShowInviteModModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <input 
                type="text"
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                placeholder="Search members..."
                className="settings-input search-input"
              />
              <p className="invite-hint">Select a member to invite as moderator:</p>
              <div className="members-list">
                {members
                  .filter(m => {
                    const isNotMod = !moderators.some(mod => mod._id === m._id);
                    const isNotOwner = m._id !== (community.creator?._id || community.creator);
                    const matchesSearch = m.username.toLowerCase().includes(inviteSearch.toLowerCase());
                    return isNotMod && isNotOwner && matchesSearch;
                  })
                  .map(member => (
                    <div key={member._id} className="member-item">
                      <img 
                        src={`/character/${member.avatar || 'char'}.png`} 
                        alt="" 
                        className="member-avatar"
                      />
                      <span className="member-name">{member.username}</span>
                      <button 
                        className="invite-user-btn"
                        onClick={() => handleInviteMod(member._id)}
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                {members.filter(m => {
                  const isNotMod = !moderators.some(mod => mod._id === m._id);
                  const isNotOwner = m._id !== (community.creator?._id || community.creator);
                  const matchesSearch = m.username.toLowerCase().includes(inviteSearch.toLowerCase());
                  return isNotMod && isNotOwner && matchesSearch;
                }).length === 0 && (
                  <p className="empty-list">No eligible members found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
