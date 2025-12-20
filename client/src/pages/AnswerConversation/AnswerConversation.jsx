import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./answerConversation.css";

const AnswerConversation = ({ question }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [displayedResponse, setDisplayedResponse] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingIntervalRef = useRef(null);
    const initialMessageSent = useRef(false);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, displayedResponse]);

    // Initial question handling
    useEffect(() => {
        if (question && messages.length === 0 && !initialMessageSent.current) {
            initialMessageSent.current = true;
            handleSendMessage(question, true);
        }
    }, [question]);

    // Cleanup typing interval on unmount
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        };
    }, []);

    const typeResponse = (fullResponse, onComplete) => {
        let currentIndex = 0;
        setDisplayedResponse("");
        setIsTyping(true);

        typingIntervalRef.current = setInterval(() => {
            if (currentIndex < fullResponse.length) {
                const charsPerTick = Math.random() > 0.9 ? 3 : 2;
                const nextChunk = fullResponse.slice(currentIndex, currentIndex + charsPerTick);
                setDisplayedResponse(prev => prev + nextChunk);
                currentIndex += charsPerTick;
            } else {
                clearInterval(typingIntervalRef.current);
                setIsTyping(false);
                onComplete(fullResponse);
            }
        }, 20);
    };

    const handleSendMessage = async (messageText, isInitial = false) => {
        const text = messageText || inputValue;
        if (!text.trim() || isLoading) return;

        const userMessage = {
            role: "user",
            content: text.trim()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);
        setDisplayedResponse("");

        try {
            const response = await fetch(`${apiUrl}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text.trim(),
                    conversationHistory: messages
                })
            });

            const data = await response.json();

            if (data.success && data.reply) {
                typeResponse(data.reply, (fullResponse) => {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: fullResponse
                    }]);
                    setDisplayedResponse("");
                });
            } else {
                throw new Error(data.error || "Failed to get response");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm sorry, I encountered an error while processing your request. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSendMessage();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessage = (content) => {
        // Simple markdown-like formatting
        return content
            .split('\n')
            .map((line, i) => {
                // Bold text
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Italic text
                line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
                // Code inline
                line = line.replace(/`(.*?)`/g, '<code>$1</code>');
                return <p key={i} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />;
            });
    };

    return (
        <div className="answer-conversation-container">
            <div className="answer-conversation-content">
                {/* Header */}
                <div className="conversation-header">
                    <div className="header-title">
                        <svg className="ai-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#gradient1)"/>
                            <defs>
                                <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#4FBCFF"/>
                                    <stop offset="1" stopColor="#9C6ADE"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>Loopify AI</span>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="messages-container">
                    {messages.length === 0 && !isLoading && (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#gradient2)"/>
                                    <defs>
                                        <linearGradient id="gradient2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#4FBCFF"/>
                                            <stop offset="1" stopColor="#9C6ADE"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h2>How can I help you today?</h2>
                            <p>Ask me anything and I'll do my best to help.</p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}
                        >
                            {message.role === "assistant" && (
                                <div className="message-avatar">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#gradient3)"/>
                                        <defs>
                                            <linearGradient id="gradient3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#4FBCFF"/>
                                                <stop offset="1" stopColor="#9C6ADE"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            )}
                            <div className="message-content">
                                {message.role === "user" ? (
                                    <p>{message.content}</p>
                                ) : (
                                    formatMessage(message.content)
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator or streamed response */}
                    {(isLoading || isTyping) && (
                        <div className="message assistant-message">
                            <div className="message-avatar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#gradient4)"/>
                                    <defs>
                                        <linearGradient id="gradient4" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#4FBCFF"/>
                                            <stop offset="1" stopColor="#9C6ADE"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="message-content">
                                {isTyping && displayedResponse ? (
                                    formatMessage(displayedResponse)
                                ) : (
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form className="input-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="message-input"
                            placeholder="Message Loopify AI..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading || isTyping}
                        />
                        <button 
                            type="submit" 
                            className="send-button" 
                            disabled={!inputValue.trim() || isLoading || isTyping}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M18.5 1.5L9.5 10.5M18.5 1.5L12.5 18.5L9.5 10.5M18.5 1.5L1.5 7.5L9.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <p className="input-hint">Loopify AI can make mistakes. Consider checking important information.</p>
                </form>
            </div>
        </div>
    );
};

export default AnswerConversation;

