import React, { useState, useEffect, useRef } from 'react';
import { useJarvis } from '../hooks/useJarvis';
import ArcReactor from '../components/ArcReactor';
import Terminal from '../components/Terminal';
import TypingText from '../components/TypingText';
import HolographicWrapper from '../components/HolographicWrapper';
import ReactMarkdown from 'react-markdown';
import { Mic, MicOff, Send, Terminal as TerminalIcon, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

function ChatHub() {
    const { messages, setMessages, sendMessage, isThinking, systemStats } = useJarvis();
    const [input, setInput] = useState('');
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [showTerminal, setShowTerminal] = useState(true);
    const scrollRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Voice Recognition Setup
    useEffect(() => {
        let recognition;
        if (isVoiceActive) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (event) => {
                    const transcript = event.results[event.results.length - 1][0].transcript;
                    setInput(transcript);
                };

                recognition.start();
            }
        }
        return () => {
            if (recognition) recognition.stop();
        };
    }, [isVoiceActive]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        soundManager.playSend();
        sendMessage(input);
        setInput('');
    };

    // Play sound when JARVIS responds
    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
            soundManager.playReceive();
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-black text-cyan-500 font-sans overflow-hidden selection:bg-cyan-500/30 pl-20 uppercase tracking-wider">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-900/10 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Header */}
            <header className="fixed top-0 left-20 right-0 p-6 flex justify-between items-center z-40 bg-gradient-to-b from-black via-black/80 to-transparent">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-[0.2em] font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 animate-pulse glitch-text cursor-default">
                        J.A.R.V.I.S
                    </h1>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                        <span className="text-[10px] font-mono text-cyan-400 tracking-tighter uppercase">Neural Net Link: Stable</span>
                    </div>
                </div>

                <div className="flex gap-4 items-center pr-6">
                    <button
                        onClick={() => {
                            soundManager.playNotification();
                            setShowComingSoon(true);
                            setTimeout(() => setShowComingSoon(false), 3000);
                        }}
                        onMouseEnter={() => soundManager.playHover()}
                        className="p-2 rounded-full border border-cyan-500/50 hover:bg-cyan-900/30 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                        title="Voice Synthesis"
                    >
                        <Volume2 size={20} />
                    </button>

                    <button
                        onClick={() => {
                            soundManager.playClick();
                            setShowTerminal(!showTerminal);
                        }}
                        onMouseEnter={() => soundManager.playHover()}
                        className={`p-2 rounded-full border border-cyan-500/50 hover:bg-cyan-900/30 transition-all ${showTerminal ? 'bg-cyan-900/30 shadow-[0_0_15px_#06b6d4]' : ''}`}
                    >
                        <TerminalIcon size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 container mx-auto h-screen flex flex-col pt-24 pb-24">
                {/* Central Visualization */}
                <div className="hidden md:flex justify-center flex-shrink-0 mb-8">
                    <ArcReactor isThinking={isThinking} />
                </div>

                {/* Chat History HUD */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 md:px-20 space-y-6 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-transparent pb-10"
                >
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-cyan-800 opacity-50 font-mono">
                            <p className="animate-pulse tracking-[0.5em]">INITIALIZING COGNITIVE PROTOCOLS...</p>
                            <p className="text-xs mt-2 text-cyan-900">WAITING FOR COMMAND INPUT</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <HolographicWrapper className="max-w-3xl">
                                <div
                                    className={`p-6 relative overflow-hidden group transition-all duration-300
                    ${msg.role === 'user'
                                            ? 'bg-cyan-950/20 border border-cyan-500/30 text-cyan-50 rounded-2xl rounded-tr-sm backdrop-blur-md'
                                            : 'bg-black/80 border border-cyan-500/40 text-cyan-300 rounded-2xl rounded-tl-sm shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-xl'
                                        }`}
                                >
                                    {msg.role === 'assistant' && (
                                        <>
                                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                        </>
                                    )}

                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-3 border-b border-cyan-800/30 pb-2">
                                            <TerminalIcon size={14} className="text-cyan-400" />
                                            <span className="text-[10px] font-mono text-cyan-500 tracking-[0.3em] uppercase opacity-70">Neural Link // v4.2</span>
                                        </div>
                                    )}

                                    <div className={`prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-cyan-900/50 ${msg.role === 'assistant' ? 'text-lg font-light tracking-wide' : 'text-base font-medium'}`}>
                                        {msg.role === 'assistant' && idx === messages.length - 1 ? (
                                            <TypingText text={msg.content} speed={20} />
                                        ) : (
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            </HolographicWrapper>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start animate-pulse mb-6">
                            <div className="bg-black/40 border border-cyan-500/30 px-6 py-4 rounded-full flex items-center gap-3 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                                <span className="text-xs font-mono text-cyan-400 tracking-widest ml-2 uppercase">Synthesizing...</span>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Input Area */}
            <footer className="fixed bottom-0 left-20 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-40 backdrop-blur-sm">
                <div className="container mx-auto max-w-4xl relative">
                    <form onSubmit={handleSubmit} className="relative group transition-all duration-300 hover:scale-[1.01]">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="COMMUNICATION PROTOCOL ACTIVE..."
                            className="relative w-full bg-black border border-cyan-800 rounded-full py-5 pl-8 pr-36 text-cyan-100 placeholder:text-cyan-900/70 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all font-mono text-lg tracking-wide"
                        />

                        <div className="absolute right-3 top-2.5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    soundManager.playClick();
                                    setIsVoiceActive(!isVoiceActive);
                                }}
                                onMouseEnter={() => soundManager.playHover()}
                                className={`p-3 rounded-full transition-all ${isVoiceActive ? 'bg-red-900/50 text-red-500 animate-pulse' : 'hover:bg-cyan-900/50 text-cyan-600'}`}
                            >
                                {isVoiceActive ? <Mic size={22} /> : <MicOff size={22} />}
                            </button>
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                onMouseEnter={() => !input.trim() ? null : soundManager.playHover()}
                                className="p-3 rounded-full bg-cyan-900/30 text-cyan-400 border border-cyan-600/30 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50 disabled:hover:bg-cyan-900/30 disabled:hover:text-cyan-400"
                            >
                                <Send size={22} />
                            </button>
                        </div>
                    </form>
                </div>
            </footer>

            {/* Coming Soon Notification */}
            {showComingSoon && (
                <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className="bg-black/90 border border-cyan-500/50 rounded-lg p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            <div>
                                <p className="text-cyan-400 font-mono text-sm font-semibold tracking-tighter uppercase">Neural Voice Module</p>
                                <p className="text-cyan-600 text-[10px] mt-1 uppercase tracking-widest font-bold">Protocol coming soon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Diagnostics Panel */}
            <Terminal stats={systemStats} isOpen={showTerminal} />
        </div>
    );
}

export default ChatHub;
