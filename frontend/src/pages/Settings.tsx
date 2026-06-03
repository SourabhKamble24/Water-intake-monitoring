import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Target, Moon, Droplet, Shield, Cloud, Loader2, Download, Sun, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Settings = () => {
  const { user, token, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isDark, setIsDark] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dailyGoal: user?.dailyGoal || 2500,
    weight: user?.weight || 70, // Assume 70 if not loaded, backend will return real
    wakeTime: user?.wakeTime || '07:00',
    notifications: user?.notifications || false,
    avatarUrl: (user as any)?.avatarUrl || ''
  });

  useEffect(() => {
    // Populate form if user object changes
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        dailyGoal: user.dailyGoal,
        weight: (user as any).weight || prev.weight,
        wakeTime: (user as any).wakeTime || prev.wakeTime,
        notifications: (user as any).notifications || prev.notifications,
        avatarUrl: (user as any).avatarUrl || prev.avatarUrl
      }));
    }
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.put('http://localhost:5000/api/auth/settings', 
        {
          name: formData.name,
          dailyGoal: Number(formData.dailyGoal),
          weight: Number(formData.weight),
          wakeTime: formData.wakeTime,
          notifications: formData.notifications,
          avatarUrl: (formData as any).avatarUrl
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update global user context
      updateUser(res.data.user);
      
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to save settings. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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

  const handleExportData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/water/export', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const logs = res.data;
      if (!logs || logs.length === 0) {
        alert("No data available to export.");
        return;
      }

      // Convert to CSV
      const headers = ['Timestamp', 'Amount (ml)'];
      const csvRows = logs.map((log: any) => `${new Date(log.timestamp).toISOString()},${log.amount_ml}`);
      const csvString = [headers.join(','), ...csvRows].join('\n');
      
      // Download
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', 'hydration_logs.csv');
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: <User size={18} /> },
    { id: 'goals', label: 'Hydration Goals', icon: <Target size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Bell size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Activity size={18} /> },
    { id: 'data', label: 'Data Export', icon: <Cloud size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Settings</h1>
        <p className="text-text-secondary text-lg">Manage your hydration preferences and account.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-64 shrink-0 space-y-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
            >
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSave}>
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel p-8"
                >
                  <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border/50">Profile Information</h2>
                  
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-2 border-primary/20">
                      {(formData as any).avatarUrl ? (
                        <img src={(formData as any).avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        formData.name.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        accept="image/jpeg, image/png, image/gif" 
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 800 * 1024) {
                              setMessage({ text: 'Image must be less than 800KB', type: 'error' });
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, avatarUrl: reader.result as string } as any);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="avatar-upload" className="btn-secondary py-2 px-4 text-sm mb-2 inline-block cursor-pointer">
                        Change Avatar
                      </label>
                      <p className="text-xs text-text-secondary mt-1">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        disabled
                        className="input-field w-full opacity-50 cursor-not-allowed bg-surface-hover"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'goals' && (
                <motion.div
                  key="goals"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel p-8"
                >
                  <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border/50">Hydration Goals</h2>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-text-primary">
                      <span className="font-semibold text-primary">Smart Adjustment is Active.</span> We automatically increase your daily goal by 500ml on days hotter than 35°C.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Base Daily Goal (ml)</label>
                      <input 
                        type="number" 
                        name="dailyGoal"
                        value={formData.dailyGoal}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                        min="500"
                        step="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Weight (kg)</label>
                      <input 
                        type="number" 
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="input-field w-full"
                        title="Used for personalized hydration calculations"
                        required
                        min="30"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel p-8"
                >
                  <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border/50">Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface hover:bg-surface-hover rounded-xl border border-border transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-xl text-primary">
                          <Droplet size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">Hydration Reminders</h3>
                          <p className="text-sm text-text-secondary">Receive notifications to drink water</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface hover:bg-surface-hover rounded-xl border border-border transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500">
                          <Moon size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">Wake Time</h3>
                          <p className="text-sm text-text-secondary">When should we start reminding you?</p>
                        </div>
                      </div>
                      <input 
                        type="time" 
                        name="wakeTime"
                        value={formData.wakeTime}
                        onChange={handleChange}
                        className="input-field bg-transparent border-none text-right font-medium text-primary focus:ring-0 w-32"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-surface hover:bg-surface-hover rounded-xl border border-border transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-500/10 p-3 rounded-xl text-purple-500">
                          {isDark ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">Dark Mode</h3>
                          <p className="text-sm text-text-secondary">Toggle theme appearance</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={toggleTheme}
                        className="btn-secondary py-2 px-4 text-sm"
                      >
                        {isDark ? 'Switch to Light' : 'Switch to Dark'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'integrations' && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel p-8"
                >
                  <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border/50">Connected Apps</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface hover:bg-surface-hover rounded-xl border border-border transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-500/10 p-3 rounded-xl text-green-500">
                          <Activity size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">Google Fit / Apple Health</h3>
                          <p className="text-sm text-text-secondary">Sync your daily workouts to automatically adjust hydration goals.</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="btn-secondary py-2 px-4 text-sm border-green-500/30 text-green-500 hover:bg-green-500/10"
                        onClick={() => alert("Please manage integrations directly from the Dashboard.")}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'data' && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel p-8"
                >
                  <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border/50">Data Export</h2>
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <Download size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-text-primary">Download Your Data</h3>
                    <p className="text-text-secondary text-center max-w-md mb-6">
                      Export a CSV file of all your historical hydration logs. You can use this file for your own analytics or record-keeping.
                    </p>
                    <button 
                      type="button" 
                      onClick={handleExportData}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Download size={18} />
                      <span>Download CSV</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {activeTab !== 'data' && activeTab !== 'integrations' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex justify-end"
              >
                <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 min-w-[120px] justify-center">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Save Changes</span>}
                </button>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
