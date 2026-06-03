import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ProgressIndicatorProps {
  currentIntake: number;
  dailyGoal: number;
}

const Bubbles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {[...Array(12)].map((_, i) => {
        const size = Math.random() * 12 + 4;
        return (
          <motion.div
            key={i}
            className="absolute bg-white/40 rounded-full"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 80 + 10}%`,
              bottom: '-20px'
            }}
            animate={{
              y: [-20, -350],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 2.5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeIn"
            }}
          />
        );
      })}
    </div>
  );
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentIntake, dailyGoal }) => {
  const realPercentage = Math.min((currentIntake / dailyGoal) * 100, 100) || 0;
  
  // Animation state to ensure smooth load
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    // Delay slightly for nice entrance animation
    const timer = setTimeout(() => {
      setAnimatedPercentage(realPercentage);
      
      if (realPercentage >= 100 && !hasCelebrated) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#06b6d4', '#22d3ee', '#8b5cf6', '#ffffff'],
          zIndex: 9999
        });
        setHasCelebrated(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [realPercentage, hasCelebrated]);

  // Cap the visual height at 90% so the wave is always visible at the top!
  const visualHeight = animatedPercentage * 0.9;

  return (
    <div className="flex flex-col items-center justify-center relative my-4">
      {/* Outer Neon Glow */}
      <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full scale-90 pointer-events-none" />
      
      {/* Outer Glass Ring */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center rounded-full border border-primary/20 bg-surface/50 backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        
        {/* Inner Container */}
        <div className="relative w-[290px] h-[290px] rounded-full overflow-hidden border-4 border-surface shadow-inner bg-surface-hover/80">
          
          {/* The Fluid Wave Container */}
          <motion.div 
             className="absolute bottom-0 left-0 right-0 w-[200%] bg-gradient-to-t from-primary-dark via-primary to-primary-light z-0 shadow-[0_0_30px_rgba(6,182,212,0.6)]"
             initial={{ height: '0%' }}
             animate={{ height: `${visualHeight}%` }}
             transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Animated Wave Top SVG */}
            <motion.svg 
              className="absolute bottom-[98%] left-0 w-full h-[40px] text-primary-light drop-shadow-md"
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <path 
                d="M0,60 C150,10 300,100 450,60 C600,20 750,110 900,60 C1050,10 1200,100 1200,100 L1200,120 L0,120 Z 
                   M1200,60 C1350,10 1500,100 1650,60 C1800,20 1950,110 2100,60 C2250,10 2400,100 2400,100 L2400,120 L1200,120 Z" 
                fill="currentColor" 
              />
            </motion.svg>

            {/* Secondary slightly offset wave for depth */}
            <motion.svg 
              className="absolute bottom-[98%] left-0 w-full h-[30px] text-primary-dark opacity-70"
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <path 
                d="M0,60 C150,110 300,20 450,60 C600,100 750,10 900,60 C1050,110 1200,20 1200,20 L1200,120 L0,120 Z 
                   M1200,60 C1350,110 1500,20 1650,60 C1800,100 1950,10 2100,60 C2250,110 2400,20 2400,20 L2400,120 L1200,120 Z" 
                fill="currentColor" 
              />
            </motion.svg>

            <Bubbles />
          </motion.div>

          {/* Content inside the circle (Text Overlay) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center p-6 rounded-full"
            >
              <span className={`text-6xl font-bold tracking-tight transition-colors duration-500 ${animatedPercentage > 55 ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]' : 'text-primary drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}>
                {Math.round(animatedPercentage)}%
              </span>
              <span className={`mt-1 font-medium text-sm tracking-wide uppercase transition-colors duration-500 ${animatedPercentage > 55 ? 'text-white/90 drop-shadow-[0_1px_5px_rgba(0,0,0,0.3)]' : 'text-text-secondary'}`}>
                Daily Goal
              </span>
              
              <div className={`mt-5 px-5 py-2 rounded-2xl border backdrop-blur-md flex items-center space-x-1 transition-all duration-500 ${animatedPercentage > 40 ? 'bg-black/30 border-white/20 shadow-lg' : 'bg-surface/80 border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'}`}>
                <span className={`font-bold ${animatedPercentage > 40 ? 'text-white' : 'text-primary'}`}>{currentIntake}</span>
                <span className={`text-sm ${animatedPercentage > 40 ? 'text-white/80' : 'text-text-secondary'}`}>/ {dailyGoal} ml</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
