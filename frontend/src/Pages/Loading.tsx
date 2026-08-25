import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react';

const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-emerald-500/20 animate-float" style={{ animationDelay: '0s' }}>
          <Wallet size={40} />
        </div>
        <div className="absolute top-32 right-32 text-blue-500/20 animate-float" style={{ animationDelay: '0.5s' }}>
          <TrendingUp size={36} />
        </div>
        <div className="absolute bottom-32 left-32 text-purple-500/20 animate-float" style={{ animationDelay: '1s' }}>
          <PiggyBank size={44} />
        </div>
        <div className="absolute bottom-20 right-20 text-amber-500/20 animate-float" style={{ animationDelay: '1.5s' }}>
          <ArrowUpRight size={38} />
        </div>
        <div className="absolute top-1/2 left-16 text-rose-500/20 animate-float" style={{ animationDelay: '2s' }}>
          <ArrowDownRight size={34} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse" />
          <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Wallet size={48} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* App name */}
        <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
          Expense
        </h1>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 bg-clip-text text-transparent tracking-tight">
          Tracker
        </h1>

        {/* Tagline */}
        <p className="text-slate-400 text-lg mb-12 tracking-wide">
          Smart money management{dots}
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading text */}
        <p className="mt-6 text-slate-500 text-sm tracking-widest uppercase">
          {progress < 30 ? 'Initializing' : progress < 60 ? 'Loading' : progress < 90 ? 'Almost Ready' : 'Welcome'}
        </p>
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDEwaDQwTTEwIDB2NDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] pointer-events-none" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(5px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
