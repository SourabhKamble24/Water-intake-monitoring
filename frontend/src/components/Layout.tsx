import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Droplets, BarChart2, Settings as SettingsIcon, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHydrationReminder } from '../hooks/useHydrationReminder';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Layout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  // Start background hydration reminders
  useHydrationReminder();

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <Droplets size={24} />, label: 'Dashboard' },
    { path: '/analytics', icon: <BarChart2 size={24} />, label: 'Analytics' },
    { path: '/settings', icon: <SettingsIcon size={24} />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col justify-between glass-panel m-4 z-20">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-border/50">
            <div className="bg-gradient-to-br from-primary-dark to-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Droplets className="text-white" size={26} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary-light">
              HydroTrack
            </h1>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                      : "hover:bg-surface-hover text-text-secondary hover:text-text-primary"
                  )}
                >
                  <div className={cn(
                    "transition-transform duration-300", 
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )}>
                    {item.icon}
                  </div>
                  <span className={cn("font-medium", isActive ? "font-semibold" : "")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border/50 space-y-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors text-text-secondary hover:text-text-primary"
          >
            <span className="font-medium">Theme</span>
            {isDark ? <Moon size={20} className="text-primary-light" /> : <Sun size={20} className="text-orange-400" />}
          </button>
          
          <div className="glass-panel p-3 flex items-center justify-between border-border/50 shadow-sm">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-bold text-white shadow-md overflow-hidden border border-primary/20">
                {(user as any)?.avatarUrl ? (
                  <img src={(user as any).avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="truncate">
                <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-text-secondary truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 w-full pb-20 md:pb-0">
        {/* Mobile Header (visible only on small screens) */}
        <div className="md:hidden flex items-center justify-between p-4 glass-panel m-4 sticky top-4 z-30">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-dark to-primary p-1.5 rounded-lg shadow-md">
              <Droplets className="text-white" size={20} />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary-light">
              HydroTrack
            </h1>
          </div>
          <button onClick={toggleTheme} className="p-2 bg-surface-hover rounded-full">
            {isDark ? <Moon size={18} className="text-primary-light" /> : <Sun size={18} className="text-orange-400" />}
          </button>
        </div>

        <div className="p-4 md:p-8 md:pt-8 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel rounded-none rounded-t-2xl border-t border-border/50 border-x-0 border-b-0 pb-safe z-40">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl transition-all duration-300 min-w-[4rem]",
                  isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                <div className={cn("transition-transform duration-300", isActive ? "scale-110 mb-1" : "")}>
                  {item.icon}
                </div>
                {isActive && (
                  <motion.span 
                    layoutId="bottom-nav-indicator"
                    className="text-[10px] font-semibold"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
