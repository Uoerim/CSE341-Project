import React, { useState, useEffect } from "react";
import "./mainSidePanel.css";
import CreateCommunityModal from "../Global/CreateCommunityModal/CreateCommunityModal";
import FlappyBirdModal from "../Global/FlappyBirdModal/FlappyBirdModal";
import { getMyCommunities } from "../../services/userService";
import { getToken } from "../../services/tokenService";

function MainSidePanel({ onToggle, onPageChange, currentPage, isViewingPost }) {
    const [isPanelShifted, setIsPanelShifted] = useState(false);
    const [showCommunityModal, setShowCommunityModal] = useState(false);
    const [showFlappyBird, setShowFlappyBird] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const [wasAutoUnshifted, setWasAutoUnshifted] = useState(false);
    const [isGamesExpanded, setIsGamesExpanded] = useState(false);
    const [isCommunitiesExpanded, setIsCommunitiesExpanded] = useState(true);
    const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
    const [communities, setCommunities] = useState([]);
    const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);

    // Fetch user's communities
    useEffect(() => {
        const fetchCommunities = async () => {
            const token = getToken();
            if (!token) return;

            setIsLoadingCommunities(true);
            try {
                const data = await getMyCommunities();
                setCommunities(data);
            } catch (error) {
                console.error("Failed to fetch communities:", error);
            } finally {
                setIsLoadingCommunities(false);
            }
        };

        fetchCommunities();
    }, [showCommunityModal]); // Refetch when modal closes (new community might be created)

    const handleExpandClick = () => {
        console.log("Expand button clicked");
        const newState = !isPanelShifted;
        setIsPanelShifted(newState);
        setIsManuallyToggled(true);
        setWasAutoUnshifted(false);
        onToggle(newState);
    };

    const handleMouseEnter = (e) => {
        // Don't auto-expand if hovering over the button
        if (e.target.closest('.main-exp-btn')) {
            return;
        }
        if (isPanelShifted && !isManuallyToggled) {
            setIsPanelShifted(false);
            setWasAutoUnshifted(true);
            onToggle(false);
        }
    };

    const handleMouseLeave = () => {
        if (wasAutoUnshifted) {
            setIsPanelShifted(true);
            setWasAutoUnshifted(false);
            onToggle(true);
        } else {
            setIsManuallyToggled(false);
        }
    };

    const handleCreateCommunityClick = () => {
        setShowCommunityModal(true);
    };

    const handleCommunityCreated = (community) => {
        console.log("Community created:", community);
        // Could add logic to navigate to the new community or refresh communities list
    };

    return (
        <>
            <button
                className="main-exp-btn"
                onClick={handleExpandClick}
                style={{
                    transform: isPanelShifted ? "translateX(-236px)" : "translateX(0)",
                    transition: "transform 0.3s ease"
                }}
            >
                <svg rpl="" fill="currentColor" height="16" icon-name="menu" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.1 4.801H2.9a.9.9 0 010-1.8h14.199a.9.9 0 01.001 1.8zM18 10a.9.9 0 00-.9-.9H2.9a.9.9 0 000 1.8h14.199A.9.9 0 0018 10zm0 6.1a.9.9 0 00-.9-.9H2.9a.9.9 0 000 1.8h14.199a.9.9 0 00.901-.9z"></path>
                </svg>
            </button>
            <div
                className={`main-side-panel ${isPanelShifted ? 'shifted' : ''}`}
                style={{ transform: isPanelShifted ? "translateX(-236px)" : "translateX(0)", transition: "transform 0.3s ease" }}
            >
                <div className="side-panel-scrollable" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className="side-menu">
                        <button className={`side-menu-item ${currentPage === "home" && !isViewingPost ? "active" : ""}`} onClick={() => onPageChange("home")}>
                            <svg rpl="" fill="currentColor" height="20" icon-name="home" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"> <path d="M17.877 8.525a1.584 1.584 0 00-.35-.52l-6.395-6.352a1.602 1.602 0 00-1.13-.467h-.003a1.6 1.6 0 00-1.13.467L2.473 8.005A1.604 1.604 0 002 9.14v6.374a3.3 3.3 0 003.3 3.3h9.4a3.3 3.3 0 003.3-3.3V9.14c0-.211-.042-.42-.123-.615zM16.2 15.514c0 .827-.673 1.5-1.5 1.5H11v-5.575H9v5.575H5.3c-.827 0-1.5-.673-1.5-1.5v-6.29L10 3.066l6.2 6.158v6.29z"></path></svg>
                            <span>Home</span>
                        </button>
                        <button className={`side-menu-item ${currentPage === "popular" && !isViewingPost ? "active" : ""}`} onClick={() => onPageChange("popular")}>
                            <svg rpl="" className="rpl-rtl-icon" fill="currentColor" height="20" icon-name="popular" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 1a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm0 16.2c-1.66 0-3.186-.57-4.405-1.517l6.476-6.477V13h1.801V7.028a.9.9 0 00-.9-.9h-5.94v1.801h3.771l-6.481 6.482a7.154 7.154 0 01-1.521-4.41c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2L10 17.2z"></path></svg>
                            <span>Popular</span>
                        </button>
                        <button className={`side-menu-item ${currentPage === "explore" && !isViewingPost ? "active" : ""}`} onClick={() => onPageChange("explore")}>
                            <svg rpl="" fill="currentColor" height="20" icon-name="communities" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M15 12.05c1.08 0 1.95.87 1.95 1.95s-.87 1.95-1.95 1.95-1.95-.87-1.95-1.95.87-1.95 1.95-1.95zm0-1.8c-2.07 0-3.75 1.68-3.75 3.75 0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75zM5 12.05c1.08 0 1.95.87 1.95 1.95S6.08 15.95 5 15.95 3.05 15.08 3.05 14s.87-1.95 1.95-1.95zm0-1.8c-2.07 0-3.75 1.68-3.75 3.75 0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75zM10 4.05c1.08 0 1.95.87 1.95 1.95S11.08 7.95 10 7.95 8.05 7.08 8.05 6 8.92 4.05 10 4.05zm0-1.8C7.93 2.25 6.25 3.93 6.25 6c0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75z"></path> </svg>
                            <span>Explore</span>
                        </button>
                        <button className="side-menu-item side-menu-create" onClick={handleCreateCommunityClick}>
                            <svg rpl="" fill="currentColor" height="20" icon-name="add" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.1 9.1h-6.2V2.9c0-.5-.4-.9-.9-.9s-.9.4-.9.9v6.2H2.9c-.5 0-.9.4-.9.9s.4.9.9.9h6.2v6.2c0 .5.4.9.9.9s.9-.4.9-.9v-6.2h6.2c.5 0 .9-.4.9-.9s-.4-.9-.9-.9z"></path>
                            </svg>
                            <span>Start a community</span>
                        </button>
                    </div>
                    <div className="side-sections">
                        <hr />
                        <div className="side-section">
                            <div className="side-section-title" onClick={() => setIsGamesExpanded(!isGamesExpanded)}>
                                <span>GAMES ON LOOPIFY</span>
                                <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg" style={{ transform: isGamesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                                </svg>
                            </div>
                            {isGamesExpanded && (
                                <div className="side-section-items">
                                    <a href="#" className="side-section-item featured-game highlighted-game" onClick={(e) => { e.preventDefault(); setShowFlappyBird(true); }}>
                                        <span className="game-main-content">
                                            <span className="game-icon-wrapper">
                                                <span className="game-icon-inner">
                                                    <span className="game-avatar">
                                                        <span className="game-avatar-circle flappy-bird-icon-circle">
                                                            🐦
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="game-text-content">
                                                <h3 className="game-title">Loopify Bird</h3>
                                                <p className="game-subtitle">Flappy clone</p>
                                                <p className="game-player-count">∞ attempts</p>
                                            </span>
                                        </span>
                                        <span className="game-right-content">
                                            <span className="game-right-inner">
                                                <span className="game-play-badge">PLAY</span>
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            )}
                        </div>
                        <hr />
                        <div className="side-section">
                            <div className="side-section-title">
                                <span>CUSTOM FEEDS</span>
                                <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                                </svg>
                            </div>
                        </div>
                        <hr />
                        <div className="side-section">
                            <div className="side-section-title">
                                <span>RECENT</span>
                                <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                                </svg>
                            </div>
                        </div>
                        <hr />
                        <div className="side-section">
                            <div className="side-section-title" onClick={() => setIsCommunitiesExpanded(!isCommunitiesExpanded)}>
                                <span>COMMUNITIES</span>
                                <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg" style={{ transform: isCommunitiesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                                </svg>
                            </div>
                            {isCommunitiesExpanded && (
                                <div className="side-section-items communities-list">
                                    {isLoadingCommunities ? (
                                        <div className="communities-loading">
                                            <span>Loading...</span>
                                        </div>
                                    ) : communities.length === 0 ? (
                                        <div className="communities-empty">
                                            <span>No communities yet</span>
                                            <button className="join-community-btn" onClick={handleCreateCommunityClick}>
                                                Create or join a community
                                            </button>
                                        </div>
                                    ) : (
                                        communities.map((community) => (
                                            <button
                                                key={community._id}
                                                className="side-section-item community-item"
                                                onClick={() => onPageChange(`community/${community.name}`)}
                                            >
                                                <span className="community-icon">
                                                    {community.icon ? (
                                                        <img src={community.icon} alt={community.name} />
                                                    ) : (
                                                        <div className="community-icon-placeholder">
                                                            {community.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </span>
                                                <span className="community-info">
                                                    <span className="community-name">r/{community.name}</span>
                                                </span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        <hr />
                        <div className="side-section">
                            <div className="side-section-title" onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}>
                                <span>RESOURCES</span>
                                <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg" style={{ transform: isResourcesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                                </svg>
                            </div>
                            {isResourcesExpanded && (
                                <div className="side-section-items resources-list">
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.012 6.507v-.002c-.662 0-1.272.24-1.76.643-1.202-.8-2.7-1.31-4.333-1.455.048-.704.259-1.227.664-1.568.403-.34.967-.485 1.493-.534.329.429.84.71 1.423.71a1.8 1.8 0 10-1.664-2.484c-.785.08-1.675.315-2.403.923-.82.686-1.244 1.688-1.305 2.95-1.65.142-3.161.657-4.374 1.465a2.75 2.75 0 00-1.766-.648C1.393 6.506.1 7.896.1 9.61c0 1.244.68 2.316 1.663 2.812.095 3.604 3.749 6.504 8.244 6.504 4.495 0 8.153-2.903 8.244-6.51.975-.5 1.649-1.567 1.649-2.804 0-1.715-1.293-3.105-2.888-3.105v-.001zm-.534 4.793l-.027 1.07c-.066 2.622-2.957 4.755-6.444 4.755s-6.375-2.131-6.444-4.751l-.03-1.075-.96-.484c-.41-.206-.673-.68-.673-1.204 0-.72.488-1.305 1.088-1.305.278 0 .487.126.614.232l1.032.859 1.118-.745C6.79 7.959 8.07 7.547 9.455 7.458l.993-.013c1.419.074 2.735.489 3.807 1.202l1.114.74 1.03-.852a.97.97 0 01.55-.228h.062c.6 0 1.088.585 1.088 1.305 0 .522-.263.994-.67 1.202l-.951.486z"></path>
                                        </svg>
                                        <span>About Loopify</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.128 1.226a1.64 1.64 0 00-1.688.074l-.491.327C13.383 2.675 11.239 4.11 9.1 4.11H6.391A4.395 4.395 0 002 8.5c0 1.62.892 3.021 2.2 3.782v3.768c0 1.599 1.301 2.9 2.9 2.9s2.9-1.301 2.9-2.9v-3.074c1.83.316 3.603 1.497 4.949 2.398l.491.327a1.639 1.639 0 001.688.073c.538-.29.872-.849.872-1.458V2.684c0-.61-.334-1.169-.872-1.458zM6.391 5.91h1.81v5.181h-1.81A2.593 2.593 0 013.8 8.501 2.594 2.594 0 016.391 5.91zM7.1 17.15c-.606 0-1.1-.494-1.1-1.1v-3.199c.131.012.257.039.391.039h1.81v3.16c0 .606-.495 1.1-1.101 1.1zm9.1-3.106l-.25-.166c-1.559-1.043-3.628-2.429-5.95-2.729V5.851c2.322-.3 4.392-1.686 5.95-2.729l.25-.166v11.088z"></path>
                                        </svg>
                                        <span>Advertise</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.59 4.294L11.648 1.44a3.303 3.303 0 00-3.295 0L3.41 4.294a3.303 3.303 0 00-1.646 2.852v5.707c0 1.174.63 2.266 1.646 2.853l4.943 2.853a3.295 3.295 0 003.294 0l4.942-2.853a3.303 3.303 0 001.647-2.853V7.146a3.301 3.301 0 00-1.646-2.852zM9.25 2.996c.232-.134.49-.2.75-.2s.518.066.749.2l4.793 2.768-1.948 1.125-3.144-1.815a.902.902 0 00-.9 0L6.407 6.889 4.458 5.764 9.25 2.996zM10 13.112l-2.695-1.556V8.443L10 6.887l2.694 1.556v3.113L10 13.112zm-5.692 1.039a1.501 1.501 0 01-.748-1.297V7.32l1.947 1.124v3.631a.9.9 0 00.449.778L9.1 14.668v2.25l-4.793-2.767zm11.383 0l-4.792 2.767v-2.25l3.144-1.815a.897.897 0 00.449-.778v-3.63l1.948-1.124v5.534a1.5 1.5 0 01-.75 1.297v-.001z"></path>
                                        </svg>
                                        <span>Developer Platform</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 1c-.5 0-.9.4-.9.9v.17C5.11 2.52 2 5.9 2 10c0 4.41 3.59 8 8 8 4.11 0 7.48-3.11 7.93-7.1h.17c.5 0 .9-.4.9-.9 0-4.96-4.04-9-9-9zm.9 1.86c3.25.41 5.84 2.99 6.24 6.24H10.9V2.86zM10 16.2c-3.42 0-6.2-2.78-6.2-6.2 0-3.11 2.31-5.69 5.3-6.12V10c0 .5.4.9.9.9h6.12c-.44 2.99-3.01 5.3-6.12 5.3z"></path>
                                        </svg>
                                        <span>Loopify Pro</span>
                                        <span className="beta-badge">BETA</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 2.8c3.97 0 7.2 3.23 7.2 7.2s-3.23 7.2-7.2 7.2-7.2-3.23-7.2-7.2S6.03 2.8 10 2.8zM10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm-.57 13.8c-.17-.1-.31-.24-.41-.41-.1-.17-.15-.36-.15-.57 0-.21.05-.4.15-.57.1-.17.24-.31.41-.41.17-.1.36-.15.57-.15.21 0 .4.05.57.15.17.1.31.24.41.41.1.17.15.36.15.57 0 .21-.05.4-.15.57-.1.17-.24.31-.41.41-.17.1-.36.15-.57.15-.21 0-.4-.05-.57-.15zm2.99-8.28a2.3 2.3 0 00-.97-.82c-.41-.19-.87-.29-1.37-.29-.55 0-1.04.11-1.47.34-.43.23-.77.54-1.02.94-.25.4-.37.85-.38 1.35v.1h1.85v-.1c0-.16.05-.31.14-.44.09-.13.2-.24.35-.31.29-.15.65-.15.93-.01.14.07.24.15.32.27.08.11.11.24.11.38 0 .12-.03.24-.08.34-.06.11-.13.21-.22.3-.1.1-.23.22-.39.36-.24.21-.44.4-.59.56A2.192 2.192 0 009.06 11v.6h1.79v-.61c0-.18.03-.34.1-.49.07-.15.16-.28.27-.4.11-.12.26-.27.46-.44.23-.2.42-.39.56-.55.15-.16.27-.36.37-.59.1-.23.16-.5.16-.8 0-.45-.12-.85-.35-1.21v.01z"></path>
                                        </svg>
                                        <span>Help</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.278 2.632a2.265 2.265 0 00-1.698-.627c-2.95.165-4.67.827-6.58 1.987-1.91-1.16-3.63-1.822-6.581-1.987a2.273 2.273 0 00-1.697.627A2.327 2.327 0 001 4.312v9.428c0 1.23.966 2.241 2.198 2.302 2.724.136 4.175.715 5.761 1.67a2.019 2.019 0 002.082 0c1.586-.955 3.037-1.534 5.761-1.67a2.308 2.308 0 002.199-2.302V4.312c0-.632-.264-1.244-.723-1.68zM3.288 14.238a.507.507 0 01-.488-.498V4.312c0-.189.1-.312.16-.368a.487.487 0 01.333-.136h.027c2.625.147 4.043.692 5.78 1.752v10.158c-1.535-.819-3.177-1.348-5.813-1.48h.001zM17.2 13.74a.505.505 0 01-.488.498c-2.635.132-4.277.661-5.812 1.48V5.56c1.736-1.06 3.155-1.606 5.779-1.752a.47.47 0 01.361.136c.06.056.16.18.16.368v9.427zM12 6.95c1.131-.469 2.385-.765 4-.9v1.794c-1.678.152-2.842.5-4 1.081V6.95zm0 4.064c1.131-.469 2.385-.765 4-.9v1.794c-1.678.152-2.842.5-4 1.081v-1.975z"></path>
                                        </svg>
                                        <span>Blog</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.7 4h-1.8v-.1C13.9 2.3 12.6 1 11 1H9C7.4 1 6.1 2.3 6.1 3.9V4H4.3C2.48 4 1 5.48 1 7.26v7.4C1 16.52 2.48 18 4.3 18h11.4c1.82 0 3.3-1.48 3.3-3.34v-7.4C19 5.48 17.52 4 15.7 4zm-7.8-.1c0-.61.49-1.1 1.1-1.1h2c.61 0 1.1.49 1.1 1.1v.4H7.9v-.4zM4.3 5.8h11.4c.83 0 1.5.67 1.5 1.5 0 2.17-1.77 3.9-3.94 3.9H10.9V9.85H9.1v1.35H6.74c-2.17 0-3.94-1.73-3.94-3.9 0-.83.67-1.5 1.5-1.5zm11.4 10.4H4.3c-.83 0-1.5-.67-1.5-1.5v-3.28A5.73 5.73 0 006.74 13H9.1v1.35h1.8V13h2.36c1.52 0 2.91-.6 3.94-1.58v3.28c0 .83-.67 1.5-1.5 1.5z"></path>
                                        </svg>
                                        <span>Careers</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.536 2.465a5.006 5.006 0 00-7.072 0 4.98 4.98 0 00-1.458 3.503 1.934 1.934 0 00-.437-.023 1.903 1.903 0 00-1.388.759l-5.457 7.319c-.925 1.24-.806 2.87.288 3.965a3.015 3.015 0 002.14.908c.631 0 1.268-.205 1.826-.621l7.317-5.457a1.9 1.9 0 00.761-1.386 1.892 1.892 0 00-.022-.44 4.982 4.982 0 003.502-1.458 5.006 5.006 0 000-7.07zm-5.316 8.91l-7.318 5.457c-.633.474-1.249.25-1.617-.117-.366-.366-.589-.983-.117-1.616l5.457-7.32.15-.01L9.867 8.86l-2.162 2.162 1.273 1.272 2.162-2.162 1.091 1.09-.01.152zm4.043-3.112c-1.209 1.209-3.316 1.209-4.525 0a3.204 3.204 0 010-4.525 3.18 3.18 0 012.263-.938c.855 0 1.658.333 2.263.938a3.204 3.204 0 010 4.525z"></path>
                                        </svg>
                                        <span>Press</span>
                                    </a>
                                    <div className="resources-divider"></div>
                                    <a href="#" className="resource-item" onClick={(e) => { e.preventDefault(); onPageChange("explore"); }}>
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.633 8.086c-.27 0-.536.066-.799.199a1.665 1.665 0 00-.652.596c-.173.265-.258.581-.258.948v3.961H5.999V6.321h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.547 2.547 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.091l-.774 1.848a.766.766 0 00-.244-.073 1.873 1.873 0 00-.349-.032l.001.001zM19 10a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9zm-1.8 0a7.17 7.17 0 00-1.661-4.594L11.98 13.79h-1.955l4.108-9.677A7.152 7.152 0 0010 2.8c-3.97 0-7.2 3.23-7.2 7.2s3.23 7.2 7.2 7.2 7.2-3.23 7.2-7.2z"></path>
                                        </svg>
                                        <span>Communities</span>
                                    </a>
                                    <a href="#" className="resource-item" onClick={(e) => { e.preventDefault(); onPageChange("popular"); }}>
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.22 8.6c-.6-3.51-2.68-6.21-4.76-7.47a.912.912 0 00-.93 0C7.59 2.3 5.37 4.89 4.76 8.61c-2.77 2.65-4.02 4.46-3.57 7.32.17 1.08 1.14 1.9 2.27 1.9h3.18c.61.72 1.53 1.17 2.51 1.17h1.71c.98 0 1.9-.44 2.51-1.17h3.18c1.12 0 2.1-.82 2.27-1.9.45-2.87-.8-4.67-3.59-7.33h-.01zM2.97 15.65c-.24-1.53.15-2.65 1.66-4.33.1 1.83.55 3.45 1.06 4.71H3.46c-.24 0-.45-.17-.49-.38zm6.18 1.55c-.57 0-1.09-.32-1.33-.81-.64-1.31-1.41-3.37-1.41-5.78 0-3.71 1.84-6.34 3.6-7.63 1.81 1.35 3.6 4.16 3.6 7.63 0 2.41-.77 4.47-1.41 5.78-.24.49-.77.81-1.33.81H9.15zm7.88-1.55c-.03.21-.25.38-.49.38h-2.23c.51-1.26.96-2.88 1.06-4.71 1.51 1.69 1.9 2.8 1.66 4.33z"></path><path d="M10 8.35c-.91 0-1.65.74-1.65 1.65 0 .91.74 1.65 1.65 1.65.91 0 1.65-.74 1.65-1.65 0-.91-.74-1.65-1.65-1.65z"></path>
                                        </svg>
                                        <span>Best of Loopify</span>
                                    </a>
                                    <div className="resources-divider"></div>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.278 2.632a2.265 2.265 0 00-1.698-.627c-2.95.165-4.67.827-6.58 1.987-1.91-1.16-3.63-1.822-6.581-1.987a2.273 2.273 0 00-1.697.627A2.327 2.327 0 001 4.312v9.428c0 1.23.966 2.241 2.198 2.302 2.724.136 4.175.715 5.761 1.67a2.019 2.019 0 002.082 0c1.586-.955 3.037-1.534 5.761-1.67a2.308 2.308 0 002.199-2.302V4.312c0-.632-.264-1.244-.723-1.68zM3.288 14.238a.507.507 0 01-.488-.498V4.312c0-.189.1-.312.16-.368a.487.487 0 01.333-.136h.027c2.625.147 4.043.692 5.78 1.752v10.158c-1.535-.819-3.177-1.348-5.813-1.48h.001zM17.2 13.74a.505.505 0 01-.488.498c-2.635.132-4.277.661-5.812 1.48V5.56c1.736-1.06 3.155-1.606 5.779-1.752a.47.47 0 01.361.136c.06.056.16.18.16.368v9.427zM12 6.95c1.131-.469 2.385-.765 4-.9v1.794c-1.678.152-2.842.5-4 1.081V6.95zm0 4.064c1.131-.469 2.385-.765 4-.9v1.794c-1.678.152-2.842.5-4 1.081v-1.975z"></path>
                                        </svg>
                                        <span>Loopify Rules</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.278 2.632a2.265 2.265 0 00-1.698-.627c-2.95.165-4.67.827-6.58 1.987-1.91-1.16-3.63-1.822-6.581-1.987a2.273 2.273 0 00-1.697.627A2.327 2.327 0 001 4.312v9.428c0 1.23.966 2.241 2.198 2.302 2.724.136 4.175.715 5.761 1.67a2.019 2.019 0 002.082 0c1.586-.955 3.037-1.534 5.761-1.67a2.308 2.308 0 002.199-2.302V4.312c0-.632-.264-1.244-.723-1.68zM3.288 14.238a.507.507 0 01-.488-.498V4.312c0-.189.1-.312.16-.368a.487.487 0 01.333-.136h.027c2.625.147 4.043.692 5.78 1.752v10.158c-1.535-.819-3.177-1.348-5.813-1.48h.001zM17.2 13.74a.505.505 0 01-.488.498c-2.635.132-4.277.661-5.812 1.48V5.56c1.736-1.06 3.155-1.606 5.779-1.752a.47.47 0 01.361.136c.06.056.16.18.16.368v9.427zM12 6.95c1.131-.469 2.385-.765 4-.9v1.794c-1.678.152-2.842.5-4 1.081V6.95zm0 4.064c1.131-.469 2.385-.765 4-.9v1.794c-1.678.152-2.842.5-4 1.081v-1.975z"></path>
                                        </svg>
                                        <span>Privacy Policy</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.278 2.632a2.265 2.265 0 00-1.698-.627c-2.95.165-4.67.827-6.58 1.987-1.91-1.16-3.63-1.822-6.581-1.987a2.273 2.273 0 00-1.697.627A2.327 2.327 0 001 4.312v9.428c0 1.23.966 2.241 2.198 2.302 2.724.136 4.175.715 5.761 1.67a2.019 2.019 0 002.082 0c1.586-.955 3.037-1.534 5.761-1.67a2.308 2.308 0 002.199-2.302V4.312c0-.632-.264-1.244-.723-1.68zM3.288 14.238a.507.507 0 01-.488-.498V4.312c0-.189.1-.312.16-.368a.487.487 0 01.333-.136h.027c2.625.147 4.043.692 5.78 1.752v10.158c-1.535-.819-3.177-1.348-5.813-1.48h.001zM17.2 13.74a.505.505 0 01-.488.498c-2.635.132-4.277.661-5.812 1.48V5.56c1.736-1.06 3.155-1.606 5.779-1.752a.47.47 0 01.361.136c.06.056.16.18.16.368v9.427zM12 6.95c1.131-.469 2.385-.765 4-.9v1.794c-1.678.152-2.842.5-4 1.081V6.95zm0 4.064c1.131-.469 2.385-.765 4-.9v1.794c-1.678.152-2.842.5-4 1.081v-1.975z"></path>
                                        </svg>
                                        <span>User Agreement</span>
                                    </a>
                                    <a href="#" className="resource-item">
                                        <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM10.13 11.43c.31 1.27.61 3 .82 4.08.61-.1 1.19-.3 1.72-.59-.2-.97-.67-3.16-1.19-4.82-.03-.1.04-.2.14-.21 1.5-.12 2.69-.36 2.76-.37l-.36-1.76s-2.04.41-4.02.41c-1.98 0-4-.4-4.02-.41l-.36 1.76c.07.01 1.26.25 2.76.37.1 0 .17.11.14.21-.53 1.65-.99 3.85-1.19 4.82.53.29 1.11.48 1.72.59.21-1.09.51-2.82.82-4.08.03-.13.22-.13.26 0z"></path><path d="M10 19c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm0-16.2c-3.97 0-7.2 3.23-7.2 7.2s3.23 7.2 7.2 7.2 7.2-3.23 7.2-7.2-3.23-7.2-7.2-7.2z"></path>
                                        </svg>
                                        <span>Accessibility</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="side-panel-footer">
                    Loopify, Inc. © 2025. All rights reserved.
                </div>
            </div>

            {showCommunityModal && (
                <CreateCommunityModal
                    onClose={() => setShowCommunityModal(false)}
                    onCommunityCreated={handleCommunityCreated}
                />
            )}

            {showFlappyBird && (
                <FlappyBirdModal onClose={() => setShowFlappyBird(false)} />
            )}
        </>
    );
};

export default MainSidePanel;
