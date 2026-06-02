import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProgressIndicator from '../components/Dashboard/ProgressIndicator';
import QuickAdd from '../components/Dashboard/QuickAdd';
import { CloudRain, ThermometerSun, Zap, Clock, TrendingUp, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [currentIntake, setCurrentIntake] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  // Mock weather data for MVP
  const weather = { temp: 36, humidity: 45, condition: 'Sunny' };
  
  // Calculate adjusted goal based on weather
  const adjustedGoal = user?.dailyGoal ? user.dailyGoal + (weather.temp > 35 ? 500 : 0) : 2500;

  const fetchTodayLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/water/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentIntake(res.data.currentIntake);
    } catch (error) {
      console.error('Error fetching today logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTodayLogs();
  }, [token]);

  const handleAddWater = async (amount: number) => {
    if (amount <= 0) return;
    setAddLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/water', { amountMl: amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentIntake(res.data.currentIntake);
    } catch (error) {
      console.error('Error adding water', error);
    } finally {
      setAddLoading(false);
    }
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customAmount);
    if (!isNaN(amount)) {
      handleAddWater(amount);
      setCustomAmount('');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate insights
  const percentage = Math.min((currentIntake / adjustedGoal) * 100, 100) || 0;
  const isAhead = percentage > 50 && new Date().getHours() < 14;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Good Morning, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
          <p className="text-text-secondary text-lg">Let's reach your hydration goal today.</p>
        </div>
        <div className="glass-panel px-4 py-2 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <span className="text-xl">🔥</span>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Current Streak</p>
            <p className="font-bold text-lg leading-none">4 Days</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Progress Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 flex flex-col relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h2 className="text-xl font-bold">Daily Progress</h2>
                <p className="text-text-secondary text-sm mt-1">Based on your personal settings</p>
              </div>
            </div>
            
            <ProgressIndicator currentIntake={currentIntake} dailyGoal={adjustedGoal} />
          </motion.div>

          {/* Quick Add Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Log Intake</h2>
                <p className="text-text-secondary text-sm mt-1">Quickly add to your daily total</p>
              </div>
              
              <form onSubmit={handleCustomAdd} className="flex space-x-2 w-full sm:w-auto">
                <input 
                  type="number" 
                  min="1"
                  placeholder="Custom (ml)" 
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="input-field w-full sm:w-32 h-11 bg-surface-hover border-transparent"
                />
                <button type="submit" disabled={addLoading || !customAmount} className="btn-primary h-11 px-6 whitespace-nowrap">
                  Add
                </button>
              </form>
            </div>
            <QuickAdd onAdd={handleAddWater} isLoading={addLoading} />
          </motion.div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* AI Insights Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 bg-gradient-to-br from-surface to-surface-hover relative overflow-hidden border-primary/20"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={64} />
            </div>
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Zap className="text-primary" size={20} />
              <span>Smart Insights</span>
            </h2>
            
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-start space-x-3">
                  <TrendingUp className={isAhead ? "text-success mt-1" : "text-orange-400 mt-1"} size={18} />
                  <p className="text-sm leading-relaxed text-text-primary">
                    {isAhead 
                      ? "You're 15% ahead of your hydration target for this time of day. Great job!" 
                      : "You're slightly behind schedule. Try having a glass of water now."}
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <div className="flex items-start space-x-3">
                  <ThermometerSun className="text-primary mt-1" size={18} />
                  <p className="text-sm leading-relaxed text-text-primary">
                    <span className="font-semibold block mb-1">Weather Adjustment Active</span>
                    Due to the {weather.temp}°C heat, we recommend an additional 500ml today.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <Clock className="text-secondary" size={20} />
                <span>Today's Log</span>
              </h2>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              
              {/* Mock Timeline Items */}
              {[
                { time: '10:30 AM', amount: 250, type: 'Manual' },
                { time: '08:15 AM', amount: 500, type: 'Morning Routine' }
              ].map((log, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Droplets size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-primary">{log.amount}ml</span>
                      <time className="text-xs text-text-secondary font-medium">{log.time}</time>
                    </div>
                    <div className="text-sm text-text-secondary">{log.type}</div>
                  </div>
                </div>
              ))}
              
              {currentIntake === 0 && (
                <div className="text-center text-text-secondary text-sm py-4 italic z-10 relative bg-surface px-4">
                  No water logged yet today.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
