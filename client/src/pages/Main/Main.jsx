import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./main.css";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";
import Create from "../Create/Create";
import Home from "../Home/Home";
import Popular from "../Popular/Popular";
import Explore from "../ExplorePage/ExplorePage";
import PostDetail from "../PostDetail/PostDetail";
import UserProfilePage from "../UserProfilePage/UserProfilePage";
import CommunityPage from "../CommunityPage/CommunityPage";
import Notifications from "../Notifications/Notifications";
import { PageProvider } from "../../context/PageContext";
import Drafts from "../Draft/Drafts";
import Settings from "../Settings/Settings";
import LoopifyAnswers from "../LoopifyAnswers/LoopifyAnswers";
import AnswerConversation from "../AnswerConversation/AnswerConversation";
import AvatarSelector from "../AvatarSelector/AvatarSelector";

function Main() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const editId = searchParams.get("edit");
    const pageParam = searchParams.get("page");
    const questionParam = searchParams.get("q");
    const [isPanelShifted, setIsPanelShifted] = useState(false);
    const [currentPage, setCurrentPage] = useState(pageParam || "home");
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const mainContentRef = useRef(null);

    // Check for username and community query parameters
    const usernameParam = searchParams.get("u");
    const communityParam = searchParams.get("r");

    // Update currentPage when page param changes
    useEffect(() => {
        if (pageParam) {
            setCurrentPage(pageParam);
        }
    }, [pageParam]);

    // Fix scroll position on route change
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [currentPage, usernameParam, communityParam]);

    // Handle community param - set currentPage to "community" when ?r= is present
    useEffect(() => {
        if (communityParam && currentPage !== "community") {
            setCurrentPage("community");
        }
    }, [communityParam]);

    const handlePageChange = (page) => {
        console.log("handlePageChange called with:", page);
        setSelectedPostId(null); // Clear selected post when changing pages
        setSelectedUser(null); // Clear selected user when changing pages
        setSelectedCommunity(null); // Clear selected community when changing pages
        
        // Handle community navigation from side panel
        if (page.startsWith("community/")) {
            const communityName = page.replace("community/", "");
            navigate(`/app?r=${communityName}`, { replace: true });
            return;
        }
        
        // Handle profile navigation from side panel
        if (page.startsWith("profile/")) {
            const username = page.replace("profile/", "");
            setSelectedUser(username);
            setCurrentPage("user");
            return;
        }
        
        // Clean up URL - remove all query params when navigating to a new page
        const hasQueryParams = window.location.search && window.location.search !== "";
        if (hasQueryParams) {
            navigate("/app", { replace: true });
        }
        
        setCurrentPage(page);
    };

    const handleSearchBoxClick = (type, idOrName) => {
        // Clear all selections first
        setSelectedPostId(null);
        setSelectedUser(null);
        setSelectedCommunity(null);
        
        // Force reset the current page to ensure re-render
        if (type === "post") {
            setCurrentPage("post");
            setSelectedPostId(idOrName);
        } else if (type === "user") {
            setCurrentPage("user");
            setSelectedUser(idOrName);
        } else if (type === "community") {
            // Navigate to community via URL to ensure proper loading
            navigate(`/app?r=${idOrName}`, { replace: true });
        }
    };

    const renderPage = () => {
        // If ?r=communityName is in the URL, always show that community
        if (communityParam) {
            return <CommunityPage communityName={communityParam} embedded={true} onPostClick={setSelectedPostId} />;
        }
        if (selectedUser) {
            return <UserProfilePage username={selectedUser} embedded={true} onPostClick={setSelectedPostId} />;
        }
        if (selectedCommunity) {
            return <CommunityPage communityName={selectedCommunity} embedded={true} onPostClick={setSelectedPostId} />;
        }
        // If a post is selected, show the post detail page
        if (selectedPostId) {
            return <PostDetail postId={selectedPostId} onClose={() => setSelectedPostId(null)} />;
        }
        if (editId) {
            return (
                <Create
                    onNavigateHome={() => {
                        setCurrentPage("home");
                        navigate("/app", { replace: true });
                    }}
                />
            );
        }

        switch (currentPage) {
            case "home":
                return <Home onPostClick={setSelectedPostId} />;
            case "popular":
                return <Popular onPostClick={setSelectedPostId} />;
            case "explore":
                return <Explore onPostClick={setSelectedPostId} />;
            case "create":
                return <Create onNavigateHome={() => setCurrentPage("home")} />;
            case "profile":
                return <UserProfilePage embedded={true} />;
            case "notifications":
                return <Notifications />;
            case "drafts":
                return <Drafts />;
            case "settings":
                return <Settings />;
            case "avatar-selector":
                return <AvatarSelector />;
            case "answers":
                return <LoopifyAnswers />;
            case "answer-conversation":
                return <AnswerConversation question={questionParam || ""} />;
            default:
                return <Home onPostClick={setSelectedPostId} />;
        }
    };

    return (
        <PageProvider onPageChange={handlePageChange}>
            <div className="main-container">
                <MainNav 
                    onCreateClick={() => handlePageChange("create")} 
                    onHomeClick={() => handlePageChange("home")} 
                    searchBoxClick={handleSearchBoxClick}
                    onAskClick={() => handlePageChange("answers")}
                    onNotificationsClick={() => handlePageChange("notifications")}
                />
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