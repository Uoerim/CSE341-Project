import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Groq uses OpenAI-compatible API
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// @desc    Send message to AI and get response
// @route   POST /api/ai/chat
// @access  Public
export const chat = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "Groq API key not configured" });
        }

        // Build messages array with conversation history
        const messages = [
            {
                role: "system",
                content: `You are Loopify AI, a helpful and friendly assistant for the Loopify social platform. 
You provide helpful, accurate, and engaging responses to user questions.
Keep your responses concise but informative.
Be conversational and friendly in tone.
If you don't know something, say so honestly.
Format your responses using markdown when appropriate for better readability.`
            },
            ...conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: "user",
                content: message
            }
        ];

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        res.json({
            success: true,
            reply: reply,
        });
    } catch (error) {
        console.error("Groq API Error:", error);
        
        if (error.code === "insufficient_quota" || error.message?.includes("quota")) {
            return res.status(429).json({ error: "API quota exceeded. Please try again later." });
        }
        
        if (error.code === "invalid_api_key" || error.message?.includes("API key")) {
            return res.status(401).json({ error: "Invalid API key configuration" });
        }

        res.status(500).json({ 
            error: "Failed to get AI response", 
            details: error.message 
        });
    }
};

// @desc    Stream message to AI and get response (SSE)
// @route   POST /api/ai/chat/stream
// @access  Public
export const chatStream = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "Groq API key not configured" });
        }

        // Set headers for SSE
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // Build messages array with conversation history
        const messages = [
            {
                role: "system",
                content: `You are Loopify AI, a helpful and friendly assistant for the Loopify social platform. 
You provide helpful, accurate, and engaging responses to user questions.
Keep your responses concise but informative.
Be conversational and friendly in tone.
If you don't know something, say so honestly.
Format your responses using markdown when appropriate for better readability.`
            },
            ...conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: "user",
                content: message
            }
        ];

        const stream = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        console.error("Groq Stream Error:", error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
};
