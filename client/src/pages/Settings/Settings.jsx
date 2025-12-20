import React, { useState } from 'react';
import './Settings.css';
import MainNav from '../../components/Main/MainNav';
import MainSidePanel from '../../components/Main/MainSidePanel';
import { PageProvider } from '../../context/PageContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [googleConnected, setGoogleConnected] = useState(true);
    const [appleConnected, setAppleConnected] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [userEmail] = useState('yousefshoman99@gmail.com');
    const [userGender] = useState('Man');
    const [location] = useState('Use approximate location (based on IP)');
    const [isPanelShifted, setIsPanelShifted] = useState(false);

    // Profile settings state
    const [markAsMature, setMarkAsMature] = useState(true);
    const [showNSFW, setShowNSFW] = useState(true);
    const [showFollowers, setShowFollowers] = useState(false);
    const [contentVisibility, setContentVisibility] = useState('Show all');

    // Privacy settings state
    const [allowFollow, setAllowFollow] = useState(true);
    const [chatRequests, setChatRequests] = useState('Everyone');
    const [listProfile, setListProfile] = useState(true);
    const [showInSearch, setShowInSearch] = useState(true);
    const [personalizeAds, setPersonalizeAds] = useState(true);

    // Preferences settings state
    const [showMatureContent, setShowMatureContent] = useState(false);
    const [blurMature, setBlurMature] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(true);
    const [autoplayMedia, setAutoplayMedia] = useState(true);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [syncMotion, setSyncMotion] = useState(true);
    const [useCommunityThemes, setUseCommunityThemes] = useState(true);
    const [openPostsNewTab, setOpenPostsNewTab] = useState(false);
    const [defaultFeedView, setDefaultFeedView] = useState('Card');
    const [markdownEditor, setMarkdownEditor] = useState(false);
    const [defaultOldReddit, setDefaultOldReddit] = useState(false);

    // Notifications settings state
    const [webPushNotifications, setWebPushNotifications] = useState(false);

    // Email settings state
    const [emailAdminNotifications, setEmailAdminNotifications] = useState(true);
    const [emailChatRequests, setEmailChatRequests] = useState(false);
    const [emailNewUserWelcome, setEmailNewUserWelcome] = useState(false);
    const [emailCommentsOnPosts, setEmailCommentsOnPosts] = useState(true);
    const [emailRepliesToComments, setEmailRepliesToComments] = useState(true);
    const [emailUpvotesOnPosts, setEmailUpvotesOnPosts] = useState(true);
    const [emailUpvotesOnComments, setEmailUpvotesOnComments] = useState(true);
    const [emailUsernameMentions, setEmailUsernameMentions] = useState(true);
    const [emailNewFollowers, setEmailNewFollowers] = useState(true);
    const [emailDailyDigest, setEmailDailyDigest] = useState(true);
    const [emailWeeklyRecap, setEmailWeeklyRecap] = useState(true);
    const [emailWeeklyTopic, setEmailWeeklyTopic] = useState(true);
    const [unsubscribeAll, setUnsubscribeAll] = useState(false);

    const tabs = [
        { id: 'account', label: 'Account' },
        { id: 'profile', label: 'Profile' },
        { id: 'privacy', label: 'Privacy' },
        { id: 'preferences', label: 'Preferences' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'email', label: 'Email' },
    ];

    const handlePageChange = (page) => {
        navigate('/app');
    };

    const handleHomeClick = () => {
        navigate('/app');
    };

    const handleCreateClick = () => {
        navigate('/app');
    };

    const handleSearchBoxClick = () => {
        // Handle search navigation if needed
    };

    return (
        <PageProvider onPageChange={handlePageChange}>
            <div className="main-container">
                <MainNav
                    onCreateClick={handleCreateClick}
                    onHomeClick={handleHomeClick}
                    searchBoxClick={handleSearchBoxClick}
                />
                <div className="main-app-container">
                    <MainSidePanel
                        onToggle={setIsPanelShifted}
                        onPageChange={handlePageChange}
                        currentPage="settings"
                        isViewingPost={false}
                    />
                    <div
                        className="main-content"
                        style={{ paddingLeft: isPanelShifted ? "100px" : "330px", transition: "padding-left 0.3s ease" }}
                    >
                        <div className="settings-page">
                            <div className="settings-container-new">
                                <h1 className="settings-title">Settings</h1>

                                <div className="settings-tabs-new">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            className={`settings-tab-new ${activeTab === tab.id ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="settings-content-new">
                                    {activeTab === 'account' && (
                                        <>
                                            {/* General Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">General</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Email address</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">{userEmail}</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Gender</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">{userGender}</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Location customization</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">{location}</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Account Authorization Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Account authorization</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Google</div>
                                                        <div className="setting-description">
                                                            Connect to log in to Reddit with your Google account
                                                        </div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`auth-btn ${googleConnected ? 'disconnect-btn' : 'connect-btn'}`}
                                                            onClick={() => setGoogleConnected(!googleConnected)}
                                                        >
                                                            {googleConnected ? 'Disconnect' : 'Connect'}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Apple</div>
                                                        <div className="setting-description">
                                                            Connect to log in to Reddit with your Apple account
                                                        </div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`auth-btn ${appleConnected ? 'disconnect-btn' : 'connect-btn'}`}
                                                            onClick={() => setAppleConnected(!appleConnected)}
                                                        >
                                                            {appleConnected ? 'Disconnect' : 'Connect'}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Two-factor authentication</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${twoFactorEnabled ? 'enabled' : ''}`}
                                                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                                            aria-label="Toggle two-factor authentication"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Reddit Premium Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Reddit Premium</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Get premium</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Advanced Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Advanced</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Delete account</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Footer */}
                                            <footer className="settings-footer">
                                                <a href="#">Reddit Rules</a>
                                                <a href="#">Privacy Policy</a>
                                                <a href="#">User Agreement</a>
                                                <a href="#">Accessibility</a>
                                                <span className="separator">•</span>
                                                <span className="copyright">Reddit, Inc. © 2025. All rights reserved.</span>
                                            </footer>
                                        </>
                                    )}

                                    {activeTab === 'profile' && (
                                        <>
                                            {/* General Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">General</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Display name</div>
                                                        <div className="setting-description">Changing your display name won't change your username</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">About description</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Avatar</div>
                                                        <div className="setting-description">Edit your avatar or upload an image</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Banner</div>
                                                        <div className="setting-description">Upload a profile background image</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Social links</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Mark as mature (18+)</div>
                                                        <div className="setting-description">Label your profile as Not Safe for Work (NSFW) and ensure it's inaccessible to people under 18</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${markAsMature ? 'enabled' : ''}`}
                                                            onClick={() => setMarkAsMature(!markAsMature)}
                                                            aria-label="Toggle mark as mature"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Curate your profile Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Curate your profile</h2>
                                                <p className="section-description">Manage what content shows on your profile.</p>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Content and activity</div>
                                                        <div className="setting-description">Posts, comments, and communities you're active in</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button className="dropdown-btn">
                                                            {contentVisibility}
                                                            <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
                                                                <path d="M10 13.125l-5-5h10l-5 5z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">NSFW</div>
                                                        <div className="setting-description">Show all NSFW posts and comments</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${showNSFW ? 'enabled' : ''}`}
                                                            onClick={() => setShowNSFW(!showNSFW)}
                                                            aria-label="Toggle NSFW visibility"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Followers</div>
                                                        <div className="setting-description">Show your follower count</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${showFollowers ? 'enabled' : ''}`}
                                                            onClick={() => setShowFollowers(!showFollowers)}
                                                            aria-label="Toggle follower count visibility"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="info-box">
                                                    <span className="info-highlight">Profile curation</span> only applies to your profile and your content stays visible in communities. Mods of communities you participate in and redditors whose profile posts you engage with can still see your full profile for moderation.
                                                </div>
                                            </section>

                                            {/* Advanced Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Advanced</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Profile moderation</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="external-link-icon" fill="none" stroke="currentColor" strokeWidth="1.5" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M11 3h6v6M17 3L9 11M15 11v6H3V5h6" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Footer */}
                                            <footer className="settings-footer">
                                                <a href="#">Reddit Rules</a>
                                                <a href="#">Privacy Policy</a>
                                                <a href="#">User Agreement</a>
                                                <a href="#">Accessibility</a>
                                                <span className="separator">•</span>
                                                <span className="copyright">Reddit, Inc. © 2025. All rights reserved.</span>
                                            </footer>
                                        </>
                                    )}

                                    {activeTab === 'privacy' && (
                                        <>
                                            {/* Social interactions Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Social interactions</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Allow people to follow you</div>
                                                        <div className="setting-description">Let people follow you to see your profile posts in their home feed</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${allowFollow ? 'enabled' : ''}`}
                                                            onClick={() => setAllowFollow(!allowFollow)}
                                                            aria-label="Toggle allow follow"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Who can send you chat requests</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">{chatRequests}</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Blocked accounts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Discoverability Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Discoverability</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">List your profile on old.reddit.com/users</div>
                                                        <div className="setting-description">List your profile on old.reddit.com/users and allow posts to your profile to appear in r/all</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${listProfile ? 'enabled' : ''}`}
                                                            onClick={() => setListProfile(!listProfile)}
                                                            aria-label="Toggle list profile"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Show up in search results</div>
                                                        <div className="setting-description">Allow search engines like Google to link to your profile in their search results</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${showInSearch ? 'enabled' : ''}`}
                                                            onClick={() => setShowInSearch(!showInSearch)}
                                                            aria-label="Toggle show in search"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Advertising Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Advertising</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Personalize ads on Reddit based on information and activity from our partners</div>
                                                        <div className="setting-description">Allow us to use information from our partners to show you better ads on Reddit</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${personalizeAds ? 'enabled' : ''}`}
                                                            onClick={() => setPersonalizeAds(!personalizeAds)}
                                                            aria-label="Toggle personalize ads"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Advanced Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Advanced</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Third-party app authorizations</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="external-link-icon" fill="none" stroke="currentColor" strokeWidth="1.5" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M11 3h6v6M17 3L9 11M15 11v6H3V5h6" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Clear history</div>
                                                        <div className="setting-description">Delete your post views history</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button className="clear-btn">Clear</button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Footer */}
                                            <footer className="settings-footer">
                                                <a href="#">Reddit Rules</a>
                                                <a href="#">Privacy Policy</a>
                                                <a href="#">User Agreement</a>
                                                <a href="#">Accessibility</a>
                                                <span className="separator">•</span>
                                                <span className="copyright">Reddit, Inc. © 2025. All rights reserved.</span>
                                            </footer>
                                        </>
                                    )}

                                    {activeTab === 'preferences' && (
                                        <>
                                            {/* Language Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Language</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Display language</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Content languages</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Content Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Content</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Show mature content (I'm over 18)</div>
                                                        <div className="setting-description">See Not Safe for Work mature and adult content in your feeds and search results</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${showMatureContent ? 'enabled' : ''}`}
                                                            onClick={() => setShowMatureContent(!showMatureContent)}
                                                            aria-label="Toggle show mature content"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label disabled">Blur mature (18+) images and media</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn disabled ${blurMature ? 'enabled' : ''}`}
                                                            disabled
                                                            aria-label="Toggle blur mature"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Show recommendations in home feed</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${showRecommendations ? 'enabled' : ''}`}
                                                            onClick={() => setShowRecommendations(!showRecommendations)}
                                                            aria-label="Toggle show recommendations"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Muted communities</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Accessibility Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Accessibility</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Autoplay media</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${autoplayMedia ? 'enabled' : ''}`}
                                                            onClick={() => setAutoplayMedia(!autoplayMedia)}
                                                            aria-label="Toggle autoplay media"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label disabled">Reduce Motion</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${reduceMotion ? 'enabled' : ''}`}
                                                            onClick={() => setReduceMotion(!reduceMotion)}
                                                            aria-label="Toggle reduce motion"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Sync with computer's motion settings</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${syncMotion ? 'enabled' : ''}`}
                                                            onClick={() => setSyncMotion(!syncMotion)}
                                                            aria-label="Toggle sync motion"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Experience Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Experience</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Use community themes</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${useCommunityThemes ? 'enabled' : ''}`}
                                                            onClick={() => setUseCommunityThemes(!useCommunityThemes)}
                                                            aria-label="Toggle community themes"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Open posts in new tab</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${openPostsNewTab ? 'enabled' : ''}`}
                                                            onClick={() => setOpenPostsNewTab(!openPostsNewTab)}
                                                            aria-label="Toggle open posts in new tab"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Default feed view</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">{defaultFeedView}</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Default to markdown editor</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${markdownEditor ? 'enabled' : ''}`}
                                                            onClick={() => setMarkdownEditor(!markdownEditor)}
                                                            aria-label="Toggle markdown editor"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Keyboard shortcuts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Default to old Reddit</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${defaultOldReddit ? 'enabled' : ''}`}
                                                            onClick={() => setDefaultOldReddit(!defaultOldReddit)}
                                                            aria-label="Toggle old Reddit"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Sensitive advertising categories Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Sensitive advertising categories</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Limit ads in selected categories</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Footer */}
                                            <footer className="settings-footer">
                                                <a href="#">Reddit Rules</a>
                                                <a href="#">Privacy Policy</a>
                                                <a href="#">User Agreement</a>
                                                <a href="#">Accessibility</a>
                                                <span className="separator">•</span>
                                                <span className="copyright">Reddit, Inc. © 2025. All rights reserved.</span>
                                            </footer>
                                        </>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <>
                                            {/* General Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">General</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Community notifications</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Web push notifications</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${webPushNotifications ? 'enabled' : ''}`}
                                                            onClick={() => setWebPushNotifications(!webPushNotifications)}
                                                            aria-label="Toggle web push notifications"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Messages Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Messages</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Chat messages</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Chat requests</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Mark all as read</div>
                                                        <div className="setting-description">Mark all chat conversations as read</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button className="mark-read-btn">Mark as read</button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Activity Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Activity</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Mentions of u/username</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Comments on your posts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Upvotes on your posts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Upvotes on your comments</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Replies to your comments</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Activity on your comments</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">New followers</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Awards you receive</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Posts you follow</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Comments you follow</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Keyword alerts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Achievement updates</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Streak reminders</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Insights on your posts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Developer Platform app notifications</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Recommendations Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Recommendations</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Trending posts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">ReReddit</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Featured content</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Breaking news</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All off</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Updates Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Updates</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Reddit announcements</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Cake day</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Admin notifications</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <span className="setting-current-value">All on</span>
                                                        <svg className="chevron" fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
                                                            <path d="M6.3 14.7a.897.897 0 010-1.272L10.264 9.464 6.3 5.5a.9.9 0 111.272-1.272l4.6 4.6a.897.897 0 010 1.272l-4.6 4.6a.897.897 0 01-1.272 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Footer */}
                                            <footer className="settings-footer">
                                                <a href="#">Reddit Rules</a>
                                                <a href="#">Privacy Policy</a>
                                                <a href="#">User Agreement</a>
                                                <a href="#">Accessibility</a>
                                                <span className="separator">•</span>
                                                <span className="copyright">Reddit, Inc. © 2025. All rights reserved.</span>
                                            </footer>
                                        </>
                                    )}

                                    {activeTab === 'email' && (
                                        <>
                                            {/* Messages Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Messages</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Admin notifications</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailAdminNotifications ? 'enabled' : ''}`}
                                                            onClick={() => setEmailAdminNotifications(!emailAdminNotifications)}
                                                            aria-label="Toggle admin notifications"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Chat requests</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailChatRequests ? 'enabled' : ''}`}
                                                            onClick={() => setEmailChatRequests(!emailChatRequests)}
                                                            aria-label="Toggle chat requests"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Activity Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Activity</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">New user welcome</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailNewUserWelcome ? 'enabled' : ''}`}
                                                            onClick={() => setEmailNewUserWelcome(!emailNewUserWelcome)}
                                                            aria-label="Toggle new user welcome"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Comments on your posts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailCommentsOnPosts ? 'enabled' : ''}`}
                                                            onClick={() => setEmailCommentsOnPosts(!emailCommentsOnPosts)}
                                                            aria-label="Toggle comments on posts"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Replies to your comments</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailRepliesToComments ? 'enabled' : ''}`}
                                                            onClick={() => setEmailRepliesToComments(!emailRepliesToComments)}
                                                            aria-label="Toggle replies to comments"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Upvotes on your posts</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailUpvotesOnPosts ? 'enabled' : ''}`}
                                                            onClick={() => setEmailUpvotesOnPosts(!emailUpvotesOnPosts)}
                                                            aria-label="Toggle upvotes on posts"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Upvotes on your comments</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailUpvotesOnComments ? 'enabled' : ''}`}
                                                            onClick={() => setEmailUpvotesOnComments(!emailUpvotesOnComments)}
                                                            aria-label="Toggle upvotes on comments"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Username mentions</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailUsernameMentions ? 'enabled' : ''}`}
                                                            onClick={() => setEmailUsernameMentions(!emailUsernameMentions)}
                                                            aria-label="Toggle username mentions"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">New followers</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailNewFollowers ? 'enabled' : ''}`}
                                                            onClick={() => setEmailNewFollowers(!emailNewFollowers)}
                                                            aria-label="Toggle new followers"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Newsletters Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Newsletters</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Daily Digest</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailDailyDigest ? 'enabled' : ''}`}
                                                            onClick={() => setEmailDailyDigest(!emailDailyDigest)}
                                                            aria-label="Toggle daily digest"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Weekly Recap</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailWeeklyRecap ? 'enabled' : ''}`}
                                                            onClick={() => setEmailWeeklyRecap(!emailWeeklyRecap)}
                                                            aria-label="Toggle weekly recap"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Weekly Topic</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${emailWeeklyTopic ? 'enabled' : ''}`}
                                                            onClick={() => setEmailWeeklyTopic(!emailWeeklyTopic)}
                                                            aria-label="Toggle weekly topic"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Advanced Section */}
                                            <section className="settings-section-new">
                                                <h2 className="section-heading">Advanced</h2>

                                                <div className="setting-row">
                                                    <div className="setting-info">
                                                        <div className="setting-label">Unsubscribe from all emails</div>
                                                    </div>
                                                    <div className="setting-value-action">
                                                        <button
                                                            className={`toggle-btn ${unsubscribeAll ? 'enabled' : ''}`}
                                                            onClick={() => setUnsubscribeAll(!unsubscribeAll)}
                                                            aria-label="Toggle unsubscribe from all"
                                                        >
                                                            <span className="toggle-circle"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Footer */}
                                            <footer className="settings-footer">
                                                <a href="#">Reddit Rules</a>
                                                <a href="#">Privacy Policy</a>
                                                <a href="#">User Agreement</a>
                                                <a href="#">Accessibility</a>
                                                <span className="separator">•</span>
                                                <span className="copyright">Reddit, Inc. © 2025. All rights reserved.</span>
                                            </footer>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageProvider >
    );
};

export default Settings;
