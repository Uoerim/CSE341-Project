import React, { useState } from "react";
import "./loopifyAnswers.css";

const LoopifyAnswers = () => {
    const [question, setQuestion] = useState("");

    const allSuggestedTopics = [
        { text: "biggest investment mistakes", icon: "💰" },
        { text: "obscure pop songs from the 90s", icon: "🎵" },
        { text: "iOS 18 features", icon: "📱" },
        { text: "garmin vs apple watch", icon: "⌚" },
        { text: "best finance subreddits", icon: "💵" },
        { text: "best restaurants in NYC", icon: "🍽️" },
        { text: "whitening strip recommendations", icon: "✨" },
        { text: "affordable fashion brands", icon: "👕" },
        { text: "best gaming laptop", icon: "💻" },
        { text: "best RPGs of all time", icon: "🎲" },
        { text: "best place to find PS5s", icon: "🎮" },
        { text: "emerging sectors other than AI", icon: "📊" },
        { text: "puppy food recommendations", icon: "🐶" },
        { text: "best beauty subreddits", icon: "💄" },
        { text: "GM vs tesla electric vehicles", icon: "⚡" },
        { text: "best bath towels", icon: "🛀" },
        { text: "best selling sunset drama", icon: "📺" },
        { text: "how to get paint off a wooden table", icon: "🖌️" },
        { text: "banana bread recipes", icon: "🍞" },
        { text: "ADHD study tips", icon: "🧠" },
        { text: "good dog food that's not grain-free", icon: "🐕" },
        { text: "free games on steam", icon: "🎮" },
    ];

    // Split topics into 4 different groups for 4 strips
    const topicsPerStrip = Math.ceil(allSuggestedTopics.length / 4);
    const topicStrips = [
        allSuggestedTopics.slice(0, topicsPerStrip),
        allSuggestedTopics.slice(topicsPerStrip, topicsPerStrip * 2),
        allSuggestedTopics.slice(topicsPerStrip * 2, topicsPerStrip * 3),
        allSuggestedTopics.slice(topicsPerStrip * 3)
    ];

    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            // TODO: Implement question submission logic
            console.log("Question submitted:", question);
        }
    };

    const handleTopicClick = (topicText) => {
        setQuestion(topicText);
    };

    return (
        <div className="loopify-answers-container">
            <div className="loopify-answers-content">
                <div className="answers-header">
                    <h1 className="answers-title">
                        <span className="title-brand">Loopify</span> <span className="title-answers">answers</span>
                    </h1>
                    <p className="answers-description">
                        Got a question? Ask it and get answers, perspectives, and recommendations from all of Loopify
                    </p>
                </div>

                <div className="suggested-topics-wrapper">
                    {topicStrips.map((topics, rowIndex) => (
                        <div key={rowIndex} className="suggested-topics-row" style={{ animationDelay: `${rowIndex * 5}s` }}>
                            <div className="suggested-topics">
                                {topics.map((topic, index) => (
                                    <button
                                        key={index}
                                        className="topic-tag"
                                        onClick={() => handleTopicClick(topic.text)}
                                    >
                                        <span className="topic-icon">{topic.icon}</span>
                                        <span className="topic-text">{topic.text}</span>
                                    </button>
                                ))}
                                {topics.map((topic, index) => (
                                    <button
                                        key={`duplicate-${index}`}
                                        className="topic-tag"
                                        onClick={() => handleTopicClick(topic.text)}
                                    >
                                        <span className="topic-icon">{topic.icon}</span>
                                        <span className="topic-text">{topic.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="learn-more-link">
                    <a 
                        href="#" 
                        className="learn-link"
                        onClick={(e) => {
                            e.preventDefault();
                            // TODO: Implement learn more functionality
                        }}
                    >
                        Learn how Loopify Answers works &gt;
                    </a>
                </div>

                <form className="question-form" onSubmit={handleQuestionSubmit}>
                    <div className="question-input-wrapper">
                        <input
                            type="text"
                            className="question-input"
                            placeholder="Ask a question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="question-submit-button" aria-label="Submit question">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.5 1.5L9.5 10.5M18.5 1.5L12.5 18.5L9.5 10.5M18.5 1.5L1.5 7.5L9.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
            
            <footer className="answers-footer">
                <div className="legal-links">
                    <a href="#" className="footer-link">Loopify Rules </a> <br></br>
                    <a href="#" className="footer-link">Privacy Policy </a> <br></br>
                    <a href="#" className="footer-link">User Agreement </a> <br></br>
                    <a href="#" className="footer-link">Accessibility </a> <br></br>
                    <a href="#" className="footer-link">• Loopify, Inc. © 2025. All rights reserved.</a>
                </div>
            </footer>
        </div>
    );
};

export default LoopifyAnswers;

