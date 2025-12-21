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
                            <div className="side-section-title">
                                <span>RESOURCES</span>
                                <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                                </svg>
                            </div>
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
