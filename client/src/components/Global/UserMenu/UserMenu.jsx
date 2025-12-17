import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userMenu.css";
import CONFIG from "../../../config/config";
import { usePageNavigation } from "../../../context/PageContext";

function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [userData, setUserData] = useState({ username: "User", avatar: "char" });
    const menuRef = useRef(null);
    const triggerRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    console.log("No token found");
                    return;
                }

                const response = await fetch(`${CONFIG.api.baseURL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        username: data.username || "User",
                        avatar: data.avatar || "char",
                    });
                } else {
                    console.error("Failed to fetch user data:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 12,
                right: window.innerWidth - rect.right,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) && 
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const navigate = useNavigate();
    const { onPageChange } = usePageNavigation();

    const handleDarkModeToggle = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        console.log(newMode ? "dark" : "light");
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        setIsOpen(false);
        navigate("/auth/login");
    };

    const menuItems = [
        {
            id: 1,
            type: "profile",
            icon: "profile",
            label: "View Profile",
            sublabel: `u/${userData.username}`,
        },
        {
            id: 2,
            type: "item",
            icon: "avatar",
            label: "Edit Avatar",
        },
        {
            id: 3,
            type: "item",
            icon: "drafts",
            label: "Drafts",
        },
        {
            id: 4,
            type: "item",
            icon: "achievements",
            label: "Achievements",
            sublabel: "5 unlocked",
        },
        {
            id: 6,
            type: "item",
            icon: "premium",
            label: "Premium",
        },
        {
            id: 7,
            type: "toggle",
            icon: "darkmode",
            label: "Dark Mode",
            isEnabled: isDarkMode,
        },
        {
            id: 8,
            type: "item",
            icon: "logout",
            label: "Log Out",
        },
        {
            id: 9,
            type: "divider",
        },
        {
            id: 13,
            type: "item",
            icon: "settings",
            label: "Settings",
        },
    ];

    const getIcon = (iconName) => {
        const icons = {
            profile: (
                <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
            ),
            avatar: (
                <svg fill="currentColor" height="20" icon-name="style" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.362 2.916L18 6.602l-1.895 1.864-2.185-1.709-.01 8.357a1 1 0 01-1 .999H7.091a1 1 0 01-1-1l.002-8.308-2.204 1.652L2 6.602l3.639-3.686h1.264A3.173 3.173 0 0010 5.406a3.174 3.174 0 003.097-2.49h1.265zm0-1.8h-1.265a1.8 1.8 0 00-1.758 1.412A1.38 1.38 0 0110 3.606a1.382 1.382 0 01-1.34-1.078 1.8 1.8 0 00-1.758-1.412H5.638c-.481 0-.943.193-1.281.535L.719 5.337a1.798 1.798 0 00.02 2.549l1.889 1.855a1.8 1.8 0 001.665.47v4.9c-.002.748.29 1.451.818 1.98.529.529 1.232.82 1.98.82h5.819a2.804 2.804 0 002.8-2.796l.005-4.893a1.798 1.798 0 001.652-.475l1.895-1.864a1.8 1.8 0 00.019-2.548l-3.638-3.686a1.8 1.8 0 00-1.281-.536v.003z"></path>
                </svg>
            ),
            drafts: (
                <svg fill="currentColor" height="20" icon-name="text-post" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.7 2H5.3C3.48 2 2 3.48 2 5.3v9.4C2 16.52 3.48 18 5.3 18h9.4c1.82 0 3.3-1.48 3.3-3.3V5.3C18 3.48 16.52 2 14.7 2zm1.5 12.7c0 .83-.67 1.5-1.5 1.5H5.3c-.83 0-1.5-.67-1.5-1.5V5.3c0-.83.67-1.5 1.5-1.5h9.4c.83 0 1.5.67 1.5 1.5v9.4z"></path>
                    <path d="M12 11.1H6v1.8h6v-1.8zM14 7.1H6v1.8h8V7.1z"></path>
                </svg>
            ),
            achievements: (
                <svg fill="currentColor" height="20" icon-name="trophy" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.7 4H15V2.9a.9.9 0 00-.9-.9H5.9a.9.9 0 00-.9.9V4H3.301A2.304 2.304 0 001 6.3v.8c0 2.529 1.933 4.592 4.396 4.849a5.01 5.01 0 003.704 2.96V17.2H6.501a.9.9 0 000 1.8h7a.9.9 0 000-1.8h-2.599v-2.291a5.01 5.01 0 003.703-2.96c2.463-.257 4.396-2.32 4.396-4.849v-.8c0-1.268-1.033-2.3-2.301-2.3zM2.801 7.1v-.8a.5.5 0 01.5-.5H5V10c0 .018.005.035.005.053A3.093 3.093 0 012.801 7.1zM10 13.2A3.204 3.204 0 016.8 10V3.8h6.399V10c0 1.765-1.434 3.2-3.199 3.2zm7.199-6.1a3.095 3.095 0 01-2.204 2.953c0-.018.005-.035.005-.053V5.8h1.7a.5.5 0 01.499.5v.8z"></path>
                </svg>
            ),
            premium: (
                <svg fill="currentColor" height="20" icon-name="premium" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.803 3.188c-1.09-.058-2.723-.243-4.304-1.17a2.967 2.967 0 00-2.998 0c-1.58.927-3.214 1.112-4.305 1.17-1.22.066-2.175 1.063-2.175 2.27v4.845c0 4.485 4.023 7.528 7.761 8.458a.896.896 0 00.437 0c3.737-.93 7.76-3.974 7.76-8.458V5.458c0-1.207-.954-2.203-2.175-2.27zm-.097 1.797a.486.486 0 01.473.473V9.1h-5.277V3.735c1.814.973 3.598 1.185 4.806 1.249h-.002zm-11.413 0c1.21-.065 2.992-.276 4.807-1.25V9.1H3.823V5.458c0-.251.206-.458.47-.473zM3.857 10.9H9.1v5.76c-2.535-.951-4.938-2.974-5.242-5.76zm7.043 5.76V10.9h5.242c-.303 2.786-2.707 4.809-5.242 5.76z"></path>
                </svg>
            ),
            darkmode: (
                <svg fill="currentColor" height="20" icon-name="night" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.642 18.642a8.946 8.946 0 01-8.073-5.04 1.625 1.625 0 01.205-1.76 1.602 1.602 0 011.659-.545c.938.243 1.907.27 2.877.081 2.535-.496 4.572-2.532 5.068-5.068a6.44 6.44 0 00-.082-2.876 1.602 1.602 0 01.546-1.66 1.628 1.628 0 011.76-.205c3.365 1.65 5.33 5.134 5.005 8.874-.371 4.283-3.881 7.793-8.163 8.165a9.402 9.402 0 01-.802.034zm-6.293-5.517a7.175 7.175 0 006.938 3.688c3.424-.297 6.229-3.103 6.526-6.527a7.162 7.162 0 00-3.688-6.938 8.236 8.236 0 01.019 3.307c-.635 3.246-3.242 5.854-6.488 6.49a8.272 8.272 0 01-3.307-.02z"></path>
                </svg>
            ),
            logout: (
                <svg fill="currentColor" height="20" icon-name="logout" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.701 1H6.298a3.299 3.299 0 00-3.299 3.299v8.402A3.299 3.299 0 006.298 16h.701v.858a2.26 2.26 0 002.255 2.259c.293 0 .594-.058.889-.184l5.487-2.347a2.257 2.257 0 001.369-2.075V4.299A3.298 3.298 0 0013.701 1zM7 6.767V14.2h-.701A1.5 1.5 0 014.8 12.701V4.299A1.5 1.5 0 016.299 2.8h6.494L8.37 4.692A2.257 2.257 0 007 6.767zm8.2 7.744a.457.457 0 01-.277.42l-5.487 2.347a.461.461 0 01-.181.039.46.46 0 01-.455-.459V6.767c0-.183.109-.348.277-.42L14.564 4a.461.461 0 01.181-.039.46.46 0 01.455.459v10.091zM10.3 9.7h1.8v2.585h-1.8V9.7z"></path>
                </svg>
            ),
            settings: (
                <svg fill="currentColor" height="20" icon-name="settings" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.145 18.995h-2.29a1.56 1.56 0 01-1.501-1.134l-.051-.18a2.161 2.161 0 00-2.604-1.504l-.185.046a1.561 1.561 0 01-1.731-.734l-1.146-1.985a1.561 1.561 0 01.229-1.864l.132-.137a2.163 2.163 0 000-3.007l-.13-.135a1.561 1.561 0 01-.23-1.866L2.783 4.51a1.56 1.56 0 011.73-.734l.186.046a2.161 2.161 0 002.603-1.504l.05-.18a1.562 1.562 0 011.503-1.134h2.29c.697 0 1.31.463 1.5 1.133l.053.183a2.157 2.157 0 002.599 1.502l.189-.047a1.561 1.561 0 011.73.734l1.147 1.985a1.561 1.561 0 01-.23 1.864l-.133.14a2.162 2.162 0 000 3.004l.132.137c.485.5.578 1.262.23 1.866l-1.145 1.984a1.56 1.56 0 01-1.731.734l-.187-.047a2.16 2.16 0 00-2.601 1.503l-.052.182a1.562 1.562 0 01-1.502 1.134zm-2.11-1.8l1.933-.01a3.947 3.947 0 014.77-2.754l.01.002.967-1.672-.008-.007a3.943 3.943 0 010-5.508l.007-.007-.966-1.672-.01.002a3.945 3.945 0 01-4.771-2.754l-.003-.01-1.933.009A3.946 3.946 0 014.26 5.569l-.01-.002-.966 1.672.008.007a3.943 3.943 0 010 5.508l-.007.007.966 1.672.01-.002a3.947 3.947 0 014.77 2.754l.004.01zM10 13c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm0-4.2c-.661 0-1.2.539-1.2 1.2 0 .66.539 1.2 1.2 1.2.66 0 1.199-.54 1.199-1.2 0-.661-.538-1.2-1.2-1.2z"></path>
                </svg>
            ),
        };
        return icons[iconName] || icons.profile;
    };

    return (
        <div className="user-menu-container" ref={menuRef}>
            <button
                ref={triggerRef}
                className="user-menu-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="User Menu"
            >
                <img src={`/character/${userData.avatar}.png`} alt="user avatar" className="trigger-avatar" />
            </button>

            {isOpen && (
                <div 
                    className="user-menu-dropdown"
                    style={{
                        top: `${menuPosition.top}px`,
                        right: `${menuPosition.right}px`,
                    }}
                >
                    {menuItems.map((item) => {
                        if (item.type === "divider") {
                            return <div key={item.id} className="menu-divider"></div>;
                        }

                        if (item.type === "profile") {
                            return (
                                <div
                                    key={item.id}
                                    className="menu-item menu-profile"
                                    onClick={() => {
                                        setIsOpen(false);
                                        onPageChange("profile");
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="profile-avatar">
                                        <img src={`/character/${userData.avatar}.png`} alt="avatar" />
                                    </div>
                                    <div className="profile-info">
                                        <div className="profile-name">{item.label}</div>
                                        <div className="profile-username">{item.sublabel}</div>
                                    </div>
                                </div>
                            );
                        }

                        if (item.type === "toggle") {
                            return (
                                <div 
                                    key={item.id} 
                                    className="menu-item menu-toggle"
                                    onClick={handleDarkModeToggle}
                                >
                                    <div className="toggle-left">
                                        <div className="menu-icon">{getIcon(item.icon)}</div>
                                        <span className="menu-label">{item.label}</span>
                                    </div>
                                    <div className={`toggle-switch ${item.isEnabled ? "enabled" : ""}`}>
                                        <div className="toggle-circle"></div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div 
                                key={item.id} 
                                className="menu-item"
                                onClick={item.icon === "logout" ? handleLogout : undefined}
                                style={item.icon === "logout" ? { cursor: "pointer" } : {}}
                            >
                                <div className="menu-icon">{getIcon(item.icon)}</div>
                                <div className="menu-text">
                                    <span className="menu-label">{item.label}</span>
                                    {item.badge && <span className="menu-badge">{item.badge}</span>}
                                </div>
                                {item.sublabel && <span className="menu-sublabel">{item.sublabel}</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default UserMenu;
