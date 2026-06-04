import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProgressIndicator from '../components/Dashboard/ProgressIndicator';
import QuickAdd from '../components/Dashboard/QuickAdd';
import Gamification from '../components/Dashboard/Gamification';
import VirtualPlant from '../components/Dashboard/VirtualPlant';
import TiltCard from '../components/Dashboard/TiltCard';
import { ThermometerSun, Zap, Clock, TrendingUp, Droplets, MapPin, Cloud, Activity, Smartphone, CheckCircle2, Target, Flame, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <TiltCard>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5 relative overflow-hidden h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-surface/50 border border-border/50 ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        <p className="text-text-secondary text-xs mt-1">{subtext}</p>
      </div>
    </motion.div>
  </TiltCard>
);
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};
const Dashboard = () => {
  const {
    user,
    token,
    updateUser
  } = useAuth();
  const [currentIntake, setCurrentIntake] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [todayLogs, setTodayLogs] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Activity Integration state (Simulated for MVP)
  const [isActivityConnected, setIsActivityConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activityData, setActivityData] = useState(null);

  // Weather state
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Calculate adjusted goal based on weather and activity
  let weatherGoalIncrease = 0;
  if (weather) {
    if (weather.temp >= 40) weatherGoalIncrease = 750;else if (weather.temp >= 35) weatherGoalIncrease = 500;else if (weather.temp >= 30) weatherGoalIncrease = 300;

    // High humidity factor
    if (weather.humidity >= 70 && weather.temp >= 25) weatherGoalIncrease += 200;
  }
  let activityGoalIncrease = 0;
  if (activityData) {
    if (activityData.intensity === 'Light') activityGoalIncrease = 250;else if (activityData.intensity === 'Moderate') activityGoalIncrease = 500;else if (activityData.intensity === 'Intense') activityGoalIncrease = 1000;
  }
  const adjustedGoal = user?.dailyGoal ? user.dailyGoal + weatherGoalIncrease + activityGoalIncrease : 2500;
  const fetchDashboardData = async () => {
    try {
      const [todayRes, analyticsRes] = await Promise.all([axios.get('http://localhost:5000/api/water/today', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }), axios.get('http://localhost:5000/api/water/analytics', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })]);
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
      navigator.geolocation.getCurrentPosition(async position => {
        try {
          const {
            latitude,
            longitude
          } = position.coords;
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
      }, error => {
        console.error('Geolocation error:', error);
        setWeatherLoading(false);
      });
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
        duration: 45,
        // mins
        intensity: 'Intense'
      });
      setIsConnecting(false);
    }, 1500);
  };
  useEffect(() => {
    if (token) fetchDashboardData();
    fetchWeather();
  }, [token]);
  const handleAddWater = async amount => {
    if (amount <= 0) return;
    setAddLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/water', {
        amountMl: amount
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
          console.log(`Congratulations! You leveled up to Level ${res.data.newLevel}!`);
        }
        if (res.data.newAchievements && res.data.newAchievements.length > 0) {
          console.log(`You earned a new badge: ${res.data.newAchievements[0].title}!`);
        }
      }
    } catch (error) {
      console.error('Error adding water', error);
    } finally {
      setAddLoading(false);
    }
  };
  const handleCustomAdd = e => {
    e.preventDefault();
    const amount = parseInt(customAmount);
    if (!isNaN(amount)) {
      handleAddWater(amount);
      setCustomAmount('');
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex h-full items-center justify-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
    }));
  }

  // Calculate insights
  const percentage = Math.min(currentIntake / adjustedGoal * 100, 100) || 0;
  const isAhead = percentage > 50 && new Date().getHours() < 14;
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto space-y-8"
  }, /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0,
      y: -20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    className: "flex flex-col md:flex-row md:items-end justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl md:text-4xl font-bold mb-2 tracking-tight"
  }, getGreeting(), ", ", user?.name?.split(' ')[0] || 'User', " \uD83D\uDC4B"), /*#__PURE__*/React.createElement("p", {
    className: "text-text-secondary text-lg"
  }, "Let's reach your hydration goal today.")), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel px-4 py-2 flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl"
  }, "\uD83D\uDD25")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-text-secondary"
  }, "Current Streak"), /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-lg leading-none"
  }, currentStreak, " ", currentStreak === 1 ? 'Day' : 'Days')))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-8"
  }, /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      scale: 1
    },
    transition: {
      delay: 0.1
    },
    className: "glass-panel p-8 flex flex-col relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start mb-8 relative z-10"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold"
  }, "Daily Progress"), /*#__PURE__*/React.createElement("p", {
    className: "text-text-secondary text-sm mt-1"
  }, "Based on your personal settings"))), /*#__PURE__*/React.createElement(ProgressIndicator, {
    currentIntake: currentIntake,
    dailyGoal: adjustedGoal
  })), /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      delay: 0.2
    },
    className: "glass-panel p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold"
  }, "Quick Add Water"), /*#__PURE__*/React.createElement("p", {
    className: "text-text-secondary text-sm mt-1"
  }, "Quickly add to your daily total")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCustomAdd,
    className: "flex space-x-2 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    placeholder: "Custom (ml)",
    value: customAmount,
    onChange: e => setCustomAmount(e.target.value),
    className: "input-field w-full sm:w-32 h-11 bg-surface-hover border-transparent"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: addLoading || !customAmount,
    className: "btn-primary h-11 px-6 whitespace-nowrap"
  }, "Add"))), /*#__PURE__*/React.createElement(QuickAdd, {
    onAdd: handleAddWater,
    isLoading: addLoading
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, /*#__PURE__*/React.createElement(VirtualPlant, {
    percentage: percentage
  }), /*#__PURE__*/React.createElement(Gamification, null))),
  
  /* KPI Section */
  /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-4 gap-6"
  }, 
    /*#__PURE__*/React.createElement(KPICard, { title: "Goal Remaining", value: Math.max((adjustedGoal - currentIntake) / 1000, 0).toFixed(1) + " Litre", subtext: Math.round(100 - percentage) + "% Left", icon: Target, colorClass: "text-blue-400" }),
    /*#__PURE__*/React.createElement(KPICard, { title: "Current Streak", value: currentStreak + " Days", subtext: "Keep it up!", icon: Flame, colorClass: "text-orange-400" }),
    /*#__PURE__*/React.createElement(KPICard, { title: "Daily Average", value: "2.3 Litres", subtext: "This Week", icon: Activity, colorClass: "text-green-400" }),
    /*#__PURE__*/React.createElement(KPICard, { title: "Monthly Progress", value: "65%", subtext: "19 of 30 Days", icon: PieChart, colorClass: "text-purple-400" })
  ),
  
  /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-6"
  }, /*#__PURE__*/React.createElement(TiltCard, null, /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      delay: 0.25
    },
    className: "glass-panel p-6 bg-gradient-to-br from-blue-500/10 to-blue-400/5 relative overflow-hidden border-blue-500/20 h-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 p-4 opacity-10"
  }, /*#__PURE__*/React.createElement(Cloud, {
    size: 64,
    className: "text-blue-500"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-bold mb-4 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(MapPin, {
    className: "text-blue-500",
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, "Today's Weather Impact")), weatherLoading ? /*#__PURE__*/React.createElement("div", {
    className: "animate-pulse flex flex-col space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-6 bg-surface rounded w-1/2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-6 bg-surface rounded w-3/4"
  })) : weather ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center bg-surface/50 p-3 rounded-lg border border-border/50"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-text-secondary flex items-center"
  }, /*#__PURE__*/React.createElement(ThermometerSun, {
    size: 16,
    className: "mr-2"
  }), " Temperature:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, weather.temp, "\xB0C")), weatherGoalIncrease > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center bg-blue-500/10 p-3 rounded-lg border border-blue-500/20"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-blue-500 flex items-center"
  }, /*#__PURE__*/React.createElement(Droplets, {
    size: 16,
    className: "mr-2"
  }), " Goal Increase:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-blue-500"
  }, "+", weatherGoalIncrease, "ml")) : /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center bg-surface/50 p-3 rounded-lg border border-border/50 text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-text-secondary"
  }, "No weather adjustments needed.")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center bg-primary/10 p-3 rounded-lg border border-primary/20 mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-primary"
  }, "New Goal:"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-lg text-primary"
  }, adjustedGoal, "ml"))) : /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-text-secondary"
  }, "Please allow location access to get smart weather insights.")))))))));
};
export default Dashboard;