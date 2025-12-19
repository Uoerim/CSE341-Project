import React, { useState } from "react";
import "./searchBox.css";

function SearchBox() {
    const [isOpen, setIsOpen] = useState(false);

    const trendingItems = [
        { id: 1, title: "iOS 26.2 Release and Features", subtitle: "Based on your interests" },
        { id: 2, title: "Dota 2 Patch 7.40", subtitle: "Based on your interests" },
        { id: 3, title: "ChatGPT 5.2 Features", subtitle: "Based on your interests" },
        { id: 4, title: "Goosemas 2025 Providence", subtitle: "Based on your interests" },
        { id: 5, title: "Brown University Shooting", subtitle: "Based on your interests" },
        { id: 6, title: "The Game Awards 2025 Winners", subtitle: "Based on your interests" },
    ];

    return (
        <div className="search-box-container">
            <div className="search-box" onClick={() => setIsOpen(true)}>
                <div className="search-logo">
                    <img className="search-box-logo" src="/logo-white-notext.png" alt="" />
                </div>
                <input 
                    type="text" 
                    placeholder="Find anything" 
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                />
                <button 
                    className="search-ask-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("ask btn pressed");
                    }}
                >
                    <div className="search-loader"></div>
                    <span>Ask</span>
                </button>
            </div>

            {isOpen && (
                <div className="search-dropdown">
                    <div className="search-dropdown-header">Trending</div>
                    <div className="search-dropdown-content">
                        {trendingItems.map((item) => (
                            <div key={item.id} className="search-dropdown-item">
                                <svg className="item-icon" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2zm4 2h2v14h-2z"></path>
                                </svg>
                                <div className="item-content">
                                    <div className="item-title">{item.title}</div>
                                    <div className="item-subtitle">{item.subtitle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBox;
