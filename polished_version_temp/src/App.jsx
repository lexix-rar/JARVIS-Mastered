import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationSidebar from './components/NavigationSidebar';
import ChatHub from './pages/ChatHub';
import CodeWorkspace from './pages/CodeWorkspace';
import './styles/effects.css';

function App() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-[#020202] text-cyan-400 overflow-hidden relative cursor-none">
                <NavigationSidebar />

                {/* Custom Cursor */}
                <div
                    className="custom-cursor fixed w-4 h-4 bg-cyan-400 rounded-full pointer-events-none z-[10000] mix-blend-screen shadow-[0_0_15px_#06b6d4,0_0_30px_#06b6d4]"
                    style={{
                        left: mousePos.x,
                        top: mousePos.y,
                        transition: 'left 0.1s ease-out, top 0.1s ease-out'
                    }}
                />

                {/* Secondary Cursor Glow */}
                <div
                    className="fixed w-32 h-32 bg-cyan-500/10 rounded-full pointer-events-none z-[9999] blur-[40px]"
                    style={{
                        left: mousePos.x - 64,
                        top: mousePos.y - 64,
                        transition: 'left 0.3s ease-out, top 0.3s ease-out'
                    }}
                />

                <Routes>
                    <Route path="/" element={<ChatHub />} />
                    <Route path="/code" element={<CodeWorkspace />} />
                </Routes>

                {/* Global Visual Overlays */}
                <div className="scanline-effect"></div>

                {/* Holographic Vingnette */}
                <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-[9997]"></div>
            </div>
        </Router>
    );
}

export default App;
