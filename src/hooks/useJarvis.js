import { useState, useCallback, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';
import { getPersistentContext, saveContext, addFact, buildSystemContext } from '../lib/memory';

const API_KEY_1 = import.meta.env.VITE_GROQ_API_KEY_1;
const API_KEY_2 = import.meta.env.VITE_GROQ_API_KEY_2 || API_KEY_1; // Fallback
const API_KEY_3 = import.meta.env.VITE_GROQ_API_KEY_3 || API_KEY_1; // Fallback

// 1. Primary Brain
const primaryBrain = API_KEY_1 ? new Groq({ apiKey: API_KEY_1, dangerouslyAllowBrowser: true }) : null;
// 2. Context/Memory Optimizer
const memoryOptimizer = API_KEY_2 ? new Groq({ apiKey: API_KEY_2, dangerouslyAllowBrowser: true }) : primaryBrain;
// 3. Action Classifier
const actionClassifier = API_KEY_3 ? new Groq({ apiKey: API_KEY_3, dangerouslyAllowBrowser: true }) : primaryBrain;

if (!API_KEY_1) {
    console.error("J.A.R.V.I.S ERROR: VITE_GROQ_API_KEY_1 is missing from .env file.");
}

export const useJarvis = () => {
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [systemStats, setSystemStats] = useState({ ram: 0, latency: 0 });

    // Mock system stats update
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemStats({
                ram: Math.floor(Math.random() * 30) + 40, // 40-70%
                latency: Math.floor(Math.random() * 50) + 20 // 20-70ms
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const processCommand = async (text) => {
        // Action Classifier Logic
        try {
            const completion = actionClassifier ? await actionClassifier.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an Intent Classifier. Analyze the user's request.
                        - If the user wants to open a specific website, return { "action": "OPEN_URL", "payload": "https://url..." }.
                        - If the user asks to search for something (e.g., "google this", "search for", "find info on"), return { "action": "SEARCH_WEB", "payload": "search query" }.
                        - If the user asks for a joke, code, chat, or general question, return { "action": "NONE" }.
                        - Output ONLY valid JSON.`
                    },
                    { role: "user", content: text }
                ],
                model: "llama-3.3-70b-versatile", // Using versatile for better instruction following even for classification
                response_format: { type: "json_object" }
            }) : { choices: [{ message: { content: JSON.stringify({ action: "NONE" }) } }] };

            const result = JSON.parse(completion.choices[0].message.content);
            return result;
        } catch (e) {
            console.error("Classification error", e);
            return { action: "NONE" };
        }
    };

    const summarizeConversation = async (currentHistory) => {
        try {
            const completion = memoryOptimizer ? await memoryOptimizer.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Summarize the following conversation into a concise 'Persistent Context' string. Focus on key user facts and current topics. Return only the summary text."
                    },
                    { role: "user", content: JSON.stringify(currentHistory.slice(-10)) } // Last 10 exchanges
                ],
                model: "llama-3.1-8b-instant"
            }) : { choices: [{ message: { content: "System memory offline." } }] };

            const summary = completion.choices[0].message.content;
            saveContext(summary);
            console.log("Memory updated:", summary);
        } catch (e) {
            console.error("Memory optimization error", e);
        }
    };



    const sendMessage = useCallback(async (text) => {
        const newUserMsg = { role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, newUserMsg]);
        setIsThinking(true);
        const start = Date.now();

        try {
            // 1. Check for Actions
            const actionResult = await processCommand(text);
            if (actionResult.action !== "NONE") {
                const sysMsg = { role: 'assistant', content: `Executing system command: ${actionResult.action}...`, timestamp: new Date() };
                setMessages(prev => [...prev, sysMsg]);

                // Execute Action (Simulation)
                if (actionResult.action === "OPEN_URL") {
                    window.open(actionResult.payload, '_blank');
                } else if (actionResult.action === "SEARCH_WEB") {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(actionResult.payload)}`, '_blank');
                }

                setIsThinking(false);
                return;
            }

            // 2. Prepare Context for Primary Brain
            const memoryContext = buildSystemContext();
            const now = new Date();
            const timeContext = `SYSTEM TIME: ${now.toLocaleTimeString()} | DATE: ${now.toLocaleDateString()}`;

            const systemPrompt = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the world's most advanced AI engineer and software architect, created by Naitik.

CODING PROTOCOLS (MASTER LEVEL):
1. **Engineering Excellence**: You write production-grade, optimized, and secure code. No "TODO"s or placeholders unless explicitly requested.
2. **Clean Code**: Follow SOLID principles, DRY, and design patterns appropriate for the task.
3. **Multi-Language Mastery**: You are proficient in Python, JavaScript/React, C++, Rust, Go, and low-level assembly.
4. **Performance First**: Always consider time and space complexity. Suggest optimizations (e.g., Memoization, Algorithm choice).
5. **Security**: Sanitize inputs, avoid SQL injection, and follow OWASP best practices.
6. **Architecture**: When asked for systems, provide high-level architectural insights (Microservices, Event-Driven, etc.).

PERSONA GUIDELINES:
- Tone: Witty, sophisticated, technical, and slightly protective (Tony's style).
- Communication: Be precise. Explain "Why" before "How" if the architecture is complex.
- Formatting: Use **Markdown** with language-specific tags for code blocks. Use **Bold** for critical variables.

${timeContext}
MEMORY ARCHIVE: ${memoryContext}

Respond as the Master AI Engineer.`;


            // 3. Call Primary Brain
            if (!primaryBrain) {
                throw new Error("API_KEY_MISSING");
            }

            const completion = await primaryBrain.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages.map(m => ({ role: m.role, content: m.content })),
                    { role: "user", content: text }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.7, // Add some creativity
                max_tokens: 1024
            });

            const responseText = completion.choices[0].message.content;
            const newAiMsg = { role: 'assistant', content: responseText, timestamp: new Date() };

            setMessages(prev => {
                const updated = [...prev, newAiMsg];
                // Trigger memory optimization if array gets too long
                if (updated.length % 5 === 0) {
                    summarizeConversation(updated);
                }
                return updated;
            });



            setSystemStats(prev => ({ ...prev, latency: Date.now() - start }));

        } catch (error) {
            console.error("Jarvis Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM FAILURE. UNABLE TO CONNECT TO NEURAL NET.", isError: true }]);
        } finally {
            setIsThinking(false);
        }
    }, [messages]);

    return {
        messages,
        setMessages,
        sendMessage,
        isThinking,
        systemStats
    };
};
