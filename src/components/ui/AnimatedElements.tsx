// Animated floating shapes for backgrounds - MORE VISIBLE VERSION
const FloatingShapes = ({ variant = "default" }: { variant?: "default" | "hero" | "light" }) => {
    const shapes = [
        { size: "w-48 h-48", top: "5%", left: "0%", delay: "0s", duration: "6s", color: "bg-secondary/40" },
        { size: "w-36 h-36", top: "15%", right: "5%", delay: "1s", duration: "7s", color: "bg-accent/30" },
        { size: "w-56 h-56", bottom: "10%", left: "10%", delay: "2s", duration: "8s", color: "bg-primary/30" },
        { size: "w-40 h-40", bottom: "25%", right: "15%", delay: "0.5s", duration: "5s", color: "bg-secondary/35" },
        { size: "w-32 h-32", top: "45%", left: "45%", delay: "1.5s", duration: "9s", color: "bg-accent/25" },
        { size: "w-44 h-44", top: "60%", right: "0%", delay: "3s", duration: "7s", color: "bg-primary/30" },
    ];

    const heroShapes = [
        { size: "w-96 h-96", top: "-15%", right: "-10%", delay: "0s", duration: "15s", color: "bg-white/20" },
        { size: "w-72 h-72", bottom: "-10%", left: "-10%", delay: "2s", duration: "12s", color: "bg-secondary/30" },
        { size: "w-48 h-48", top: "25%", left: "5%", delay: "1s", duration: "10s", color: "bg-white/25" },
        { size: "w-40 h-40", bottom: "15%", right: "10%", delay: "3s", duration: "8s", color: "bg-accent/20" },
    ];

    const shapesData = variant === "hero" ? heroShapes : shapes;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapesData.map((shape, index) => (
                <div
                    key={index}
                    className={`absolute rounded-full ${shape.size} ${shape.color} blur-3xl`}
                    style={{
                        top: shape.top,
                        bottom: shape.bottom,
                        left: shape.left,
                        right: shape.right,
                        animation: `float ${shape.duration} ease-in-out infinite`,
                        animationDelay: shape.delay,
                    }}
                />
            ))}
        </div>
    );
};

// Animated particles for premium effect - BIGGER DOTS
const AnimatedParticles = () => {
    const particles = Array.from({ length: 15 }, (_, i) => ({
        left: `${5 + (i * 6.5)}%`,
        top: `${10 + ((i * 17) % 80)}%`,
        delay: `${i * 0.3}s`,
        size: 2 + (i % 3),
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="absolute bg-secondary/60 rounded-full"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size * 2}px`,
                        height: `${p.size * 2}px`,
                        animation: `float 4s ease-in-out infinite`,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    );
};

// Animated gradient overlay - MORE VISIBLE
const AnimatedGradient = () => {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: 'linear-gradient(45deg, transparent, hsl(205 85% 55% / 0.15), transparent, hsl(200 90% 50% / 0.15), transparent)',
                backgroundSize: '400% 400%',
                animation: 'gradient-shift 8s ease infinite',
            }}
        />
    );
};

// Pulsing glow effect for CTA buttons
const PulsingGlow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 rounded-full bg-secondary/50 blur-xl animate-pulse-glow" />
            {children}
        </div>
    );
};

export { FloatingShapes, AnimatedParticles, AnimatedGradient, PulsingGlow };
