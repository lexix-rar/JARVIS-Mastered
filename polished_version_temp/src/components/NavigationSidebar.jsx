import React from 'react';
import { MessageSquare, Code2, Settings, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { soundManager } from '../utils/soundManager';

const NavigationSidebar = () => {
    const navItems = [
        { icon: <MessageSquare size={24} />, label: 'Chat HUD', path: '/' },
        { icon: <Code2 size={24} />, label: 'Stark IDE', path: '/code' }
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 bg-black/80 border-r border-cyan-500/20 z-50 backdrop-blur-xl">
            <div className="mb-12">
                <Shield size={32} className="text-cyan-400 animate-pulse" />
            </div>

            <nav className="flex flex-col gap-8 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onMouseEnter={() => soundManager.playHover()}
                        onClick={() => soundManager.playClick()}
                        className={({ isActive }) => `
              relative p-3 rounded-xl transition-all duration-300 group
              ${isActive
                                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-500/30'
                                : 'text-cyan-900 hover:text-cyan-600'}
            `}
                    >
                        {item.icon}
                        <span className="absolute left-full ml-4 px-2 py-1 bg-cyan-500 text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <button
                    onMouseEnter={() => soundManager.playHover()}
                    className="p-3 text-cyan-900 hover:text-cyan-400 transition-colors"
                >
                    <Settings size={24} />
                </button>
            </div>
        </aside>
    );
};

export default NavigationSidebar;
