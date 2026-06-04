import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

const AnimatedBubbles = () => {
  // Generate random bubbles
  const bubbles = Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 40 + 10;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const startX = Math.random() * 100;
    
    return (
      <motion.div
        key={i}
        className="absolute rounded-full bg-[#00d2ff]/10 backdrop-blur-[2px] pointer-events-none"
        style={{
          width: size,
          height: size,
          left: `${startX}%`,
          bottom: -100,
        }}
        animate={{
          y: [0, -800],
          x: [0, Math.random() * 40 - 20],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          delay: delay,
          ease: "easeInOut",
        }}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{bubbles}</div>;
};

const AuthLayout = ({ children, title, subtitle, isRegister = false }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans relative overflow-hidden">
      {/* Optional ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900"></div>

      {/* Main Container - The large rounded blue card */}
      <div className="relative w-full max-w-[1200px] h-[800px] max-h-[90vh] bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Full Background Image for the Card */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/auth-hero.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Gradients to match the deep blue feel of the screenshot */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#031b4e] via-[#052c77]/80 to-[#0a4bb8]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#021338] via-transparent to-transparent"></div>
        </div>

        <AnimatedBubbles />
        
        {/* Left Side Content Area */}
        <div className="relative z-10 flex flex-col justify-between p-12 lg:w-3/5 h-full">
          {/* Top Logo */}
          <div className="flex items-center space-x-2 text-white">
            <Droplets size={28} className="text-white" fill="white" />
            <span className="text-2xl font-bold tracking-tight">Hydrate</span>
          </div>

          {/* Middle Content */}
          <div className="text-white max-w-md mt-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold mb-4 tracking-tight leading-[1.1]"
            >
              {isRegister ? (
                <>Start Your<br/><span className="text-[#00d2ff]">Hydration</span> Journey.</>
              ) : (
                <>Track Every Sip.<br/>Stay <span className="text-[#00d2ff]">Hydrated.</span></>
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-slate-300 font-medium leading-relaxed max-w-[320px]"
            >
              {isRegister 
                ? "Join thousands of users who have transformed their daily hydration habits with intelligent tracking."
                : "Sign in to access your personalized hydration dashboard, track your progress, and build healthier habits today."}
            </motion.p>
          </div>

          {/* Bottom Features */}
          <div className="grid grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="w-12 h-12 rounded-full border border-[#00d2ff]/40 flex items-center justify-center mb-4 bg-transparent shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                <Droplets size={20} className="text-[#00d2ff]" />
              </div>
              <h3 className="text-white font-semibold text-[13px] mb-1.5 tracking-wide">Smart Tracking</h3>
              <p className="text-[#8c9fba] text-[11px] leading-relaxed pr-2 font-medium">Log and monitor your daily intake</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="w-12 h-12 rounded-full border border-[#00d2ff]/40 flex items-center justify-center mb-4 bg-transparent shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                <svg className="w-5 h-5 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
              </div>
              <h3 className="text-white font-semibold text-[13px] mb-1.5 tracking-wide">Progress Insights</h3>
              <p className="text-[#8c9fba] text-[11px] leading-relaxed pr-2 font-medium">Visualize your habits and stay on track</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="w-12 h-12 rounded-full border border-[#00d2ff]/40 flex items-center justify-center mb-4 bg-transparent shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                <svg className="w-5 h-5 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
              <h3 className="text-white font-semibold text-[13px] mb-1.5 tracking-wide">Smart Reminders</h3>
              <p className="text-[#8c9fba] text-[11px] leading-relaxed pr-2 font-medium">Get notified and never miss a sip</p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Floating Form Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full lg:w-[450px] lg:absolute lg:right-10 lg:top-10 lg:bottom-10 bg-white rounded-3xl shadow-2xl flex flex-col p-8 lg:p-10 overflow-y-auto"
        >
          {/* Welcome Text */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">{title}</h2>
            <p className="text-slate-500 text-sm">{subtitle}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex-grow flex flex-col"
          >
            {children}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default AuthLayout;
