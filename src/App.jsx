import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJarvis } from './hooks/useJarvis';
import ArcReactor from './components/ArcReactor';
import Terminal from './components/Terminal';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Mic, MicOff, Send, Terminal as TerminalIcon, Volume2, Code2 } from 'lucide-react';
import CodeArchitectPanel from './components/CodeArchitectPanel';


function App() {
    const { messages, setMessages, sendMessage, isThinking, systemStats } = useJarvis();
    const [input, setInput] = useState('');
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [showTerminal, setShowTerminal] = useState(true);
    const [architectCode, setArchitectCode] = useState('');
    const [architectLang, setArchitectLang] = useState('javascript');
    const [isArchitectOpen, setIsArchitectOpen] = useState(false);
    const scrollRef = useRef(null);

    // Detect Code Blocks in messages
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
            const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/;
            const match = lastMsg.content.match(codeBlockRegex);
            if (match) {
                setArchitectLang(match[1]);
                setArchitectCode(match[2].trim());
                // Auto-open panel on code generation if not already open
                if (!isArchitectOpen) setIsArchitectOpen(true);
            }
        }
    }, [messages]);

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
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="min-h-screen bg-black text-cyan-500 font-sans overflow-hidden selection:bg-cyan-500/30">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-900/10 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full p-6 flex justify-between items-center z-40 bg-gradient-to-b from-black via-black/80 to-transparent">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-[0.2em] font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 animate-pulse">
                        J.A.R.V.I.S
                    </h1>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                        <span className="text-[10px] font-mono text-cyan-400 tracking-tighter uppercase">Connection Stable</span>
                    </div>
                    {messages.some(m => m.content.includes('```')) && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-950/30 border border-yellow-500/20 animate-pulse">
                            <TerminalIcon size={12} className="text-yellow-500" />
                            <span className="text-[10px] font-mono text-yellow-500 tracking-tighter uppercase font-bold tracking-[0.2em]">Architect Protocol: ACTIVE</span>
                        </div>
                    )}
                </div>


                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setIsArchitectOpen(!isArchitectOpen)}
                        className={`p-2 rounded-full border transition-all ${isArchitectOpen ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_#06b6d4]' : 'border-cyan-500/50 hover:bg-cyan-900/30'}`}
                        title="Toggle Architect Workspace"
                    >
                        <Code2 size={20} />
                    </button>

                    <button
                        onClick={() => {
                            setShowComingSoon(true);
                            setTimeout(() => setShowComingSoon(false), 3000);
                        }}
                        className="p-2 rounded-full border border-cyan-500/50 hover:bg-cyan-900/30 transition-all"
                        title="Voice Synthesis"
                    >
                        <Volume2 size={20} />
                    </button>

                    <button
                        onClick={() => setShowTerminal(!showTerminal)}
                        className={`p-2 rounded-full border border-cyan-500/50 hover:bg-cyan-900/30 transition-all ${showTerminal ? 'bg-cyan-900/30 shadow-[0_0_15px_#06b6d4]' : ''}`}
                    >
                        <TerminalIcon size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex h-screen overflow-hidden">
                <motion.main
                    animate={{ width: isArchitectOpen ? '50%' : '100%' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="relative z-10 h-full flex flex-col pt-24 pb-24"
                >
                    <div className="container mx-auto h-full flex flex-col">
                        {/* Central Visualization */}
                        <div className="hidden md:flex justify-center flex-shrink-0 mb-8">
                            <ArcReactor isThinking={isThinking} />
                        </div>

                        {/* Chat History HUD */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto px-4 md:px-20 space-y-6 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-transparent"
                        >
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-cyan-800 opacity-50 font-mono">
                                    <p className="animate-pulse">INITIALIZING PROTOCOLS...</p>
                                    <p className="text-xs mt-2 text-cyan-900">WAITING FOR COMMAND INPUT</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div
                                        className={`max-w-3xl p-6 relative overflow-hidden group transition-all duration-300
                          ${msg.role === 'user'
                                                ? 'bg-cyan-950/30 border border-cyan-500/30 text-cyan-50 rounded-2xl rounded-tr-sm backdrop-blur-md'
                                                : 'bg-black/60 border border-cyan-500/40 text-cyan-300 rounded-2xl rounded-tl-sm shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl'
                                            }`}
                                    >
                                        {/* Decorative Corner Accents for Assistant */}
                                        {msg.role === 'assistant' && (
                                            <>
                                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 opacity-50"></div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 opacity-50"></div>
                                            </>
                                        )}

                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-3 border-b border-cyan-800/30 pb-2">
                                                <TerminalIcon size={14} className="text-cyan-400" />
                                                <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase opacity-80">Jarvis System // v2.1</span>
                                            </div>
                                        )}

                                        <div className={`prose prose-invert prose-p:leading-relaxed max-w-none ${msg.role === 'assistant' ? 'text-lg font-light tracking-wide' : 'text-base font-medium'}`}>
                                            <ReactMarkdown
                                                components={{
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        const codeString = String(children).replace(/\n$/, '');

                                                        return !inline && match ? (
                                                            <div className="relative group/code my-4">
                                                                <div className="absolute -top-3 right-4 px-3 py-1 bg-cyan-900 border border-cyan-500 rounded text-[10px] font-mono text-cyan-100 z-10 uppercase tracking-widest opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                                    {match[1]}
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(codeString);
                                                                    }}
                                                                    className="absolute top-2 right-2 p-2 bg-black/50 border border-cyan-500/30 rounded hover:bg-cyan-500 hover:text-black transition-all opacity-0 group-hover/code:opacity-100 z-20"
                                                                    title="Copy Code"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                                                                </button>
                                                                <SyntaxHighlighter
                                                                    style={vscDarkPlus}
                                                                    language={match[1]}
                                                                    PreTag="div"
                                                                    className="rounded-xl border border-cyan-900/50 !bg-black/80 !p-6"
                                                                    {...props}
                                                                >
                                                                    {codeString}
                                                                </SyntaxHighlighter>
                                                            </div>
                                                        ) : (
                                                            <code className={`${className} bg-cyan-950/40 px-1.5 py-0.5 rounded text-cyan-200`} {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    }
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>

                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start animate-pulse mb-6">
                                    <div className="bg-black/40 border border-cyan-500/30 px-6 py-4 rounded-full flex items-center gap-3 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                                        <span className="text-xs font-mono text-cyan-400 tracking-widest ml-2">PROCESSING...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.main>

                <CodeArchitectPanel
                    code={architectCode}
                    language={architectLang}
                    isOpen={isArchitectOpen}
                    onClose={() => setIsArchitectOpen(false)}
                />
            </div>

            {/* Input Area */}
            <footer className="fixed bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-40 backdrop-blur-sm">
                <motion.div
                    animate={{ width: isArchitectOpen ? '50%' : '100%', left: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="container mx-auto max-w-4xl relative"
                >
                    <form onSubmit={handleSubmit} className="relative group transition-all duration-300 hover:scale-[1.01]">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="COMMAND REQUIRED..."
                            className="relative w-full bg-black border border-cyan-800 rounded-full py-5 pl-8 pr-36 text-cyan-100 placeholder:text-cyan-900/70 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all font-mono text-lg tracking-wide"
                        />

                        <div className="absolute right-3 top-2.5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsVoiceActive(!isVoiceActive)}
                                className={`p-3 rounded-full transition-all ${isVoiceActive ? 'bg-red-900/50 text-red-500 animate-pulse' : 'hover:bg-cyan-900/50 text-cyan-600'}`}
                            >
                                {isVoiceActive ? <Mic size={22} /> : <MicOff size={22} />}
                            </button>
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-3 rounded-full bg-cyan-900/30 text-cyan-400 border border-cyan-600/30 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50 disabled:hover:bg-cyan-900/30 disabled:hover:text-cyan-400"
                            >
                                <Send size={22} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            </footer>

            {/* Coming Soon Notification */}
            {showComingSoon && (
                <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className="bg-black/90 border border-cyan-500/50 rounded-lg p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            <div>
                                <p className="text-cyan-400 font-mono text-sm font-semibold">VOICE SYNTHESIS</p>
                                <p className="text-cyan-600 text-xs mt-1">Feature coming soon...</p>
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

export default App;
