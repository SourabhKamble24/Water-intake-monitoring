import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickAddProps {
  onAdd: (amount: number) => void;
  isLoading: boolean;
}

const QuickAdd: React.FC<QuickAddProps> = ({ onAdd, isLoading }) => {
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      {amounts.map((amount) => (
        <motion.button
          key={amount.value}
          variants={item}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          onClick={() => onAdd(amount.value)}
          className="relative glass-panel p-5 flex flex-col items-center justify-center group disabled:opacity-50 overflow-hidden"
        >
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
            <Plus className="text-primary group-hover:text-primary-light transition-colors" size={24} />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">{amount.value}</span>
            <span className="text-text-secondary text-sm font-medium">ml</span>
          </div>
          <span className="text-xs text-text-secondary mt-1">{amount.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default QuickAdd;
