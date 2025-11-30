import React from "react";
import "./notifications.css"

function Notifications() {
    return (
        <div className="notifications-container">
            <div className="notifications-data">
                <div className="notifications-title">
                    <h1>Notifications   </h1>
                </div>
                <div className="notifications-view">
                    <img src="/hello-reddit-avatar.png" alt="" />
                    <h2>You don't have any activity yet</h2>
                    <p>That's okay, maybe you just need the right inspiration. Check out r/SomethingIMade, a popular community for discussion.</p>
                </div>
            </div>
        </div>
    );
}

export default Notifications