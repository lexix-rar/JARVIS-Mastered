import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Users, Fingerprint, X, ShieldCheck } from 'lucide-react';
import { getUsers, createUser, setCurrentUser, deleteUser } from '../lib/memory';

const IdentityGate = ({ onSelect }) => {
    const [users, setUsers] = useState(getUsers());
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        const user = createUser(newName);
        setUsers(getUsers());
        setNewName('');
        setIsCreating(false);
    };

    const handleSelect = (user) => {
        setCurrentUser(user.id);
        onSelect(user);
    };

    const handleDelete = (e, userId) => {
        e.stopPropagation();
        deleteUser(userId);
        setUsers(getUsers());
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-2xl bg-black border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)]"
            >
                <div className="p-8 border-b border-cyan-500/20 bg-cyan-950/20 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-mono font-bold text-cyan-400 tracking-widest flex items-center gap-3">
                            <ShieldCheck className="text-cyan-400" /> IDENTITY CHECK
                        </h2>
                        <p className="text-cyan-700 text-xs mt-1 font-mono tracking-wider">PROTOCOL 0: SELECT OR CREATE USER PROFILE</p>
                    </div>
                </div>

                <div className="p-8">
                    {!isCreating ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-900">
                                {users.map((user) => (
                                    <motion.button
                                        key={user.id}
                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(6,182,212,0.1)' }}
                                        onClick={() => handleSelect(user)}
                                        className="group relative p-4 rounded-2xl border border-cyan-900/50 bg-black/40 flex items-center gap-4 text-left transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-full border border-cyan-400/30 overflow-hidden bg-cyan-950/50">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-cyan-100 font-mono font-bold tracking-wide">{user.name}</h3>
                                            <p className="text-cyan-900 text-xxs font-mono uppercase">Profile Active</p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, user.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-cyan-900 hover:text-red-500 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </motion.button>
                                ))}

                                <motion.button
                                    whileHover={{ scale: 1.02, borderColor: 'rgba(6,182,212,0.5)' }}
                                    onClick={() => setIsCreating(true)}
                                    className="p-4 rounded-2xl border border-dashed border-cyan-900 bg-cyan-950/10 flex items-center justify-center gap-3 text-cyan-700 hover:text-cyan-400 transition-all font-mono"
                                >
                                    <UserPlus size={20} /> NEW IDENTITY
                                </motion.button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleCreate} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-cyan-600 tracking-widest uppercase">Input Designation Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter Name..."
                                    className="w-full bg-cyan-950/10 border border-cyan-500/30 rounded-xl p-4 text-cyan-100 font-mono focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 p-4 rounded-xl border border-cyan-900 text-cyan-700 font-mono hover:bg-cyan-950/20 transition-all"
                                >
                                    BACK
                                </button>
                                <button
                                    type="submit"
                                    className="flex-3 p-4 rounded-xl bg-cyan-500 text-black font-mono font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                >
                                    INITIALIZE IDENTITY
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="px-8 py-4 bg-cyan-950/10 border-t border-cyan-500/10 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xxs font-mono text-cyan-900">
                        <Fingerprint size={12} /> BIOMETRIC SCAN READY
                    </div>
                    <div className="text-xxs font-mono text-cyan-900 animate-pulse">
                        STARK INDUSTRIES SECURE PROTOCOL
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default IdentityGate;
