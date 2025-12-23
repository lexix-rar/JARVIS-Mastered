import React, { useEffect, useRef } from 'react';

const Particles = ({ isActive = true }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;

        // Set canvas size
        canvas.width = 400;
        canvas.height = 400;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = canvas.width / 2;
                this.y = canvas.height / 2;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 0.5 + 0.2;
                this.radius = Math.random() * 2 + 1;
                this.opacity = 1;
                this.decay = Math.random() * 0.01 + 0.005;
            }

            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.opacity -= this.decay;

                if (this.opacity <= 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#06b6d4';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#06b6d4';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isActive) {
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [isActive]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default Particles;
