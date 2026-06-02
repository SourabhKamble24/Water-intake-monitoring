import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentIntake: number;
  dailyGoal: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentIntake, dailyGoal }) => {
  const percentage = Math.min((currentIntake / dailyGoal) * 100, 100) || 0;
  
  // Animation state to ensure smooth load
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    // Delay slightly for nice entrance animation
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative my-4">
      {/* Glow effect behind the ring */}
      <div className="absolute inset-0 bg-primary-500/10 blur-[50px] rounded-full scale-75 pointer-events-none" />
      
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        {/* SVG Container */}
        <svg className="w-full h-full transform -rotate-90 absolute inset-0 drop-shadow-xl" viewBox="0 0 280 280">
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary-light)" />
              <stop offset="100%" stopColor="var(--color-primary-dark)" />
            </linearGradient>
            {/* Soft inner shadow for background ring */}
            <filter id="inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.1" />
            </filter>
          </defs>
          
          {/* Background Circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            strokeWidth="24"
            fill="transparent"
            className="stroke-surface-hover dark:stroke-surface shadow-inner"
            filter="url(#inner-shadow)"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="140"
            cy="140"
            r={radius}
            stroke="url(#progress-gradient)"
            strokeWidth="24"
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Content inside the circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary-light tracking-tight">
              {Math.round(animatedPercentage)}%
            </span>
            <span className="text-text-secondary mt-1 font-medium text-sm tracking-wide uppercase">
              Daily Goal
            </span>
            
            <div className="mt-5 px-5 py-2 rounded-2xl bg-surface/80 border border-border/50 shadow-sm backdrop-blur-md flex items-center space-x-1">
              <span className="text-text-primary font-bold">{currentIntake}</span>
              <span className="text-text-secondary text-sm">/ {dailyGoal} ml</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
