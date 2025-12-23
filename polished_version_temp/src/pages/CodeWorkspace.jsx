import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Bug, Sparkles, FileCode, Search, Terminal as TerminalIcon, ChevronRight, Send, X } from 'lucide-react';
import { soundManager } from '../utils/soundManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useCodeAI } from '../hooks/useCodeAI';
import ReactMarkdown from 'react-markdown';
import HolographicWrapper from '../components/HolographicWrapper';

const CodeWorkspace = () => {
    const [code, setCode] = useState('// Stark Industries // Project J.A.R.V.I.S\n\nfunction initializeSystem() {\n  console.log("Systems Online.");\n}\n\ninitializeSystem();');
    const [language, setLanguage] = useState('javascript');
    const [fileName, setFileName] = useState('main.js');
    const [terminalOutput, setTerminalOutput] = useState(['Systems Initializing...', 'Stark-IDE Cloud Sync: ACTIVE', 'Welcome, Mr. Stark.']);
    const [aiChat, setAiChat] = useState([]);
    const [aiInput, setAiInput] = useState('');
    const [showAiSidebar, setShowAiSidebar] = useState(true);

    const { analyzeCode, isGenerating } = useCodeAI();

    const handleRun = () => {
        soundManager.playClick();
        setTerminalOutput(prev => [...prev, `> Executing ${fileName}...`, 'Output: Systems Online.']);
    };

    const handleAIAssist = async (mode) => {
        soundManager.playNotification();
        setTerminalOutput(prev => [...prev, `[JARVIS] Running ${mode} protocol...`]);

        const result = await analyzeCode(code, mode);

        setAiChat(prev => [...prev, { role: 'user', content: `Run ${mode} on this code.` }, { role: 'jarvis', content: result }]);
        setTerminalOutput(prev => [...prev, `[SYSTEM] ${mode} analysis complete. Check side panel.`]);
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;

        soundManager.playSend();
        const userInput = aiInput;
        setAiInput('');
        setAiChat(prev => [...prev, { role: 'user', content: userInput }]);

        const result = await analyzeCode(code, `CUSTOM: ${userInput}`);
        soundManager.playReceive();
        setAiChat(prev => [...prev, { role: 'jarvis', content: result }]);
    };

    return (
        <div className="flex h-screen bg-[#050505] text-cyan-400 pl-20 overflow-hidden font-sans uppercase tracking-[.1em]">
            {/* Project Sidebar */}
            <aside className="w-56 bg-black/40 border-r border-cyan-500/10 flex flex-col pt-20">
                <HolographicWrapper className="flex-1 flex flex-col p-2">
                    <div className="px-4 mb-6">
                        <h2 className="text-[10px] text-cyan-800 tracking-[0.3em] font-bold uppercase mb-4 flex items-center gap-2">
                            <FileCode size={12} /> Project Navigator
                        </h2>
                        <ul className="space-y-1">
                            <li className="flex items-center gap-2 p-2 bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-100 rounded-r-sm cursor-pointer hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                <FileCode size={14} className="text-cyan-400" />
                                <span className="text-sm font-mono tracking-tighter">main.js</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-auto p-4 bg-cyan-950/5 border-t border-cyan-500/10 rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 text-cyan-500 mb-3">
                            <Bug size={14} className="animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Debug Shell</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleAIAssist('OPTIMIZE')}
                                disabled={isGenerating}
                                className="text-[10px] font-bold bg-cyan-900/20 hover:bg-cyan-400 hover:text-black border border-cyan-400/30 p-2.5 rounded transition-all uppercase tracking-tighter disabled:opacity-50"
                            >
                                Optimize Logic
                            </button>
                            <button
                                onClick={() => handleAIAssist('DEBUG')}
                                disabled={isGenerating}
                                className="text-[10px] font-bold bg-red-950/10 hover:bg-red-500 hover:text-white border border-red-500/30 p-2.5 rounded transition-all uppercase tracking-tighter disabled:opacity-50"
                            >
                                Bug Scan
                            </button>
                        </div>
                    </div>
                </HolographicWrapper>
            </aside>

            {/* Main Editor Area */}
            <main className="flex-1 flex flex-col pt-16 relative">
                {/* Editor Top Bar */}
                <div className="h-12 bg-black/60 backdrop-blur-md border-b border-cyan-500/10 flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-900 tracking-[0.5em]">
                        <span className="text-[10px] font-bold uppercase">STARK-IDE // GRID-J01</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleRun}
                            className="flex items-center gap-2 px-5 py-1 bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all text-[10px] font-bold uppercase tracking-[.2em] shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        >
                            <Play size={12} fill="currentColor" /> Run Routine
                        </button>
                        <button
                            onClick={() => setShowAiSidebar(!showAiSidebar)}
                            className={`p-2 rounded-full border transition-all ${showAiSidebar ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-black border-cyan-900 text-cyan-900'}`}
                        >
                            <Sparkles size={16} />
                        </button>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 bg-[#050505]">
                    <Editor
                        height="100%"
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val)}
                        options={{
                            minimap: { enabled: true },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            backgroundColor: '#050505',
                            padding: { top: 20 },
                            cursorBlinking: 'phase',
                            renderLineHighlight: 'all',
                            fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                        }}
                    />

                    {isGenerating && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center flex-col gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-2 border-cyan-900 rounded-full"></div>
                                <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin"></div>
                                <div className="absolute inset-4 border-b-2 border-cyan-600 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-cyan-400 text-[10px] tracking-[0.8em] font-mono animate-pulse uppercase">Neural Analysis in Progress</span>
                        </div>
                    )}
                </div>

                {/* Bottom Terminal */}
                <div className="h-44 bg-black border-t border-cyan-500/10 flex flex-col z-10 p-2">
                    <HolographicWrapper className="flex-1 flex flex-col bg-cyan-950/5 rounded-lg overflow-hidden border border-cyan-500/5">
                        <div className="h-8 bg-black/40 px-4 flex items-center gap-2 border-b border-cyan-500/10">
                            <TerminalIcon size={12} className="text-cyan-500" />
                            <span className="text-[10px] text-cyan-800 font-bold uppercase tracking-[.3em]">System Diagnostics</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] space-y-1 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                            {terminalOutput.map((line, i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="text-cyan-900/50">[{new Date().toLocaleTimeString()}]</span>
                                    <span className={line.includes('>') ? 'text-white' : 'text-cyan-600'}>{line}</span>
                                </div>
                            ))}
                        </div>
                    </HolographicWrapper>
                </div>
            </main>

            {/* AI Assistant Sidebar */}
            <AnimatePresence>
                {showAiSidebar && (
                    <motion.aside
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="w-[400px] bg-[#080808] border-l border-cyan-500/10 flex flex-col pt-16 z-30 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
                    >
                        <HolographicWrapper className="flex-1 flex flex-col p-2">
                            <div className="h-12 border-b border-cyan-500/10 flex items-center justify-between px-6">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-cyan-400" />
                                    <h3 className="text-xs font-bold uppercase tracking-[.2em] text-cyan-100">AI Assistant</h3>
                                </div>
                                <button onClick={() => setShowAiSidebar(false)} className="text-cyan-900 hover:text-cyan-400 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                                {aiChat.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-8">
                                        <Sparkles size={48} className="text-cyan-900 mb-4" />
                                        <p className="text-xs font-mono uppercase tracking-[.2em] text-cyan-500">
                                            Optimization routines loaded. Select a protocol or enter a custom query.
                                        </p>
                                    </div>
                                ) : (
                                    aiChat.map((msg, i) => (
                                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`
                                                max-w-[90%] p-4 rounded-xl text-xs font-mono leading-relaxed bg-black/40 border border-cyan-500/10
                                                ${msg.role === 'user'
                                                    ? 'text-cyan-200'
                                                    : 'text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.05)]'}
                                            `}>
                                                {msg.role === 'jarvis' && (
                                                    <div className="text-[10px] text-cyan-600 mb-2 border-b border-cyan-900/40 pb-1 font-bold uppercase tracking-widest">
                                                        Jarvis Logic Unit
                                                    </div>
                                                )}
                                                <div className="prose prose-invert prose-xs prose-cyan max-w-none">
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 border-t border-cyan-500/10 bg-black/40 rounded-b-xl">
                                <form onSubmit={handleChatSubmit} className="relative">
                                    <input
                                        value={aiInput}
                                        onChange={(e) => setAiInput(e.target.value)}
                                        placeholder="ASK JARVIS..."
                                        className="w-full bg-cyan-950/10 border border-cyan-800/40 rounded-lg py-3 pl-4 pr-12 text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400 transition-all placeholder:text-cyan-900/50"
                                    />
                                    <button type="submit" className="absolute right-3 top-2.5 text-cyan-600 hover:text-cyan-400 transition-colors">
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </HolographicWrapper>
                    </motion.aside>
                )}
            </AnimatePresence>

            <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[-1]"
                style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            ></div>
        </div>
    );
};

export default CodeWorkspace;
