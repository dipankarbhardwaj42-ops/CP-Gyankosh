import React from 'react';

interface NupplLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const NupplLogo: React.FC<NupplLogoProps> = ({
  className = '',
  showSubtitle = true,
  size = 'md'
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem Graphic */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 shadow-md ring-1 ring-amber-400/40 p-1.5`}>
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          {/* Outer Sun / Energy Gear Rays */}
          <circle cx="50" cy="50" r="44" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.8" />
          
          {/* Thermal Turbine Blade Rings */}
          <circle cx="50" cy="50" r="34" stroke="#60a5fa" strokeWidth="2" opacity="0.9" />
          <path d="M50 16 L50 28 M50 72 L50 84 M16 50 L28 50 M72 50 L84 50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 26 L35 35 M65 65 L74 74 M26 74 L35 65 M65 35 L74 26" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          
          {/* Inner Energy Flame / Shield */}
          <path
            d="M50 26 C43 36 38 46 38 56 C38 66 43 73 50 75 C57 73 62 66 62 56 C62 46 57 36 50 26 Z"
            fill="url(#flameGradient)"
          />
          {/* Core Electric Flash */}
          <polygon points="50,34 45,51 52,51 47,67 56,48 49,48" fill="#ffffff" />
          
          <defs>
            <linearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Small 51:49 JV Badge */}
        <span className="absolute -bottom-1 -right-1 text-[8px] font-black tracking-tight px-1 py-0.2 bg-amber-500 text-slate-950 rounded font-mono shadow">
          51:49
        </span>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
            NUPPL
          </span>
          <span className="h-4 w-px bg-slate-300"></span>
          <span className="font-bold text-amber-700 tracking-wide text-xs md:text-sm uppercase font-mono">
            CP-Gyan Kosh
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[11px] text-slate-500 font-medium tracking-tight">
            Neyveli Uttar Pradesh Power Limited <span className="text-slate-400 font-normal">• Joint Venture of NLCIL & UPRVUNL</span>
          </p>
        )}
      </div>
    </div>
  );
};
