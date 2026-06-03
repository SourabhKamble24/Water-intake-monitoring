import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProgressIndicator from '../components/Dashboard/ProgressIndicator';
import QuickAdd from '../components/Dashboard/QuickAdd';
import Gamification from '../components/Dashboard/Gamification';
import { CloudRain, ThermometerSun, Zap, Clock, TrendingUp, Droplets, MapPin, Cloud, Activity, Smartphone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, token, updateUser } = useAuth();
  const [currentIntake, setCurrentIntake] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Activity Integration state (Simulated for MVP)
  const [isActivityConnected, setIsActivityConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activityData, setActivityData] = useState<{ type: string, duration: number, intensity: 'Light' | 'Moderate' | 'Intense' } | null>(null);

  // Weather state
  const [weather, setWeather] = useState<{ temp: number, humidity: number, condition: string } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  
  // Calculate adjusted goal based on weather and activity
  let weatherGoalIncrease = 0;
  if (weather) {
    if (weather.temp >= 40) weatherGoalIncrease = 750;
    else if (weather.temp >= 35) weatherGoalIncrease = 500;
    else if (weather.temp >= 30) weatherGoalIncrease = 300;
    
    // High humidity factor
    if (weather.humidity >= 70 && weather.temp >= 25) weatherGoalIncrease += 200;
  }
  
  let activityGoalIncrease = 0;
  if (activityData) {
    if (activityData.intensity === 'Light') activityGoalIncrease = 250;
    else if (activityData.intensity === 'Moderate') activityGoalIncrease = 500;
    else if (activityData.intensity === 'Intense') activityGoalIncrease = 1000;
  }
  
  const adjustedGoal = user?.dailyGoal ? user.dailyGoal + weatherGoalIncrease + activityGoalIncrease : 2500;

  const fetchDashboardData = async () => {
    try {
      const [todayRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/water/today', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/water/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setCurrentIntake(todayRes.data.currentIntake);
      setTodayLogs(todayRes.data.logs);
      setCurrentStreak(analyticsRes.data.kpis.currentStreak || 0);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = () => {
    setWeatherLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`);
            const current = res.data.current;
            setWeather({
              temp: Math.round(current.temperature_2m),
              humidity: Math.round(current.relative_humidity_2m),
              condition: current.temperature_2m > 25 ? 'Sunny' : 'Clear'
            });
          } catch (error) {
            console.error('Error fetching weather data:', error);
          } finally {
            setWeatherLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setWeatherLoading(false);
        }
      );
    } else {
      setWeatherLoading(false);
    }
  };

  const handleConnectActivity = () => {
    setIsConnecting(true);
    // Simulate OAuth and API fetching for Google Fit / Apple Health
    setTimeout(() => {
      setIsActivityConnected(true);
      setActivityData({
        type: 'Running',
        duration: 45, // mins
        intensity: 'Intense'
      });
      setIsConnecting(false);
    }, 1500);
  };

  useEffect(() => {
    if (token) fetchDashboardData();
    fetchWeather();
  }, [token]);

  const handleAddWater = async (amount: number) => {
    if (amount <= 0) return;
    setAddLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/water', { amountMl: amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentIntake(res.data.currentIntake);
      
      // Update logs (add to beginning since they're sorted descending)
      if (res.data.newLog) {
        setTodayLogs(prev => [res.data.newLog, ...prev]);
      }
      
      // Update gamification data
      if (res.data.newPoints !== undefined || res.data.newLevel !== undefined) {
        updateUser({
          points: res.data.newPoints,
          level: res.data.newLevel
        });
        
        if (res.data.leveledUp) {
          alert(`Congratulations! You leveled up to Level ${res.data.newLevel}!`);
        }
        
        if (res.data.newAchievements && res.data.newAchievements.length > 0) {
          alert(`You earned a new badge: ${res.data.newAchievements[0].title}!`);
        }
      }
      
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
            <p className="font-bold text-lg leading-none">{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</p>
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
          
          {/* Weather Impact Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-panel p-6 bg-gradient-to-br from-blue-500/10 to-blue-400/5 relative overflow-hidden border-blue-500/20"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Cloud size={64} className="text-blue-500" />
            </div>
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <MapPin className="text-blue-500" size={20} />
              <span>Today's Weather Impact</span>
            </h2>
            
            {weatherLoading ? (
               <div className="animate-pulse flex flex-col space-y-4">
                 <div className="h-6 bg-surface rounded w-1/2"></div>
                 <div className="h-6 bg-surface rounded w-3/4"></div>
               </div>
            ) : weather ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-surface/50 p-3 rounded-lg border border-border/50">
                  <span className="text-text-secondary flex items-center"><ThermometerSun size={16} className="mr-2" /> Temperature:</span>
                  <span className="font-bold">{weather.temp}°C</span>
                </div>
                {weatherGoalIncrease > 0 ? (
                  <div className="flex justify-between items-center bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <span className="text-blue-500 flex items-center"><Droplets size={16} className="mr-2" /> Goal Increase:</span>
                    <span className="font-bold text-blue-500">+{weatherGoalIncrease}ml</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-surface/50 p-3 rounded-lg border border-border/50 text-sm">
                    <span className="text-text-secondary">No weather adjustments needed.</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-primary/10 p-3 rounded-lg border border-primary/20 mt-2">
                  <span className="font-semibold text-primary">New Goal:</span>
                  <span className="font-bold text-lg text-primary">{adjustedGoal}ml</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">Please allow location access to get smart weather insights.</p>
            )}
          </motion.div>
          
          {/* Activity Integration Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 bg-gradient-to-br from-green-500/10 to-green-400/5 relative overflow-hidden border-green-500/20"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity size={64} className="text-green-500" />
            </div>
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Smartphone className="text-green-500" size={20} />
              <span>Connected Apps</span>
            </h2>
            
            {!isActivityConnected ? (
              <div className="space-y-4">
                <p className="text-sm text-text-secondary">
                  Connect Google Fit or Apple Health to automatically adjust your hydration goals based on your workouts.
                </p>
                <button 
                  onClick={handleConnectActivity}
                  disabled={isConnecting}
                  className="w-full btn-secondary py-2 flex justify-center items-center space-x-2 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 text-green-500"
                >
                  {isConnecting ? (
                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Activity size={18} />
                      <span>Connect App</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center text-green-500 font-semibold">
                    <CheckCircle2 size={16} className="mr-1" />
                    Google Fit Connected
                  </span>
                </div>
                
                {activityData && (
                  <>
                    <div className="flex justify-between items-center bg-surface/50 p-3 rounded-lg border border-border/50">
                      <span className="text-text-secondary flex items-center">
                        <Activity size={16} className="mr-2" /> 
                        {activityData.type}
                      </span>
                      <span className="font-bold">{activityData.duration} mins</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                      <span className="text-green-500 flex items-center">
                        <Droplets size={16} className="mr-2" /> Goal Increase:
                      </span>
                      <span className="font-bold text-green-500">+{activityGoalIncrease}ml</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
          
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
              
              {weather && weatherGoalIncrease > 0 && (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <div className="flex items-start space-x-3">
                  <ThermometerSun className="text-primary mt-1" size={18} />
                  <p className="text-sm leading-relaxed text-text-primary">
                    <span className="font-semibold block mb-1">Weather Adjustment Active</span>
                    Due to the heat, we recommend an additional {weatherGoalIncrease}ml today.
                  </p>
                </div>
              </div>
              )}
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
              
              {/* Real Timeline Items */}
              {todayLogs.map((log, i) => {
                const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                <div key={log.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Droplets size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-primary">{log.amount_ml}ml</span>
                      <time className="text-xs text-text-secondary font-medium">{timeStr}</time>
                    </div>
                    <div className="text-sm text-text-secondary">Logged</div>
                  </div>
                </div>
              )})}
              
              {currentIntake === 0 && (
                <div className="text-center text-text-secondary text-sm py-4 italic z-10 relative bg-surface px-4">
                  No water logged yet today.
                </div>
              )}
            </div>
          </motion.div>

          {/* Gamification Section */}
          <Gamification />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
