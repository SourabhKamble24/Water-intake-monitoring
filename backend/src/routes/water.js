import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../config/supabaseClient.js';
const router = Router();

// @route POST /api/water
// @desc Log water intake
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      amountMl
    } = req.body;
    if (!amountMl || amountMl <= 0) {
      res.status(400).json({
        message: 'Valid amount is required'
      });
      return;
    }
    const {
      data: newLog,
      error: insertError
    } = await supabase.from('water_logs').insert([{
      user_id: req.userId,
      amount_ml: amountMl
    }]).select().single();
    if (insertError) {
      console.error(insertError);
      res.status(500).json({
        message: 'Error logging water'
      });
      return;
    }

    // Gamification Logic
    // 1. Calculate new points (1 point per 10 ml)
    const pointsEarned = Math.floor(amountMl / 10);

    // Fetch current user data
    const {
      data: user,
      error: userError
    } = await supabase.from('users').select('points, level').eq('id', req.userId).single();
    if (userError) {
      console.error(userError);
    }
    let newPoints = (user?.points || 0) + pointsEarned;

    // 2. Calculate Level (Level 1: 0-1000, Level 2: 1001-2000, etc.)
    let newLevel = Math.floor(newPoints / 1000) + 1;
    let leveledUp = newLevel > (user?.level || 1);

    // Update user
    await supabase.from('users').update({
      points: newPoints,
      level: newLevel
    }).eq('id', req.userId);

    // 3. Achievements logic (simplified check for MVP: First Log)
    let newAchievements = [];
    const {
      data: existingAchievements
    } = await supabase.from('achievements').select('title').eq('user_id', req.userId).eq('title', 'First Drop');
    if (!existingAchievements || existingAchievements.length === 0) {
      // Award "First Drop" badge
      const {
        data: badge
      } = await supabase.from('achievements').insert([{
        user_id: req.userId,
        title: 'First Drop',
        description: 'Logged water for the first time!'
      }]).select().single();
      if (badge) newAchievements.push(badge);
    }

    // get daily total
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const {
      data: logs,
      error: logsError
    } = await supabase.from('water_logs').select('amount_ml').eq('user_id', req.userId).gte('timestamp', startOfDay.toISOString()).lte('timestamp', endOfDay.toISOString());
    if (logsError) {
      console.error(logsError);
      res.status(500).json({
        message: 'Error fetching daily total'
      });
      return;
    }
    const currentIntake = logs.reduce((acc, log) => acc + Number(log.amount_ml), 0);
    res.json({
      newLog,
      currentIntake,
      pointsEarned,
      newPoints,
      newLevel,
      leveledUp,
      newAchievements
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/water/today
// @desc Get today's water intake
router.get('/today', authenticate, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const {
      data: logs,
      error: logsError
    } = await supabase.from('water_logs').select('*').eq('user_id', req.userId).gte('timestamp', startOfDay.toISOString()).lte('timestamp', endOfDay.toISOString()).order('timestamp', {
      ascending: false
    });
    if (logsError) {
      console.error(logsError);
      res.status(500).json({
        message: 'Error fetching logs'
      });
      return;
    }
    const currentIntake = logs.reduce((acc, log) => acc + Number(log.amount_ml), 0);
    res.json({
      logs,
      currentIntake
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/water/analytics
// @desc Get analytics data (weekly, monthly, KPIs)
router.get('/analytics', authenticate, async (req, res) => {
  try {
    // 1. Fetch user to get daily_goal
    const {
      data: user
    } = await supabase.from('users').select('daily_goal').eq('id', req.userId).single();
    const dailyGoal = user?.daily_goal || 2500;

    // 2. Fetch logs for the last 12 months
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const {
      data: logs,
      error: logsError
    } = await supabase.from('water_logs').select('amount_ml, timestamp').eq('user_id', req.userId).gte('timestamp', oneYearAgo.toISOString()).order('timestamp', {
      ascending: true
    });
    if (logsError) {
      console.error(logsError);
      res.status(500).json({
        message: 'Error fetching analytics logs'
      });
      return;
    }

    // Initialize arrays
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Last 7 days data
    const weeklyDataMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      weeklyDataMap.set(key, {
        day: days[d.getDay()],
        amount: 0,
        goal: dailyGoal,
        date: key
      });
    }

    // Last 12 months data
    const monthlyDataMap = new Map();
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyDataMap.set(key, {
        month: months[d.getMonth()],
        amount: 0
      });
    }
    let totalAmount30Days = 0;
    let daysWithLogs30Days = 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const logsByDay = new Map();
    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const dayKey = date.toISOString().split('T')[0];
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const amount = Number(log.amount_ml);

      // Populate Weekly
      if (weeklyDataMap.has(dayKey)) {
        weeklyDataMap.get(dayKey).amount += amount;
      }

      // Populate Monthly
      if (monthlyDataMap.has(monthKey)) {
        monthlyDataMap.get(monthKey).amount += amount;
      }

      // Populate logsByDay for streaks
      if (logsByDay.has(dayKey)) {
        logsByDay.set(dayKey, logsByDay.get(dayKey) + amount);
      } else {
        logsByDay.set(dayKey, amount);
      }

      // Calculate Average Daily (last 30 days)
      if (date >= thirtyDaysAgo) {
        totalAmount30Days += amount;
      }
    });

    // Average Daily (Last 30 days) & Goal Reached Days
    let daysGoalReached30Days = 0;
    // We only count days they actually logged something to avoid dividing by 30 if they just started
    logsByDay.forEach((amount, date) => {
      if (new Date(date) >= thirtyDaysAgo) {
        daysWithLogs30Days++;
        if (amount >= dailyGoal) {
          daysGoalReached30Days++;
        }
      }
    });
    const averageDaily = daysWithLogs30Days > 0 ? Math.round(totalAmount30Days / daysWithLogs30Days) : 0;
    const monthlyProgressPercent = Math.round((daysGoalReached30Days / 30) * 100);

    // Goal Completion % (Last 7 days average)
    let totalWeeklyGoal = 7 * dailyGoal;
    let totalWeeklyIntake = 0;
    weeklyDataMap.forEach(v => {
      totalWeeklyIntake += v.amount;
    });
    const goalCompletion = Math.min(Math.round(totalWeeklyIntake / totalWeeklyGoal * 100), 100) || 0;

    // Calculate Best Streak
    let bestStreak = 0;
    let currentStreak = 0;
    const sortedDays = Array.from(logsByDay.keys()).sort();
    for (let i = 0; i < sortedDays.length; i++) {
      if (logsByDay.get(sortedDays[i]) >= dailyGoal) {
        // Did they reach the goal?
        if (i > 0) {
          const prevDay = new Date(sortedDays[i - 1]);
          const currDay = new Date(sortedDays[i]);
          const diffTime = Math.abs(currDay.getTime() - prevDay.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 0;
      }
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    }
    res.json({
      weeklyData: Array.from(weeklyDataMap.values()),
      monthlyData: Array.from(monthlyDataMap.values()),
      kpis: {
        averageDaily,
        goalCompletion,
        bestStreak,
        currentStreak,
        daysGoalReached30Days,
        monthlyProgressPercent
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/water/export
// @desc Get all water logs for export
router.get('/export', authenticate, async (req, res) => {
  try {
    const {
      data: logs,
      error
    } = await supabase.from('water_logs').select('amount_ml, timestamp').eq('user_id', req.userId).order('timestamp', {
      ascending: false
    });
    if (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error fetching logs for export'
      });
      return;
    }
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/water/achievements
// @desc Get user achievements
router.get('/achievements', authenticate, async (req, res) => {
  try {
    const {
      data: achievements,
      error
    } = await supabase.from('achievements').select('*').eq('user_id', req.userId).order('date_earned', {
      ascending: false
    });
    if (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error fetching achievements'
      });
      return;
    }
    res.json(achievements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
export default router;