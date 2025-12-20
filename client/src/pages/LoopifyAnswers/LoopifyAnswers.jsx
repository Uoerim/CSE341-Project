import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loopifyAnswers.css";

const LoopifyAnswers = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");

    const suggestedQuestions = [
        "What's the best way to learn programming?",
        "How do I start investing?",
        "Best productivity tips for students",
        "How to improve my sleep quality?",
    ];

    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            navigate("/app?page=answer-conversation&q=" + encodeURIComponent(question));
        }
    };

    const handleSuggestionClick = (text) => {
        navigate("/app?page=answer-conversation&q=" + encodeURIComponent(text));
    };

    return (
        <div className="loopify-answers-container">
            <div className="loopify-answers-content">
                {/* AI Icon */}
                <div className="ai-icon-wrapper">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#aiGradientMain)"/>
                        <defs>
                            <linearGradient id="aiGradientMain" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4FBCFF"/>
                                <stop offset="1" stopColor="#9C6ADE"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Title */}
                <div className="answers-header">
                    <h1 className="answers-title">How can I help you today?</h1>
                    <p className="answers-subtitle">Ask anything and get AI-powered answers</p>
                </div>

                {/* Search Input */}
                <form className="question-form" onSubmit={handleQuestionSubmit}>
                    <div className="question-input-wrapper">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21l-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            className="question-input"
                            placeholder="Ask me anything..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            autoFocus
                        />
                        <button 
                            type="submit" 
                            className="question-submit-button" 
                            disabled={!question.trim()}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Suggested Questions */}
                <div className="suggestions-section">
                    <p className="suggestions-label">Try asking:</p>
                    <div className="suggestions-grid">
                        {suggestedQuestions.map((q, index) => (
                            <button
                                key={index}
                                className="suggestion-card"
                                onClick={() => handleSuggestionClick(q)}
                            >
                                <span className="suggestion-text">{q}</span>
                                <svg className="suggestion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoopifyAnswers;

