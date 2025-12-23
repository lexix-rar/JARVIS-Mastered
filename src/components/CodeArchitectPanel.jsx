import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Minimize2, Copy, Download, Play, Check, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CodeArchitectPanel = ({ code, language, isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [deployStatus, setDeployStatus] = useState('idle'); // idle, deploying, success

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `stark_project.${language || 'txt'}`;
        document.body.appendChild(element);
        element.click();
    };

    const handleDeploy = () => {
        setDeployStatus('deploying');
        // Simulate a holographic deployment sequence
        setTimeout(() => setDeployStatus('success'), 4000);
        setTimeout(() => setDeployStatus('idle'), 7000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="fixed top-0 right-0 h-full w-1/2 bg-black border-l border-cyan-500/30 z-[100] flex flex-col backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
                >
                    {/* Scanline Overlay for panel */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150"></div>

                    {/* Panel Header */}
                    <div className="h-16 border-b border-cyan-500/20 flex items-center justify-between px-6 bg-cyan-950/20 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
                            <h2 className="text-sm font-mono font-bold tracking-[0.3em] text-cyan-100 uppercase">
                                STARK ARCHITECT // OUTPUT
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleDownload}
                                className="p-2 text-cyan-600 hover:text-cyan-400 transition-colors"
                                title="Download Project"
                            >
                                <Download size={18} />
                            </button>
                            <button
                                onClick={handleCopy}
                                className="p-2 text-cyan-600 hover:text-cyan-400 transition-colors"
                                title="Copy Source"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 bg-cyan-500/10 rounded flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all border border-cyan-500/30"
                            >
                                <Minimize2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 relative group bg-black/40">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language || 'javascript'}
                            value={code}
                            options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                readOnly: false,
                                padding: { top: 20 },
                                cursorBlinking: 'smooth',
                                renderLineHighlight: 'all',
                                backgroundColor: '#00000000'
                            }}
                        />

                        {/* Interactive HUD Elements */}
                        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 z-20">
                            <AnimatePresence>
                                {deployStatus === 'deploying' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-cyan-950/80 border border-cyan-500/50 p-4 rounded-lg backdrop-blur-md mb-2 w-64 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Compiling Assets...</span>
                                            <span className="text-[10px] font-mono text-cyan-400">74%</span>
                                        </div>
                                        <div className="w-full h-1 bg-cyan-900 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 3.5 }}
                                                className="h-full bg-cyan-400"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={handleDeploy}
                                disabled={deployStatus !== 'idle'}
                                className={`px-8 py-3 rounded font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-3 overflow-hidden relative group
                                    ${deployStatus === 'idle' ? 'bg-cyan-500 text-black shadow-[0_0_15px_#06b6d4] hover:scale-105 active:scale-95' :
                                        deployStatus === 'deploying' ? 'bg-cyan-900 text-cyan-500 cursor-wait' :
                                            'bg-green-500 text-black shadow-[0_0_15px_#22c55e]'}`}
                            >
                                <Play size={14} className={deployStatus === 'deploying' ? 'animate-spin' : ''} />
                                {deployStatus === 'idle' ? 'Deploy Routine' :
                                    deployStatus === 'deploying' ? 'Analyzing...' :
                                        'System Integrated'}
                            </button>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="h-10 border-t border-cyan-500/10 bg-black px-6 flex items-center justify-between relative z-10">
                        <div className="flex gap-6 text-[10px] text-cyan-800 font-mono">
                            <span>Ln 1, Col 1</span>
                            <span>UTF-8</span>
                            <span className="text-cyan-600 uppercase tracking-tighter font-bold">{language || 'PLAINTEXT'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono italic">
                            <Code2 size={12} />
                            NEURAL SYNTAX ACTIVE
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CodeArchitectPanel;
