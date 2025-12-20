import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./answerConversation.css";

const AnswerConversation = ({ question }) => {
    const navigate = useNavigate();
    const [followup, setFollowup] = useState("");

    // Simple hash function to generate consistent random data based on question
    const hashString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    // All possible sources
    const allSources = [
        { name: "r/teenagers", icon: "👥" },
        { name: "r/AskReddit", icon: "❓" },
        { name: "r/CasualConversation", icon: "💬" },
        { name: "r/NoStupidQuestions", icon: "🤔" },
        { name: "r/explainlikeimfive", icon: "🧒" },
        { name: "r/todayilearned", icon: "📚" },
        { name: "r/YouShouldKnow", icon: "💡" },
        { name: "r/mildlyinteresting", icon: "🔍" },
        { name: "r/interestingasfuck", icon: "🔥" },
        { name: "r/science", icon: "🔬" }
    ];

    // All possible facts/quotes
    const allFacts = [
        {
            title: "Butterflies Remember Being Caterpillars:",
            quote: "Butterflies can remember experiences from when they were caterpillars, even after metamorphosis.",
            sources: ["r/teenagers", "r/todayilearned"]
        },
        {
            title: "Mars Day Length:",
            quote: "A day on Mars is only slightly longer than a day on Earth - about 24 hours and 37 minutes.",
            sources: ["r/AskReddit", "r/science"]
        },
        {
            title: "Octopuses Have Three Hearts:",
            quote: "Octopuses have three hearts - two pump blood to the gills, and one pumps blood to the rest of the body.",
            sources: ["r/todayilearned", "r/science"]
        },
        {
            title: "Honey Never Spoils:",
            quote: "Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
            sources: ["r/YouShouldKnow", "r/mildlyinteresting"]
        },
        {
            title: "Bananas Are Berries:",
            quote: "Botanically speaking, bananas are berries, but strawberries are not. The classification depends on where the seeds are located.",
            sources: ["r/explainlikeimfive", "r/todayilearned"]
        },
        {
            title: "Wombat Poop is Cube-Shaped:",
            quote: "Wombats produce cube-shaped feces, which helps mark territory and prevents the droppings from rolling away.",
            sources: ["r/interestingasfuck", "r/science"]
        },
        {
            title: "Sharks Have Been Around Longer Than Trees:",
            quote: "Sharks have existed for over 400 million years, while trees have only been around for about 350 million years.",
            sources: ["r/todayilearned", "r/science"]
        },
        {
            title: "A Group of Flamingos is Called a Flamboyance:",
            quote: "While commonly called a flock, a group of flamingos is technically called a flamboyance, which perfectly describes their appearance.",
            sources: ["r/mildlyinteresting", "r/CasualConversation"]
        },
        {
            title: "Cleopatra Lived Closer to the Moon Landing Than the Pyramids:",
            quote: "Cleopatra lived closer in time to the moon landing (1969) than to the construction of the Great Pyramid of Giza.",
            sources: ["r/YouShouldKnow", "r/todayilearned"]
        },
        {
            title: "Dolphins Have Names:",
            quote: "Dolphins use signature whistles that act as names, allowing them to call out to specific individuals.",
            sources: ["r/science", "r/interestingasfuck"]
        },
        {
            title: "The Human Brain Uses 20% of the Body's Energy:",
            quote: "Despite being only 2% of body weight, the brain consumes about 20% of the body's total energy and oxygen.",
            sources: ["r/science", "r/YouShouldKnow"]
        },
        {
            title: "There Are More Possible Chess Games Than Atoms in the Universe:",
            quote: "The number of possible chess games is estimated to be around 10^120, far exceeding the number of atoms in the observable universe.",
            sources: ["r/explainlikeimfive", "r/science"]
        },
        {
            title: "A Single Cloud Can Weigh More Than a Million Pounds:",
            quote: "A cumulus cloud can weigh over 1 million pounds, but it floats because the air below it is denser.",
            sources: ["r/todayilearned", "r/explainlikeimfive"]
        },
        {
            title: "The Speed of Light is Constant:",
            quote: "Light always travels at 299,792,458 meters per second in a vacuum, regardless of the observer's motion.",
            sources: ["r/science", "r/explainlikeimfive"]
        },
        {
            title: "Penguins Propose with Pebbles:",
            quote: "Male penguins search for the perfect pebble to present to their chosen mate as a proposal gift.",
            sources: ["r/mildlyinteresting", "r/CasualConversation"]
        }
    ];

    // Generate data based on question
    const generatedData = useMemo(() => {
        if (!question) {
            return {
                sources: allSources.slice(0, 5),
                facts: allFacts.slice(0, 2)
            };
        }

        const hash = hashString(question.toLowerCase());
        const seed = hash % 1000000;

        // Select 5 random sources based on hash
        const selectedSources = [];
        const sourceIndices = new Set();
        for (let i = 0; i < 5; i++) {
            let index;
            do {
                index = (seed + i * 7) % allSources.length;
            } while (sourceIndices.has(index));
            sourceIndices.add(index);
            selectedSources.push(allSources[index]);
        }

        // Select 3-5 random facts based on hash
        const numFacts = 3 + (seed % 3); // 3-5 facts
        const selectedFacts = [];
        const factIndices = new Set();
        for (let i = 0; i < numFacts; i++) {
            let index;
            do {
                index = (seed + i * 11) % allFacts.length;
            } while (factIndices.has(index));
            factIndices.add(index);
            const fact = allFacts[index];
            // Select a random source for this fact
            const factSource = fact.sources[(seed + i * 3) % fact.sources.length];
            const timeAgoOptions = ["1 hour ago", "2 hours ago", "5 hours ago", "1 day ago", "2 days ago", "3 days ago", "5 days ago", "1 week ago"];
            const timeAgo = timeAgoOptions[(seed + i * 5) % timeAgoOptions.length];
            
            selectedFacts.push({
                ...fact,
                source: factSource,
                timeAgo: timeAgo
            });
        }

        return {
            sources: selectedSources,
            facts: selectedFacts
        };
    }, [question]);

    const sources = generatedData.sources;
    const facts = generatedData.facts;

    const handleFollowupSubmit = (e) => {
        e.preventDefault();
        if (followup.trim()) {
            // TODO: Implement followup submission logic
            console.log("Followup submitted:", followup);
        }
    };

    return (
        <div className="answer-conversation-container">
            <div className="answer-conversation-content">
                <div className="conversation-header">
                    <button className="back-button" onClick={() => navigate("/app?page=answers")}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 className="conversation-title">{question || "Hello?"}</h1>
                    <button className="new-question-button" onClick={() => navigate("/app?page=answers")}>New question</button>
                </div>

                <div className="sources-section">
                    <div className="sources-wrapper">
                        {sources.map((source, index) => (
                            <div key={index} className="source-tag" style={{ animationDelay: `${index * 0.1}s` }}>
                                <span className="source-icon">{source.icon}</span>
                                <span className="source-name">{source.name}</span>
                            </div>
                        ))}
                        {sources.map((source, index) => (
                            <div key={`duplicate-${index}`} className="source-tag" style={{ animationDelay: `${(sources.length + index) * 0.1}s` }}>
                                <span className="source-icon">{source.icon}</span>
                                <span className="source-name">{source.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="description-section">
                    <p className="description-text">
                        Discover a collection of <strong>mind-blowing and quirky facts</strong> gathered from redditors on various topics:
                    </p>
                </div>

                <div className="facts-section">
                    <h2 className="facts-title">
                        {question 
                            ? `Answers about "${question}"` 
                            : "General Fun Facts"}
                    </h2>
                    {facts.map((fact, index) => (
                        <div key={index} className="fact-card">
                            <h3 className="fact-title">{fact.title}</h3>
                            <p className="fact-quote">"{fact.quote}"</p>
                            <div className="fact-source">
                                <span className="source-link">{fact.source}</span>
                                <span className="source-separator">•</span>
                                <span className="source-time">{fact.timeAgo}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <form className="followup-form" onSubmit={handleFollowupSubmit}>
                    <div className="followup-input-wrapper">
                        <input
                            type="text"
                            className="followup-input"
                            placeholder="Ask a followup"
                            value={followup}
                            onChange={(e) => setFollowup(e.target.value)}
                        />
                        <button type="submit" className="followup-submit-button" aria-label="Submit followup">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.5 1.5L9.5 10.5M18.5 1.5L12.5 18.5L9.5 10.5M18.5 1.5L1.5 7.5L9.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <footer className="answers-footer">
                <div className="legal-links">
                    <a href="#" className="footer-link">Loopify Rules</a>
                    <span className="footer-separator">•</span>
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <span className="footer-separator">•</span>
                    <a href="#" className="footer-link">User Agreement</a>
                    <span className="footer-separator">•</span>
                    <a href="#" className="footer-link">Accessibility</a>
                    <span className="footer-separator">•</span>
                    <span className="footer-copyright">Loopify, Inc. © 2025. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
};

export default AnswerConversation;

