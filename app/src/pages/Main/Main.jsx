import React from "react";
import "./main.css";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";

function Main() {
    return(
        <div className="main-container">
            <MainNav />
            <div className="main-app-container">
                <MainSidePanel />
                <div className="main-content">
                    <h1>Main Content Area</h1>
                    {/* PLACE YOUR PAGES HERE AND IMPORT THEM TO VIEW.
                    THE SIDEPANEL AND NAVBAR BUTTONS STILL LACKS FUNCTIONALITY
                    --> TO JOE SAMEH :) */}
                </div>
            </div>
        </div>
    );
};

export default Main;