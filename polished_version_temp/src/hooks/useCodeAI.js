import { useState, useCallback } from 'react';
import Groq from 'groq-sdk';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY_1;
const groq = API_KEY ? new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) : null;

export const useCodeAI = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const analyzeCode = async (code, mode) => {
        if (!groq) return "Sir, the neural link is offline. Please check your API key.";

        setIsGenerating(true);
        try {
            const systemPrompt = `You are J.A.R.V.I.S., Tony Stark's advanced AI assistant. You are currently in the Stark-IDE Code Workspace.
            Mode: ${mode === 'DEBUG' ? 'Solve bugs and explain fixes.' : 'Optimize performance and readability.'}
            
            Guidelines:
            - Your tone is witty, sophisticated, and helpful.
            - Provide code snippets in Markdown.
            - Be extremely precise.
            - Focus on the best engineering practices.`;

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Here is my code for analysis:\n\n${code}` }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.3,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Code AI Error:", error);
            return "Sir, I've encountered a glitch in the spectral analysis. Please try again.";
        } finally {
            setIsGenerating(false);
        }
    };

    const explainCode = async (code) => {
        if (!groq) return "Neural link offline.";
        setIsGenerating(true);
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are JARVIS. Explain this code simply but technically." },
                    { role: "user", content: code }
                ],
                model: "llama-3.1-8b-instant",
            });
            return completion.choices[0].message.content;
        } catch (e) {
            return "Explanation protocol failed.";
        } finally {
            setIsGenerating(false);
        }
    };

    return { analyzeCode, explainCode, isGenerating };
};
