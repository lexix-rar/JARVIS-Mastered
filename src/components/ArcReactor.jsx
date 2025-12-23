import React from 'react';
import { motion } from 'framer-motion';

const ArcReactor = ({ isThinking }) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

            {/* Outer Ring */}
            <motion.div
                className="absolute w-full h-full border-4 border-cyan-800 rounded-full border-t-cyan-400 border-r-cyan-400"
                animate={{ rotate: 360 }}
                transition={{ duration: isThinking ? 2 : 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner Ring */}
            <motion.div
                className="absolute w-48 h-48 border-2 border-cyan-600 rounded-full border-b-cyan-200"
                animate={{ rotate: -360 }}
                transition={{ duration: isThinking ? 2 : 5, repeat: Infinity, ease: "linear" }}
            />

            {/* Core Detail */}
            <div className="absolute w-32 h-32 border border-cyan-500/30 rounded-full flex items-center justify-center">
                {/* Triangle Reactor Shape */}
                <div className="w-20 h-20 bg-cyan-900/20 backdrop-blur-md rounded-full border border-cyan-400/50 flex items-center justify-center relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-transparent to-transparent opacity-50"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="w-8 h-8 bg-cyan-100 rounded-full shadow-[0_0_20px_#06b6d4]"
                        animate={{ scale: isThinking ? [1, 1.5, 1] : [1, 1.1, 1] }}
                        transition={{ duration: isThinking ? 0.5 : 2, repeat: Infinity }}
                    />
                </div>
            </div>

            {/* Text Overlay for status */}
            <div className="absolute bottom-[-40px] text-cyan-400 text-xs font-mono tracking-[0.2em] uppercase">
                {isThinking ? "PROCESSING DATA" : "SYSTEM ONLINE"}
            </div>
        </div>
    );
};

export default ArcReactor;
