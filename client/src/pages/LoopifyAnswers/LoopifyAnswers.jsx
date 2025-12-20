import React, { useState } from "react";
import "./loopifyAnswers.css";

const LoopifyAnswers = () => {
    const [question, setQuestion] = useState("");

    const suggestedTopics = [
        "biggest investment mistakes",
        "obscure pop songs from the 90s",
        "iOS 18 features",
        "garmin vs apple watch",
        "best finance subreddits",
        "best restaurants in NYC",
        "whitening strip recommendations",
        "affordable fashion brands",
        "best gaming laptop",
        "best RPGs of all time",
        "best place to find PS5s",
        "emerging sectors other than AI"
    ];

    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            // TODO: Implement question submission logic
            console.log("Question submitted:", question);
        }
    };

    const handleTopicClick = (topic) => {
        setQuestion(topic);
    };

    return (
        <div className="loopify-answers-container">
            <div className="loopify-answers-content">
                <div className="answers-header">
                    <h1 className="answers-title">Loopify Answers</h1>
                    <p className="answers-description">
                        Got a question? Ask it and get answers, perspectives, and recommendations from all of Loopify.
                    </p>
                </div>

                <div className="suggested-topics">
                    {suggestedTopics.map((topic, index) => (
                        <button
                            key={index}
                            className="topic-tag"
                            onClick={() => handleTopicClick(topic)}
                        >
                            {topic}
                        </button>
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoopifyAnswers;

