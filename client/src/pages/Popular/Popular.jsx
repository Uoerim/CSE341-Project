import React, { useState, useEffect, useRef, useCallback } from "react";
import "./popular.css";
import "../../components/RecentPosts/recentPosts.css";
import Post from "../../components/Post/Post";
import Spinner from "../../components/Global/Spinner/Spinner";
import axios from "axios";

function Popular({ onPostClick }) {
    const [posts, setPosts] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState("best"); // best, hot, new, top, rising
    const [timeFilter, setTimeFilter] = useState("today"); // today, week, month, year, all
    const [location, setLocation] = useState("everywhere"); // everywhere, US, etc.
    const [viewMode, setViewMode] = useState("card"); // card, compact
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showViewDropdown, setShowViewDropdown] = useState(false);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(true);
    const carouselRef = useRef(null);
    const loadedPostIdsRef = useRef(new Set());
    const observerTarget = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    // Fetch trending posts on mount
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await axios.get(`${apiUrl}/posts/trending?limit=6`);
                setTrendingPosts(response.data.posts || []);
            } catch (error) {
                console.error("Error fetching trending posts:", error);
                setTrendingPosts([]);
            }
        };
        fetchTrending();
    }, [apiUrl]);

    // Fetch recent posts for sidebar
    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const response = await axios.get(`${apiUrl}/posts/recent?limit=5`);
                setRecentPosts(response.data || []);
            } catch (error) {
                console.error("Error fetching recent posts:", error);
                setRecentPosts([]);
            }
        };
        fetchRecent();
    }, [apiUrl]);

    // Reset posts when filters change
    useEffect(() => {
        setPosts([]);
        loadedPostIdsRef.current = new Set();
        setHasMore(true);
        fetchPosts(1, true);
    }, [sortBy, timeFilter, location]);

    // Fetch posts
    const fetchPosts = useCallback(async (pageNum, isReset = false) => {
        setLoading(true);
        try {
            const excludeStr = isReset ? "" : Array.from(loadedPostIdsRef.current).join(",");
            let url = `${apiUrl}/posts/popular?page=${pageNum}&limit=10&sort=${sortBy}`;
            
            if (sortBy === "top") {
                url += `&time=${timeFilter}`;
            }
            
            if (excludeStr) {
                url += `&exclude=${excludeStr}`;
            }

            const response = await axios.get(url);
            const { posts: newPosts, pagination } = response.data;

            // Filter out any posts that are already loaded
            const uniqueNewPosts = newPosts.filter(post => !loadedPostIdsRef.current.has(post._id));

            if (uniqueNewPosts.length > 0) {
                uniqueNewPosts.forEach(post => {
                    loadedPostIdsRef.current.add(post._id);
                });
                
                setPosts((prevPosts) => isReset ? uniqueNewPosts : [...prevPosts, ...uniqueNewPosts]);
                setHasMore(pagination.hasMore);
            } else if (newPosts.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching popular posts:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, sortBy, timeFilter]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    const currentPage = Math.floor(loadedPostIdsRef.current.size / 10) + 1;
                    fetchPosts(currentPage);
                }
            },
            { threshold: 0.1 }
        );

        const target = observerTarget.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [loading, hasMore, fetchPosts]);

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setShowSortDropdown(false);
    };

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
        setShowLocationDropdown(false);
    };

    const handleTimeFilterChange = (time) => {
        setTimeFilter(time);
        setShowLocationDropdown(false);
    };

    const handleViewChange = (newView) => {
        setViewMode(newView);
        setShowViewDropdown(false);
    };

    const getSortLabel = () => {
        const labels = {
            best: "Best",
            hot: "Hot",
            new: "New",
            top: "Top",
            rising: "Rising"
        };
        return labels[sortBy];
    };

    const getLocationLabel = () => {
        // If Top is selected, show time filter label
        if (sortBy === "top") {
            const timeLabels = {
                now: "Now",
                today: "Today",
                week: "This Week",
                month: "This Month",
                year: "This Year",
                all: "All Time"
            };
            return timeLabels[timeFilter] || "Today";
        }
        
        // Otherwise show location label
        const labels = {
            everywhere: "Everywhere",
            ar: "Argentina",
            au: "Australia",
            at: "Austria",
            be: "Belgium",
            br: "Brazil",
            bg: "Bulgaria",
            ca: "Canada",
            cl: "Chile",
            co: "Colombia",
            hr: "Croatia",
            cz: "Czech Republic",
            dk: "Denmark",
            ee: "Estonia",
            fi: "Finland",
            fr: "France",
            de: "Germany",
            gr: "Greece",
            hu: "Hungary",
            is: "Iceland",
            in: "India",
            ie: "Ireland",
            it: "Italy",
            jp: "Japan",
            lv: "Latvia",
            lt: "Lithuania",
            lu: "Luxembourg",
            my: "Malaysia",
            mx: "Mexico",
            nl: "Netherlands",
            nz: "New Zealand",
            no: "Norway",
            ph: "Philippines",
            pl: "Poland",
            pt: "Portugal",
            ro: "Romania",
            rs: "Serbia",
            sg: "Singapore",
            sk: "Slovakia",
            si: "Slovenia",
            za: "South Africa",
            kr: "South Korea",
            es: "Spain",
            se: "Sweden",
            ch: "Switzerland",
            tw: "Taiwan",
            th: "Thailand",
            tr: "Turkey",
            ua: "Ukraine",
            ae: "United Arab Emirates",
            uk: "United Kingdom",
            us: "United States"
        };
        return labels[location] || "Everywhere";
    };

    const getViewLabel = () => {
        return viewMode === "card" ? "Card" : "Compact";
    };

    const handleCarouselScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftScroll(scrollLeft > 0);
            setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 300;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Extract first image from post content
    const extractFirstImage = (html) => {
        if (!html) return null;
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/;
        const match = html.match(imgRegex);
        return match ? match[1] : null;
    };

    // Truncate text to specified length
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        // Remove HTML tags
        const plainText = text.replace(/<[^>]*>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    };

    // Extract all images from HTML content
    const extractAllImages = (html) => {
        if (!html) return [];
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
        const images = [];
        let match;
        while ((match = imgRegex.exec(html)) !== null) {
            images.push(match[1]);
        }
        return images;
    };

    // Format time ago
    const formatTime = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return postDate.toLocaleDateString();
    };

    return (
        <div className="page-container popular-container">
            <div className="popular-layout">
                {/* Trending Carousel - Full Width */}
                {trendingPosts.length > 0 && (
                <div className="trending-carousel-wrapper">
                    {showLeftScroll && (
                        <button className="carousel-scroll-btn left" onClick={() => scrollCarousel('left')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.95 15.05a.9.9 0 01-1.273 0l-5-5a.9.9 0 010-1.273l5-5a.9.9 0 111.273 1.273L8.473 10l4.477 4.477a.9.9 0 010 1.273z" fill="currentColor"/>
                            </svg>
                        </button>
                    )}
                    <div 
                        className="trending-carousel" 
                        ref={carouselRef}
                        onScroll={handleCarouselScroll}
                    >
                            {trendingPosts.map((post) => (
                                <div 
                                    key={post._id} 
                                    className="trending-card"
                                    onClick={() => onPostClick && onPostClick(post._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div 
                                        className="trending-card-image"
                                        style={{
                                            backgroundImage: extractFirstImage(post.content) 
                                                ? `url(${extractFirstImage(post.content)})` 
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        <div className="trending-card-overlay"></div>
                                    </div>
                                    <div className="trending-card-content">
                                        <h3 className="trending-card-title">{truncateText(post.title, 40)}</h3>
                                        <p className="trending-card-subtitle">{truncateText(post.content, 45)}</p>
                                        <div className="trending-card-footer">
                                            <div className="trending-card-icon"></div>
                                            <span className="trending-card-community">
                                                {post.community?.name ? `r/${post.community.name}` : `u/${post.author?.username || 'user'}`}
                                            </span>
                                            <span className="trending-card-more">
                                                {post.upvotes?.length || 0} upvotes
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showRightScroll && (
                            <button className="carousel-scroll-btn right" onClick={() => scrollCarousel('right')}>
                                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.05 4.95a.9.9 0 011.273 0l5 5a.9.9 0 010 1.273l-5 5a.9.9 0 11-1.273-1.273L11.527 10 7.05 5.523a.9.9 0 010-1.273z" fill="currentColor"/>
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                    {/* Content Wrapper - Two Column Layout */}
                    <div className="content-wrapper">
                        <div className="feed-wrapper">
                            {/* Filter Boxes */}
                            <div className="filter-container">
                        {/* Sort By Dropdown */}
                        <div className="filter-dropdown-wrapper" data-tooltip="Open sort options">
                            <button
                                className={`filter-dropdown-btn sort-btn ${showSortDropdown ? 'active' : ''}`}
                                onClick={() => {
                                    setShowSortDropdown(!showSortDropdown);
                                    setShowLocationDropdown(false);
                                    setShowViewDropdown(false);
                                }}
                                title="Open sort options"
                            >
                                <span>{getSortLabel()}</span>
                                <svg className="dropdown-arrow" fill="currentColor" height="16" width="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"/>
                                </svg>
                            </button>
                            
                            {showSortDropdown && (
                                <div className="filter-dropdown-menu sort-menu">
                                    <div className="dropdown-header">Sort by</div>
                                    <button 
                                        className={sortBy === "best" ? "active" : ""}
                                        onClick={() => handleSortChange("best")}
                                    >
                                        Best
                                    </button>
                                    <button 
                                        className={sortBy === "hot" ? "active" : ""}
                                        onClick={() => handleSortChange("hot")}
                                    >
                                        Hot
                                    </button>
                                    <button 
                                        className={sortBy === "new" ? "active" : ""}
                                        onClick={() => handleSortChange("new")}
                                    >
                                        New
                                    </button>
                                    <button 
                                        className={sortBy === "top" ? "active" : ""}
                                        onClick={() => handleSortChange("top")}
                                    >
                                        Top
                                    </button>
                                    <button 
                                        className={sortBy === "rising" ? "active" : ""}
                                        onClick={() => handleSortChange("rising")}
                                    >
                                        Rising
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Location Dropdown - Hidden for New and Rising */}
                        {sortBy !== "new" && sortBy !== "rising" && (
                        <div className="filter-dropdown-wrapper" data-tooltip="Open location options">
                            <button
                                className={`filter-dropdown-btn ${showLocationDropdown ? 'active' : ''}`}
                                onClick={() => {
                                    setShowLocationDropdown(!showLocationDropdown);
                                    setShowSortDropdown(false);
                                    setShowViewDropdown(false);
                                }}
                                title="Open sort options"
                            >
                                <span>{getLocationLabel()}</span>
                                <svg className="dropdown-arrow" fill="currentColor" height="16" width="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"/>
                                </svg>
                            </button>
                            
                            {showLocationDropdown && sortBy === "top" && (
                                <div className="filter-dropdown-menu sort-menu">
                                    <div className="dropdown-header">Sort by</div>
                                    <button 
                                        className={timeFilter === "now" ? "active" : ""}
                                        onClick={() => handleTimeFilterChange("now")}
                                    >
                                        Now
                                    </button>
                                    <button 
                                        className={timeFilter === "today" ? "active" : ""}
                                        onClick={() => handleTimeFilterChange("today")}
                                    >
                                        Today
                                    </button>
                                    <button 
                                        className={timeFilter === "week" ? "active" : ""}
                                        onClick={() => handleTimeFilterChange("week")}
                                    >
                                        This Week
                                    </button>
                                    <button 
                                        className={timeFilter === "month" ? "active" : ""}
                                        onClick={() => handleTimeFilterChange("month")}
                                    >
                                        This Month
                                    </button>
                                    <button 
                                        className={timeFilter === "year" ? "active" : ""}
                                        onClick={() => handleTimeFilterChange("year")}
                                    >
                                        This Year
                                    </button>
                                    <button 
                                        className={timeFilter === "all" ? "active" : ""}
                                        onClick={() => handleTimeFilterChange("all")}
                                    >
                                        All Time
                                    </button>
                                </div>
                            )}
                            {showLocationDropdown && sortBy !== "top" && (
                                <div className="filter-dropdown-menu location-menu">
                                    <div className="dropdown-header">Sort by</div>
                                    <button className={location === "everywhere" ? "active" : ""} onClick={() => handleLocationChange("everywhere")}>Everywhere</button>
                                    <button className={location === "ar" ? "active" : ""} onClick={() => handleLocationChange("ar")}>Argentina</button>
                                    <button className={location === "au" ? "active" : ""} onClick={() => handleLocationChange("au")}>Australia</button>
                                    <button className={location === "at" ? "active" : ""} onClick={() => handleLocationChange("at")}>Austria</button>
                                    <button className={location === "be" ? "active" : ""} onClick={() => handleLocationChange("be")}>Belgium</button>
                                    <button className={location === "br" ? "active" : ""} onClick={() => handleLocationChange("br")}>Brazil</button>
                                    <button className={location === "bg" ? "active" : ""} onClick={() => handleLocationChange("bg")}>Bulgaria</button>
                                    <button className={location === "ca" ? "active" : ""} onClick={() => handleLocationChange("ca")}>Canada</button>
                                    <button className={location === "cl" ? "active" : ""} onClick={() => handleLocationChange("cl")}>Chile</button>
                                    <button className={location === "co" ? "active" : ""} onClick={() => handleLocationChange("co")}>Colombia</button>
                                    <button className={location === "hr" ? "active" : ""} onClick={() => handleLocationChange("hr")}>Croatia</button>
                                    <button className={location === "cz" ? "active" : ""} onClick={() => handleLocationChange("cz")}>Czech Republic</button>
                                    <button className={location === "dk" ? "active" : ""} onClick={() => handleLocationChange("dk")}>Denmark</button>
                                    <button className={location === "ee" ? "active" : ""} onClick={() => handleLocationChange("ee")}>Estonia</button>
                                    <button className={location === "fi" ? "active" : ""} onClick={() => handleLocationChange("fi")}>Finland</button>
                                    <button className={location === "fr" ? "active" : ""} onClick={() => handleLocationChange("fr")}>France</button>
                                    <button className={location === "de" ? "active" : ""} onClick={() => handleLocationChange("de")}>Germany</button>
                                    <button className={location === "gr" ? "active" : ""} onClick={() => handleLocationChange("gr")}>Greece</button>
                                    <button className={location === "hu" ? "active" : ""} onClick={() => handleLocationChange("hu")}>Hungary</button>
                                    <button className={location === "is" ? "active" : ""} onClick={() => handleLocationChange("is")}>Iceland</button>
                                    <button className={location === "in" ? "active" : ""} onClick={() => handleLocationChange("in")}>India</button>
                                    <button className={location === "ie" ? "active" : ""} onClick={() => handleLocationChange("ie")}>Ireland</button>
                                    <button className={location === "it" ? "active" : ""} onClick={() => handleLocationChange("it")}>Italy</button>
                                    <button className={location === "jp" ? "active" : ""} onClick={() => handleLocationChange("jp")}>Japan</button>
                                    <button className={location === "lv" ? "active" : ""} onClick={() => handleLocationChange("lv")}>Latvia</button>
                                    <button className={location === "lt" ? "active" : ""} onClick={() => handleLocationChange("lt")}>Lithuania</button>
                                    <button className={location === "lu" ? "active" : ""} onClick={() => handleLocationChange("lu")}>Luxembourg</button>
                                    <button className={location === "my" ? "active" : ""} onClick={() => handleLocationChange("my")}>Malaysia</button>
                                    <button className={location === "mx" ? "active" : ""} onClick={() => handleLocationChange("mx")}>Mexico</button>
                                    <button className={location === "nl" ? "active" : ""} onClick={() => handleLocationChange("nl")}>Netherlands</button>
                                    <button className={location === "nz" ? "active" : ""} onClick={() => handleLocationChange("nz")}>New Zealand</button>
                                    <button className={location === "no" ? "active" : ""} onClick={() => handleLocationChange("no")}>Norway</button>
                                    <button className={location === "ph" ? "active" : ""} onClick={() => handleLocationChange("ph")}>Philippines</button>
                                    <button className={location === "pl" ? "active" : ""} onClick={() => handleLocationChange("pl")}>Poland</button>
                                    <button className={location === "pt" ? "active" : ""} onClick={() => handleLocationChange("pt")}>Portugal</button>
                                    <button className={location === "ro" ? "active" : ""} onClick={() => handleLocationChange("ro")}>Romania</button>
                                    <button className={location === "rs" ? "active" : ""} onClick={() => handleLocationChange("rs")}>Serbia</button>
                                    <button className={location === "sg" ? "active" : ""} onClick={() => handleLocationChange("sg")}>Singapore</button>
                                    <button className={location === "sk" ? "active" : ""} onClick={() => handleLocationChange("sk")}>Slovakia</button>
                                    <button className={location === "si" ? "active" : ""} onClick={() => handleLocationChange("si")}>Slovenia</button>
                                    <button className={location === "za" ? "active" : ""} onClick={() => handleLocationChange("za")}>South Africa</button>
                                    <button className={location === "kr" ? "active" : ""} onClick={() => handleLocationChange("kr")}>South Korea</button>
                                    <button className={location === "es" ? "active" : ""} onClick={() => handleLocationChange("es")}>Spain</button>
                                    <button className={location === "se" ? "active" : ""} onClick={() => handleLocationChange("se")}>Sweden</button>
                                    <button className={location === "ch" ? "active" : ""} onClick={() => handleLocationChange("ch")}>Switzerland</button>
                                    <button className={location === "tw" ? "active" : ""} onClick={() => handleLocationChange("tw")}>Taiwan</button>
                                    <button className={location === "th" ? "active" : ""} onClick={() => handleLocationChange("th")}>Thailand</button>
                                    <button className={location === "tr" ? "active" : ""} onClick={() => handleLocationChange("tr")}>Turkey</button>
                                    <button className={location === "ua" ? "active" : ""} onClick={() => handleLocationChange("ua")}>Ukraine</button>
                                    <button className={location === "ae" ? "active" : ""} onClick={() => handleLocationChange("ae")}>United Arab Emirates</button>
                                    <button className={location === "uk" ? "active" : ""} onClick={() => handleLocationChange("uk")}>United Kingdom</button>
                                    <button className={location === "us" ? "active" : ""} onClick={() => handleLocationChange("us")}>United States</button>
                                </div>
                            )}
                        </div>
                        )}

                        {/* View Mode Dropdown */}
                        <div className="filter-dropdown-wrapper" data-tooltip="Change post view">
                            <button
                                className={`filter-dropdown-btn view-btn ${showViewDropdown ? 'active' : ''}`}
                                onClick={() => {
                                    setShowViewDropdown(!showViewDropdown);
                                    setShowSortDropdown(false);
                                    setShowLocationDropdown(false);
                                }}
                                title="Change post view"
                            >
                                {viewMode === "card" ? (
                                    <svg className="view-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.7 2H5.3C3.48 2 2 3.48 2 5.3v9.4C2 16.52 3.48 18 5.3 18h9.4c1.82 0 3.3-1.48 3.3-3.3V5.3C18 3.48 16.52 2 14.7 2zM5.3 3.8h9.4c.83 0 1.5.67 1.5 1.5v3.8H3.8V5.3c0-.83.67-1.5 1.5-1.5zm9.4 12.4H5.3c-.83 0-1.5-.67-1.5-1.5v-3.8h12.4v3.8c0 .83-.67 1.5-1.5 1.5z"/>
                                    </svg>
                                ) : (
                                    <svg className="view-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.7 2H5.3C3.48 2 2 3.48 2 5.3v9.4C2 16.52 3.48 18 5.3 18h9.4c1.82 0 3.3-1.48 3.3-3.3V5.3C18 3.48 16.52 2 14.7 2zM5.3 3.8h9.4c.83 0 1.5.67 1.5 1.5v1.43H3.8V5.3c0-.83.67-1.5 1.5-1.5zm10.9 4.73v2.93H3.8V8.53h12.4zm-1.5 7.67H5.3c-.83 0-1.5-.67-1.5-1.5v-1.43h12.4v1.43c0 .83-.67 1.5-1.5 1.5z"/>
                                    </svg>
                                )}
                                <svg className="dropdown-arrow" fill="currentColor" height="16" width="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"/>
                                </svg>
                            </button>
                            
                            {showViewDropdown && (
                                <div className="filter-dropdown-menu view-menu">
                                    <div className="dropdown-header">View</div>
                                    <button 
                                        className={viewMode === "card" ? "active" : ""}
                                        onClick={() => handleViewChange("card")}
                                    >
                                        {viewMode === "card" ? (
                                            <svg className="menu-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 8.2V5.3C18 3.48 16.52 2 14.7 2H5.3C3.48 2 2 3.48 2 5.3v2.9c0 .5.4.9.9.9h14.2c.5 0 .9-.4.9-.9zM2 11.8v2.9C2 16.52 3.48 18 5.3 18h9.4c1.82 0 3.3-1.48 3.3-3.3v-2.9c0-.5-.4-.9-.9-.9H2.9c-.5 0-.9.4-.9.9z"/>
                                            </svg>
                                        ) : (
                                            <svg className="menu-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.7 2H5.3C3.48 2 2 3.48 2 5.3v9.4C2 16.52 3.48 18 5.3 18h9.4c1.82 0 3.3-1.48 3.3-3.3V5.3C18 3.48 16.52 2 14.7 2zM5.3 3.8h9.4c.83 0 1.5.67 1.5 1.5v3.8H3.8V5.3c0-.83.67-1.5 1.5-1.5zm9.4 12.4H5.3c-.83 0-1.5-.67-1.5-1.5v-3.8h12.4v3.8c0 .83-.67 1.5-1.5 1.5z"/>
                                            </svg>
                                        )}
                                        Card
                                    </button>
                                    <button 
                                        className={viewMode === "compact" ? "active" : ""}
                                        onClick={() => handleViewChange("compact")}
                                    >
                                        {viewMode === "compact" ? (
                                            <svg className="menu-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.1 7.93H2.9a.9.9 0 00-.9.9v2.33a.9.9 0 00.9.9h14.2a.9.9 0 00.9-.9V8.83a.9.9 0 00-.9-.9zM18 5.3C18 3.48 16.52 2 14.7 2H5.3C3.48 2 2 3.48 2 5.3c0 .46.37.83.83.83h14.34c.46 0 .83-.37.83-.83zM2 14.7C2 16.52 3.48 18 5.3 18h9.4c1.82 0 3.3-1.48 3.3-3.3 0-.46-.37-.83-.83-.83H2.83c-.46 0-.83.37-.83.83z"/>
                                            </svg>
                                        ) : (
                                            <svg className="menu-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.7 2H5.3C3.48 2 2 3.48 2 5.3v9.4C2 16.52 3.48 18 5.3 18h9.4c1.82 0 3.3-1.48 3.3-3.3V5.3C18 3.48 16.52 2 14.7 2zM5.3 3.8h9.4c.83 0 1.5.67 1.5 1.5v1.43H3.8V5.3c0-.83.67-1.5 1.5-1.5zm10.9 4.73v2.93H3.8V8.53h12.4zm-1.5 7.67H5.3c-.83 0-1.5-.67-1.5-1.5v-1.43h12.4v1.43c0 .83-.67 1.5-1.5 1.5z"/>
                                            </svg>
                                        )}
                                        Compact
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Posts List */}
                    {posts.length === 0 && !loading && (
                        <div className="empty-state">
                            <p>No posts found. Check back later!</p>
                        </div>
                    )}

                    <div className={`posts-list ${viewMode === "compact" ? "compact-view" : "card-view"}`}>
                        {posts.map((post) => (
                            <Post 
                                key={post._id} 
                                post={post}
                                onPostClick={onPostClick}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div ref={observerTarget} className="loading-trigger">
                            {loading && <Spinner />}
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <div className="end-of-feed">
                            <p>You've reached the end!</p>
                        </div>
                    )}
                        </div>

                        {/* Sidebar */}
                        <aside className="sidebar">
                            {recentPosts.length > 0 && (
                                <div className="recent-posts-widget">
                                    <div className="recent-posts-header">
                                        <h3>RECENT POSTS</h3>
                                    </div>
                                    <div className="recent-posts-list">
                                        {recentPosts.map((post) => {
                                            const images = extractAllImages(post.content);
                                            const thumbnail = images[0];
                                            const voteCount = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
                                            const commentCount = post.comments?.length || 0;

                                            return (
                                                <div 
                                                    key={post._id} 
                                                    className="recent-post-item"
                                                    onClick={() => onPostClick && onPostClick(post._id)}
                                                >
                                                    <div className="recent-post-content">
                                                        <div className="recent-post-header">
                                                            <div className="recent-post-community">
                                                                {post.community ? (
                                                                    <>
                                                                        <div className="recent-post-icon">
                                                                            <div className="recent-post-icon-placeholder">
                                                                                r/
                                                                            </div>
                                                                        </div>
                                                                        <span className="recent-post-community-name">
                                                                            r/{post.community.name}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="recent-post-icon">
                                                                            <img 
                                                                                src={`/character/${post.author?.avatar || 'char'}.png`}
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <span className="recent-post-community-name">
                                                                            u/{post.author?.username}
                                                                        </span>
                                                                    </>
                                                                )}
                                                                <span className="recent-post-time">• {formatTime(post.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <h4 className="recent-post-title">{post.title}</h4>
                                                        <div className="recent-post-stats">
                                                            <span className="recent-post-stat">
                                                                {voteCount} upvote{voteCount !== 1 ? 's' : ''}
                                                            </span>
                                                            <span className="recent-post-dot">•</span>
                                                            <span className="recent-post-stat">
                                                                {commentCount} comment{commentCount !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {thumbnail && (
                                                        <div className="recent-post-thumbnail">
                                                            <img src={thumbnail} alt="" />
                                                            {images.length > 1 && (
                                                                <div className="recent-post-image-count">
                                                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="white">
                                                                        <path d="M17 1H3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V3a2 2 0 00-2-2zm0 16H3V3h14v14zM5 7h10v2H5V7zm0 4h10v2H5v-2z"/>
                                                                    </svg>
                                                                    {images.length}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
        </div>
    );
}

export default Popular;
