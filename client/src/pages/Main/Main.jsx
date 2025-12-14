import React, { useState } from "react";
import "./main.css";

import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";

function Main() {
    const [isPanelShifted, setIsPanelShifted] = useState(false);

    return(
        <div className="main-container">
            <MainNav />
            <div className="main-app-container">
                <MainSidePanel onToggle={setIsPanelShifted} />
                <div className="main-content" style={{ marginLeft: isPanelShifted ? "-236px" : "0", transition: "margin-left 0.3s ease" }}>
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