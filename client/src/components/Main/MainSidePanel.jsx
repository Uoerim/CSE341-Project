import React, { useState } from "react";
import "./mainSidePanel.css";
import CreateCommunityModal from "../Global/CreateCommunityModal/CreateCommunityModal";

function MainSidePanel({ onToggle, onPageChange, currentPage, isViewingPost }) {
    const [isPanelShifted, setIsPanelShifted] = useState(false);
    const [showCommunityModal, setShowCommunityModal] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const [wasAutoUnshifted, setWasAutoUnshifted] = useState(false);
    const [isGamesExpanded, setIsGamesExpanded] = useState(false);

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
                    <svg rpl="" class="rpl-rtl-icon" fill="currentColor" height="20" icon-name="popular" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 1a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm0 16.2c-1.66 0-3.186-.57-4.405-1.517l6.476-6.477V13h1.801V7.028a.9.9 0 00-.9-.9h-5.94v1.801h3.771l-6.481 6.482a7.154 7.154 0 01-1.521-4.41c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2L10 17.2z"></path></svg>
                    <span>Popular</span>
                </button>
                <button className={`side-menu-item ${currentPage === "explore" && !isViewingPost ? "active" : ""}`} onClick={() => onPageChange("explore")}>
                    <svg rpl="" fill="currentColor" height="20" icon-name="communities" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M15 12.05c1.08 0 1.95.87 1.95 1.95s-.87 1.95-1.95 1.95-1.95-.87-1.95-1.95.87-1.95 1.95-1.95zm0-1.8c-2.07 0-3.75 1.68-3.75 3.75 0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75zM5 12.05c1.08 0 1.95.87 1.95 1.95S6.08 15.95 5 15.95 3.05 15.08 3.05 14s.87-1.95 1.95-1.95zm0-1.8c-2.07 0-3.75 1.68-3.75 3.75 0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75zM10 4.05c1.08 0 1.95.87 1.95 1.95S11.08 7.95 10 7.95 8.05 7.08 8.05 6 8.92 4.05 10 4.05zm0-1.8C7.93 2.25 6.25 3.93 6.25 6c0 2.07 1.68 3.75 3.75 3.75 2.07 0 3.75-1.68 3.75-3.75 0-2.07-1.68-3.75-3.75-3.75z"></path> </svg>
                    <span>Explore</span>
                </button>
                <button className={`side-menu-item ${currentPage === "all" && !isViewingPost ? "active" : ""}`} onClick={() => onPageChange("all")}>
                    <svg rpl="" class="rpl-rtl-icon" fill="currentColor" height="20" icon-name="all" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm4.9 14.26V7.04h-1.8v9.45c-.68.33-1.42.55-2.2.65V10H9.1v7.14c-.78-.1-1.52-.32-2.2-.65v-3.46H5.1v2.23C3.69 13.94 2.8 12.08 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2c0 2.08-.89 3.95-2.3 5.26z"></path> </svg>
                    <span>All</span>
                </button>
                <button className="side-menu-item side-menu-create" onClick={handleCreateCommunityClick}>
                    <svg rpl="" fill="currentColor" height="20" icon-name="add" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.1 9.1h-6.2V2.9c0-.5-.4-.9-.9-.9s-.9.4-.9.9v6.2H2.9c-.5 0-.9.4-.9.9s.4.9.9.9h6.2v6.2c0 .5.4.9.9.9s.9-.4.9-.9v-6.2h6.2c.5 0 .9-.4.9-.9s-.4-.9-.9-.9z"></path>
                    </svg>
                    <span>Start a community</span>
                </button>
            </div>
            <div className="side-sections">
                <div className="side-section">
                    <div className="side-section-title" onClick={() => setIsGamesExpanded(!isGamesExpanded)}>
                        <span>GAMES ON REDDIT</span>
                        <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg" style={{ transform: isGamesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                        </svg>
                    </div>
                    {isGamesExpanded && (
                        <div className="side-section-items">
                            <a href="#" className="side-section-item featured-game">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="8" fill="#FFC107"/>
                                    <path d="M16 10L18 14L22 15L19 18L19.5 22L16 20L12.5 22L13 18L10 15L14 14L16 10Z" fill="#0E1113"/>
                                </svg>
                                <div className="featured-game-info">
                                    <span className="featured-game-title">Pocket Grids</span>
                                    <span className="featured-game-subtitle">Mini crosswords</span>
                                    <span className="featured-game-players">1.8M monthly players</span>
                                </div>
                            </a>
                            <a href="#" className="side-section-item">
                                <img src="https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_szox7jt5e1h11.png" width="32" height="32" style={{ borderRadius: '50%' }} alt="" />
                                <span>Farm Merge Valley</span>
                            </a>
                            <a href="#" className="side-section-item">
                                <img src="https://styles.redditmedia.com/t5_6jgs46/styles/communityIcon_1ujvvtb0jf891.png" width="32" height="32" style={{ borderRadius: '50%' }} alt="" />
                                <span>Quiz Planet</span>
                            </a>
                            <a href="#" className="side-section-item">
                                <img src="https://styles.redditmedia.com/t5_2qh33/styles/communityIcon_9zl0o2x5k9t11.png" width="32" height="32" style={{ borderRadius: '50%' }} alt="" />
                                <span>Sword & Supper</span>
                            </a>
                            <a href="#" className="side-section-item discover-more">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm0 22c-5.5 0-10-4.5-10-10S10.5 6 16 6s10 4.5 10 10-4.5 10-10 10zm5-11h-4V11c0-.6-.4-1-1-1s-1 .4-1 1v4h-4c-.6 0-1 .4-1 1s.4 1 1 1h4v4c0 .6.4 1 1 1s1-.4 1-1v-4h4c.6 0 1-.4 1-1s-.4-1-1-1z"/>
                                </svg>
                                <span>Discover More Games</span>
                            </a>
                        </div>
                    )}
                </div>
                <div className="side-section">
                    <div className="side-section-title">
                        <span>CUSTOM FEEDS</span>
                        <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                        </svg>
                    </div>
                </div>
                <div className="side-section">
                    <div className="side-section-title">
                        <span>RECENT</span>
                        <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                        </svg>
                    </div>
                </div>
                <div className="side-section">
                    <div className="side-section-title">
                        <span>COMMUNITIES</span>
                        <svg rpl="" className="text-secondary-weak" fill="currentColor" height="20" icon-name="caret-down-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
                        </svg>
                    </div>
                </div>
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
        </>
    );
};

export default MainSidePanel;
