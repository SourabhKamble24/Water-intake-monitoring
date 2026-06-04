import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Droplets, BarChart2, Settings as SettingsIcon, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHydrationReminder } from '../hooks/useHydrationReminder';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
const Layout = () => {
  const location = useLocation();
  const {
    logout,
    user
  } = useAuth();
  const [isDark, setIsDark] = useState(false);

  // Start background hydration reminders
  useHydrationReminder();

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || !savedTheme && prefersDark) {
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
  const navItems = [{
    path: '/dashboard',
    icon: /*#__PURE__*/React.createElement(Droplets, {
      size: 24
    }),
    label: 'Dashboard'
  }, {
    path: '/analytics',
    icon: /*#__PURE__*/React.createElement(BarChart2, {
      size: 24
    }),
    label: 'Analytics'
  }, {
    path: '/settings',
    icon: /*#__PURE__*/React.createElement(SettingsIcon, {
      size: 24
    }),
    label: 'Settings'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex h-screen bg-background text-text-primary overflow-hidden transition-colors duration-300"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "hidden md:flex w-72 flex-col justify-between glass-panel m-4 z-20"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-6 flex items-center space-x-3 border-b border-border/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-primary-dark to-primary p-2.5 rounded-xl shadow-lg shadow-primary/20"
  }, /*#__PURE__*/React.createElement(Droplets, {
    className: "text-white",
    size: 26,
    strokeWidth: 2.5
  })), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary-light"
  }, "HydroTrack")), /*#__PURE__*/React.createElement("nav", {
    className: "p-4 space-y-2 mt-4"
  }, navItems.map(item => {
    const isActive = location.pathname === item.path;
    return /*#__PURE__*/React.createElement(Link, {
      key: item.path,
      to: item.path,
      className: cn("flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group", isActive ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" : "hover:bg-surface-hover text-text-secondary hover:text-text-primary")
    }, /*#__PURE__*/React.createElement("div", {
      className: cn("transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")
    }, item.icon), /*#__PURE__*/React.createElement("span", {
      className: cn("font-medium", isActive ? "font-semibold" : "")
    }, item.label));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-border/50 space-y-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggleTheme,
    className: "w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors text-text-secondary hover:text-text-primary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Theme"), isDark ? /*#__PURE__*/React.createElement(Moon, {
    size: 20,
    className: "text-primary-light"
  }) : /*#__PURE__*/React.createElement(Sun, {
    size: 20,
    className: "text-orange-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel p-3 flex items-center justify-between border-border/50 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-bold text-white shadow-md overflow-hidden border border-primary/20"
  }, user?.avatarUrl ? /*#__PURE__*/React.createElement("img", {
    src: user.avatarUrl,
    alt: "Avatar",
    className: "w-full h-full object-cover"
  }) : user?.name?.charAt(0).toUpperCase() || 'U'), /*#__PURE__*/React.createElement("div", {
    className: "truncate"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-sm truncate"
  }, user?.name || 'User'), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-text-secondary truncate"
  }, user?.email))), /*#__PURE__*/React.createElement("button", {
    onClick: logout,
    className: "p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors",
    title: "Logout"
  }, /*#__PURE__*/React.createElement(LogOut, {
    size: 18
  }))))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 overflow-y-auto relative z-10 w-full pb-20 md:pb-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:hidden flex items-center justify-between p-4 glass-panel m-4 sticky top-4 z-30"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-primary-dark to-primary p-1.5 rounded-lg shadow-md"
  }, /*#__PURE__*/React.createElement(Droplets, {
    className: "text-white",
    size: 20
  })), /*#__PURE__*/React.createElement("h1", {
    className: "text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary-light"
  }, "HydroTrack")), /*#__PURE__*/React.createElement("button", {
    onClick: toggleTheme,
    className: "p-2 bg-surface-hover rounded-full"
  }, isDark ? /*#__PURE__*/React.createElement(Moon, {
    size: 18,
    className: "text-primary-light"
  }) : /*#__PURE__*/React.createElement(Sun, {
    size: 18,
    className: "text-orange-400"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 md:p-8 md:pt-8 min-h-full"
  }, /*#__PURE__*/React.createElement(AnimatePresence, {
    mode: "wait"
  }, /*#__PURE__*/React.createElement(motion.div, {
    key: location.pathname,
    initial: {
      opacity: 0,
      y: 10,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98
    },
    transition: {
      duration: 0.3,
      ease: "easeOut"
    },
    className: "h-full"
  }, /*#__PURE__*/React.createElement(Outlet, null))))), /*#__PURE__*/React.createElement("nav", {
    className: "md:hidden fixed bottom-0 left-0 right-0 glass-panel rounded-none rounded-t-2xl border-t border-border/50 border-x-0 border-b-0 pb-safe z-40"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-around items-center p-2"
  }, navItems.map(item => {
    const isActive = location.pathname === item.path;
    return /*#__PURE__*/React.createElement(Link, {
      key: item.path,
      to: item.path,
      className: cn("flex flex-col items-center p-3 rounded-xl transition-all duration-300 min-w-[4rem]", isActive ? "text-primary" : "text-text-secondary hover:text-text-primary")
    }, /*#__PURE__*/React.createElement("div", {
      className: cn("transition-transform duration-300", isActive ? "scale-110 mb-1" : "")
    }, item.icon), isActive && /*#__PURE__*/React.createElement(motion.span, {
      layoutId: "bottom-nav-indicator",
      className: "text-[10px] font-semibold"
    }, item.label));
  }))));
};
export default Layout;