import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Server, Cpu } from 'lucide-react';

const Terminal = ({ stats, isOpen }) => {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: isOpen ? 0 : 300, opacity: isOpen ? 1 : 0 }}
            className="fixed right-5 top-20 w-80 bg-black/80 border border-cyan-500/30 backdrop-blur-md rounded-lg p-4 font-mono text-xs z-50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
        >
            <div className="flex items-center justify-between mb-4 border-b border-cyan-900/50 pb-2">
                <h3 className="text-cyan-400 font-bold tracking-widest uppercase flex items-center gap-2">
                    <Activity size={14} /> System Diagnostics
                </h3>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
            </div>

            <div className="space-y-4">
                {/* CPU/RAM Block */}
                <div className="bg-cyan-900/10 p-2 rounded border-l-2 border-cyan-500">
                    <div className="flex justify-between items-center text-cyan-300 mb-1">
                        <span className="flex items-center gap-2"><Cpu size={12} /> MEMORY USAGE</span>
                        <span>{stats.ram}%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-cyan-500"
                            animate={{ width: `${stats.ram}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                        />
                    </div>
                </div>

                {/* Latency Block */}
                <div className="bg-cyan-900/10 p-2 rounded border-l-2 border-cyan-500">
                    <div className="flex justify-between items-center text-cyan-300 mb-1">
                        <span className="flex items-center gap-2"><Server size={12} /> LATENCY</span>
                        <span>{stats.latency}ms</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-green-500"
                            animate={{ width: `${Math.min(stats.latency / 2, 100)}%` }} // 200ms = 100%
                        />
                    </div>
                </div>

                {/* Log Output Mock */}
                <div className="h-32 overflow-hidden relative">
                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/80 to-transparent"></div>
                    <div className="text-cyan-700 space-y-1 mt-2 opacity-70">
                        <p>{`> Connecting to Neural Net... [OK]`}</p>
                        <p>{`> Loading Memory Modules... [OK]`}</p>
                        <p>{`> Optimizing Context Layer...`}</p>
                        <p>{`> Latency Check: ${stats.latency}ms`}</p>
                        <p>{`> Processing User Input...`}</p>
                        <p>{`> Action Classifier: READY`}</p>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default Terminal;
