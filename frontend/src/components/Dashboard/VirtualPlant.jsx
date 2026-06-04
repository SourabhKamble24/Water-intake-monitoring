import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const VirtualPlant = ({
  percentage
}) => {
  // Determine plant state based on percentage
  let state = 'seed';
  if (percentage >= 80) state = 'bloom';else if (percentage >= 50) state = 'tree';else if (percentage >= 20) state = 'sprout';
  const states = {
    seed: {
      emoji: '🌱',
      message: "I'm thirsty! Water me.",
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20',
      animation: {
        y: [0, 2, 0],
        transition: {
          repeat: Infinity,
          duration: 3
        }
      }
    },
    sprout: {
      emoji: '🌿',
      message: "Starting to grow!",
      color: 'text-green-400',
      bg: 'bg-green-400/10 border-green-400/20',
      animation: {
        rotate: [-2, 2, -2],
        transition: {
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }
      }
    },
    tree: {
      emoji: '🌳',
      message: "Looking healthy!",
      color: 'text-green-500',
      bg: 'bg-green-500/10 border-green-500/20',
      animation: {
        scale: [1, 1.05, 1],
        transition: {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }
      }
    },
    bloom: {
      emoji: '🌺',
      message: "Blooming! Great job!",
      color: 'text-pink-500',
      bg: 'bg-pink-500/10 border-pink-500/20',
      animation: {
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1],
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }
    }
  };
  const currentState = states[state];
  return <motion.div initial={{
    opacity: 0,
    scale: 0.9
  }} animate={{
    opacity: 1,
    scale: 1
  }} className={`glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-500 border ${currentState.bg}`}>
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        ✨
      </div>
      
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-text-primary">
        <span>Your Hydration Plant</span>
      </h3>

      <div className="h-32 w-32 flex items-center justify-center bg-surface/50 rounded-full mb-4 shadow-inner relative">
        <AnimatePresence mode="wait">
          <motion.div key={state} initial={{
          opacity: 0,
          y: 20,
          scale: 0.5
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          ...currentState.animation
        }} exit={{
          opacity: 0,
          scale: 0.5,
          filter: 'blur(10px)'
        }} transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }} className="text-6xl drop-shadow-lg">
            {currentState.emoji}
          </motion.div>
        </AnimatePresence>
        
        {/* Pot */}
        <div className="absolute bottom-2 w-16 h-4 bg-[#8B4513] rounded-b-lg border-t-4 border-[#65320d] shadow-md z-10" />
      </div>

      <motion.p key={`msg-${state}`} initial={{
      opacity: 0,
      y: 5
    }} animate={{
      opacity: 1,
      y: 0
    }} className={`font-semibold ${currentState.color}`}>
        {currentState.message}
      </motion.p>
      <p className="text-sm text-text-secondary mt-1">Keep drinking to watch it grow!</p>
    </motion.div>;
};
export default VirtualPlant;