import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Droplets, Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const { token } = useAuth();
  const [timeFilter, setTimeFilter] = useState('Week');
  const [loading, setLoading] = useState(true);
  
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [kpis, setKpis] = useState({
    averageDaily: 0,
    goalCompletion: 0,
    bestStreak: 0
  });

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/water/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWeeklyData(res.data.weeklyData);
      setMonthlyData(res.data.monthlyData);
      setKpis(res.data.kpis);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const filters = ['Week', 'Month'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel !p-3 !rounded-xl !shadow-lg border-border/50">
          <p className="font-bold text-text-primary mb-1">{label}</p>
          <p className="text-primary font-medium">
            {payload[0].value} ml
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Analytics</h1>
          <p className="text-text-secondary text-lg">Track your hydration journey over time.</p>
        </div>
        
        <div className="flex bg-surface p-1 rounded-xl border border-border shadow-sm w-max">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                timeFilter === f 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass-panel p-6 flex items-center space-x-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/10 transition-colors">
            <Droplets size={100} />
          </div>
          <div className="bg-gradient-to-br from-primary-dark to-primary p-4 rounded-2xl text-white shadow-lg shadow-primary/20 z-10">
            <Droplets size={28} />
          </div>
          <div className="z-10">
            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Average Daily</p>
            <p className="text-3xl font-bold">{kpis.averageDaily.toLocaleString()} <span className="text-lg text-text-secondary font-normal">ml</span></p>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex items-center space-x-4 relative overflow-hidden group hover:border-success/30 transition-colors">
          <div className="absolute -right-4 -top-4 text-success/5 group-hover:text-success/10 transition-colors">
            <TrendingUp size={100} />
          </div>
          <div className="bg-gradient-to-br from-success to-emerald-400 p-4 rounded-2xl text-white shadow-lg shadow-success/20 z-10">
            <TrendingUp size={28} />
          </div>
          <div className="z-10">
            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Goal Completion</p>
            <p className="text-3xl font-bold">{kpis.goalCompletion}<span className="text-lg text-text-secondary font-normal">%</span></p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center space-x-4 relative overflow-hidden group hover:border-orange-400/30 transition-colors">
          <div className="absolute -right-4 -top-4 text-orange-400/5 group-hover:text-orange-400/10 transition-colors">
            <Calendar size={100} />
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-400 p-4 rounded-2xl text-white shadow-lg shadow-orange-500/20 z-10">
            <Calendar size={28} />
          </div>
          <div className="z-10">
            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Best Streak</p>
            <p className="text-3xl font-bold">{kpis.bestStreak} <span className="text-lg text-text-secondary font-normal">Days</span></p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <BarChart3 className="text-primary" size={20} />
              <span>Intake Trends</span>
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              {timeFilter === 'Week' ? 'Your daily intake for the last 7 days.' : 'Overview of your hydration trends over the year.'}
            </p>
          </div>
          <Link to="/settings" className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg border border-border bg-surface-hover">
            <span>Export Data</span>
          </Link>
        </div>
        
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {timeFilter === 'Month' ? (
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-primary-dark)' }} />
              </AreaChart>
            ) : (
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-border)', opacity: 0.4 }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount >= entry.goal ? 'var(--color-primary)' : 'var(--color-primary-light)'} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
