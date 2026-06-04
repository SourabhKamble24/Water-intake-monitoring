import React, { useState } from 'react';
import { Droplet, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuickAddButton = ({ amount, onAdd, isLoading, itemVariants }) => {
  const [isAdding, setIsAdding] = useState(false);
  const Icon = Droplets; // Using one consistent, best icon for all

  const handleClick = () => {
    setIsAdding(true);
    onAdd(amount.value);
    setTimeout(() => setIsAdding(false), 800); // Reset after animation
  };

  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
      onClick={handleClick}
      className="relative glass-panel p-5 flex flex-col items-center justify-center group overflow-hidden disabled:opacity-50"
    >
      {/* Liquid Fill Animation on Hover */}
      <motion.div 
        className="absolute inset-x-0 bottom-0 bg-blue-500/10 pointer-events-none"
        initial={{ height: "0%", borderRadius: "100% 100% 0 0" }}
        whileHover={{ 
          height: "150%", 
          borderRadius: "0% 0% 0 0",
          transition: { duration: 0.6, type: "tween", ease: "easeInOut" } 
        }}
      />
      
      {/* Click Splash Animation */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute bg-blue-400/40 rounded-full w-20 h-20 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Water Drop falling from top */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ y: -50, scale: 0.5, opacity: 1 }}
            animate={{ y: 20, scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            className="absolute top-0 text-blue-400 pointer-events-none z-10"
          >
            <Droplet size={24} fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 relative z-10">
        <Icon className="text-primary group-hover:text-primary-light transition-colors" size={24} />
      </div>
      
      <div className="flex items-baseline space-x-1 relative z-10">
        <span className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">{amount.value}</span>
        <span className="text-text-secondary text-sm font-medium">ml</span>
      </div>
      <span className="text-xs text-text-secondary mt-1 relative z-10">{amount.label}</span>
    </motion.button>
  );
};

const QuickAdd = ({ onAdd, isLoading }) => {
  const amounts = [
    { value: 100, label: 'Small glass' },
    { value: 250, label: 'Standard glass' },
    { value: 500, label: 'Large bottle' },
    { value: 750, label: 'Sports bottle' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      {amounts.map(amount => (
        <QuickAddButton 
          key={amount.value} 
          amount={amount} 
          onAdd={onAdd} 
          isLoading={isLoading} 
          itemVariants={item} 
        />
      ))}
    </motion.div>
  );
};

export default QuickAdd;