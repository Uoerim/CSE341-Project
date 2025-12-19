import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./main.css";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";
import Create from "../Create/Create";
import Home from "../Home/Home";
import Popular from "../Popular/Popular";
import Explore from "../Explore/Explore";
import All from "../All/All";
import PostDetail from "../PostDetail/PostDetail";
import UserProfilePage from "../UserProfilePage/UserProfilePage";
import CommunityPage from "../CommunityPage/CommunityPage";
import { PageProvider } from "../../context/PageContext";

function Main() {
    const [searchParams] = useSearchParams();
    const [isPanelShifted, setIsPanelShifted] = useState(false);
    const [currentPage, setCurrentPage] = useState("home");
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [createFromUserProfile, setCreateFromUserProfile] = useState(false);
    const mainContentRef = useRef(null);

    // Check for username and community query parameters
    const usernameParam = searchParams.get("u");
    const communityParam = searchParams.get("r");

    // Fix scroll position on route change
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [currentPage, usernameParam, communityParam]);

    const handlePageChange = (page) => {
        setSelectedPostId(null); // Clear selected post when changing pages
        setCurrentPage(page);
    };

    const handleCreateClick = (fromUser = false) => {
        setCreateFromUserProfile(fromUser);
        handlePageChange("create");
    };

    const renderPage = () => {
        // If community parameter exists, show community page
        if (communityParam) {
            return <CommunityPage communityName={communityParam} embedded={true} onPostClick={setSelectedPostId} />;
        }

        // If username parameter exists, show user profile
        if (usernameParam) {
            return <UserProfilePage username={usernameParam} embedded={true} onPostClick={setSelectedPostId} onCreateClick={() => handleCreateClick(true)} />;
        }

        // If a post is selected, show the post detail page
        if (selectedPostId) {
            return <PostDetail postId={selectedPostId} onClose={() => setSelectedPostId(null)} />;
        }

        switch(currentPage) {
            case "home":
                return <Home onPostClick={setSelectedPostId} />;
            case "popular":
                return <Popular onPostClick={setSelectedPostId} />;
            case "explore":
                return <Explore onPostClick={setSelectedPostId} />;
            case "all":
                return <All onPostClick={setSelectedPostId} />;
            case "create":
                return <Create onNavigateHome={() => setCurrentPage("home")} fromUserProfile={createFromUserProfile} />;
            case "profile":
                return <UserProfilePage embedded={true} onCreateClick={() => handleCreateClick(true)} />;
            default:
                return <Home onPostClick={setSelectedPostId} />;
        }
    };

    return(
        <PageProvider onPageChange={handlePageChange}>
            <div className="main-container">
                <MainNav onCreateClick={() => handleCreateClick(false)} onHomeClick={() => handlePageChange("home")} />
                <div className="main-app-container">
                    <MainSidePanel onToggle={setIsPanelShifted} onPageChange={handlePageChange} currentPage={currentPage} isViewingPost={!!selectedPostId} />
                    <div 
                        ref={mainContentRef}
                        className="main-content" 
                        style={{ paddingLeft: isPanelShifted ? "100px" : "330px", transition: "padding-left 0.3s ease" }}
                    >
                        {renderPage()}
                    </div>
                </div>
            </div>
        </PageProvider>
    );
};

export default Main;