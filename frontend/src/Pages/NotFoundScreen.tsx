import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, Compass, Frown, Sparkles } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  color: string;
}

const COLORS = [
  'rgba(59, 130, 246, 0.4)',
  'rgba(139, 92, 246, 0.4)',
  'rgba(236, 72, 153, 0.4)',
  'rgba(52, 211, 153, 0.4)',
  'rgba(251, 191, 36, 0.4)',
];

const NotFoundScreen: React.FC = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHoveringBtn, setIsHoveringBtn] = useState<string | null>(null);
  const [sparkleBursts, setSparkleBursts] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setParticles(generated);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: (p.x + p.speedX + 100) % 100,
          y: (p.y + p.speedY + 100) % 100,
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, [particles.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMousePos({
      x: (clientX - centerX) / centerX,
      y: (clientY - centerY) / centerY,
    });
  }, []);

  const handleScreenClick = useCallback((e: React.MouseEvent) => {
    const newSparkle = { x: e.clientX, y: e.clientY, id: Date.now() };
    setSparkleBursts(prev => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkleBursts(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 1000);
  }, []);

  const goHome = useCallback(() => navigate('/'), [navigate]);
  const goBack = useCallback(() => navigate(-1), [navigate]);

  const parallaxStyle = useMemo(
    () => ({ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }),
    [mousePos]
  );

  const antiParallaxStyle = useMemo(
    () => ({ transform: `translate(${-mousePos.x * 30}px, ${-mousePos.y * 30}px)` }),
    [mousePos]
  );

  const depthParallax = useMemo(
    () => ({ transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)` }),
    [mousePos]
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={handleScreenClick}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0s', ...parallaxStyle }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s', ...antiParallaxStyle }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s', ...depthParallax }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '3s', ...antiParallaxStyle }}
        />
      </div>

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            backgroundColor: p.color,
            transition: 'all 0.05s linear',
          }}
        />
      ))}

      {/* Sparkle bursts on click */}
      {sparkleBursts.map(s => (
        <div key={s.id} className="absolute pointer-events-none" style={{ left: s.x, top: s.y }}>
          {[...Array(12)].map((_, i) => {
            const hue = 40 + i * 20;
            const dist = 40 + Math.random() * 20;
            return (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  animation: `sparkleBurst 0.8s ease-out forwards`,
                  ['--r' as string]: `${i * 30}deg`,
                  ['--dist' as string]: `${dist}px`,
                  background: `hsl(${hue}, 100%, 60%)`,
                  boxShadow: `0 0 4px hsl(${hue}, 100%, 60%)`,
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h40M10 0v40' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4" onClick={e => e.stopPropagation()}>
        {/* 404 Illustration */}
        <div className="relative mb-6 sm:mb-8" style={parallaxStyle}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl scale-150 animate-pulse" />

          <div className="relative flex flex-col items-center">
            <div className="animate-bounce-slow" style={depthParallax}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse" />
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 flex items-center justify-center shadow-2xl">
                  <Compass
                    size={56}
                    className="sm:w-[68px] sm:h-[68px] text-blue-400"
                    style={{
                      filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.3))',
                      transform: `rotate(${mousePos.x * 15}deg)`,
                      transition: 'transform 0.1s ease-out',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 animate-float" style={antiParallaxStyle}>
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md" />
                <div className="relative w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-500/50 flex items-center justify-center shadow-lg">
                  <Frown size={28} className="sm:w-[34px] sm:h-[34px] text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <div className="text-center mb-8 sm:mb-10" style={antiParallaxStyle}>
          <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-black mb-2 tracking-tighter">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">4</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">0</span>
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">4</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl md:text-2xl font-medium tracking-wide mt-2">
            You've wandered off the map!
          </p>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            <br className="hidden sm:block" />
            Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto" style={parallaxStyle}>
          <button
            onClick={goHome}
            onMouseEnter={() => setIsHoveringBtn('home')}
            onMouseLeave={() => setIsHoveringBtn(null)}
            className="group relative flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 overflow-hidden"
          >
            <span className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Home size={18} className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            <span className="relative z-10">Go Home</span>
            {isHoveringBtn === 'home' && (
              <span className="absolute -top-1 -right-1">
                <Sparkles size={14} className="text-yellow-300 animate-ping" />
              </span>
            )}
          </button>

          <button
            onClick={goBack}
            onMouseEnter={() => setIsHoveringBtn('back')}
            onMouseLeave={() => setIsHoveringBtn(null)}
            className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-semibold rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl active:scale-95 backdrop-blur-sm"
          >
            <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            onMouseEnter={() => setIsHoveringBtn('explore')}
            onMouseLeave={() => setIsHoveringBtn(null)}
            className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-300 font-semibold rounded-2xl border border-dashed border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 active:scale-95"
          >
            <Search size={18} className="transition-transform duration-300 group-hover:scale-110" />
            <span>Sign In</span>
          </button>
        </div>

        {/* Hint text */}
        <p className="mt-8 sm:mt-10 text-slate-600 text-xs tracking-widest uppercase flex items-center gap-2" style={antiParallaxStyle}>
          <span className="w-8 h-px bg-slate-700" />
          Click anywhere for a surprise
          <span className="w-8 h-px bg-slate-700" />
        </p>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(3deg); }
          66% { transform: translateY(6px) rotate(-3deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes sparkleBurst {
          0% {
            opacity: 1;
            transform: rotate(var(--r, 0deg)) translateX(0);
          }
          100% {
            opacity: 0;
            transform: rotate(var(--r, 0deg)) translateX(var(--dist, 40px));
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundScreen;
