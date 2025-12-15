import React, { useState } from "react";
import "./main.css";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";
import Create from "../Create/Create";

function Main() {
    const [isPanelShifted, setIsPanelShifted] = useState(false);
    const [currentPage, setCurrentPage] = useState("home");

    const renderPage = () => {
        switch(currentPage) {
            case "create":
                return <Create onNavigateHome={() => setCurrentPage("home")} />;
            default:
                return (
                    <>
                        <h1>Main Content Area</h1>
                        {/* PLACE YOUR PAGES HERE AND IMPORT THEM TO VIEW.
                        THE SIDEPANEL AND NAVBAR BUTTONS STILL LACKS FUNCTIONALITY
                        --> TO JOE SAMEH :) */}
                    </>
                );
        }
    };

    return(
        <div className="main-container">
            <MainNav onCreateClick={() => setCurrentPage("create")} />
            <div className="main-app-container">
                <MainSidePanel onToggle={setIsPanelShifted} />
                <div className="main-content" style={{ paddingLeft: isPanelShifted ? "100px" : "330px", transition: "padding-left 0.3s ease" }}>
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default Main;