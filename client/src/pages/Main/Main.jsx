import React, { useState, useEffect, useRef } from "react";
import "./main.css";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";
import Create from "../Create/Create";
import Home from "../Home/Home";
import Popular from "../Popular/Popular";
import Explore from "../Explore/Explore";
import All from "../All/All";
import PostDetail from "../PostDetail/PostDetail";

function Main() {
    const [isPanelShifted, setIsPanelShifted] = useState(false);
    const [currentPage, setCurrentPage] = useState("home");
    const [selectedPostId, setSelectedPostId] = useState(null);
    const mainContentRef = useRef(null);

    // Fix scroll position on route change
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [currentPage]);

    const handlePageChange = (page) => {
        setSelectedPostId(null); // Clear selected post when changing pages
        setCurrentPage(page);
    };

    const renderPage = () => {
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
                return <Create onNavigateHome={() => setCurrentPage("home")} />;
            default:
                return <Home onPostClick={setSelectedPostId} />;
        }
    };

    return(
        <div className="main-container">
            <MainNav onCreateClick={() => handlePageChange("create")} />
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
    );
};

export default Main;