import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Calculate daily goal based on weight and activity level
const calculateGoal = (weight: number, activityLevel: string) => {
  let bonus = 0;
  if (activityLevel === 'Moderate') bonus = 250;
  if (activityLevel === 'Active') bonus = 500;
  return weight * 35 + bonus;
};

// @route POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, age, gender, weight, activityLevel, wakeTime, sleepTime } = req.body;

    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const dailyGoal = calculateGoal(weight, activityLevel);

    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: passwordHash,
          age,
          gender,
          weight,
          activity_level: activityLevel,
          daily_goal: dailyGoal,
          wake_time: wakeTime,
          sleep_time: sleepTime,
          points: 0,
          level: 1
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      res.status(500).json({ message: 'Error creating user' });
      return;
    }

    const payload = { userId: user.id };
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    
    jwt.sign(payload, secret, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name, email, dailyGoal, points: user.points, level: user.level } });
    });
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      res.status(400).json({ message: 'Invalid Credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid Credentials' });
      return;
    }

    const payload = { userId: user.id };
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    jwt.sign(payload, secret, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          dailyGoal: user.daily_goal,
          points: user.points,
          level: user.level
        } 
      });
    });
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).send('Server error');
  }
});

// @route PUT /api/auth/settings
router.put('/settings', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, dailyGoal, weight, wakeTime, notifications, avatarUrl } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        name,
        daily_goal: dailyGoal,
        weight,
        wake_time: wakeTime,
        notifications_enabled: notifications,
        avatar_url: avatarUrl
      })
      .eq('id', req.userId)
      .select('id, name, email, daily_goal, weight, wake_time, notifications_enabled, points, level, avatar_url')
      .single();

    if (error || !user) {
      console.error(error);
      res.status(500).json({ message: 'Error updating settings' });
      return;
    }

    // Return the updated user so frontend can update its context
    res.json({
      message: 'Settings updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dailyGoal: user.daily_goal,
        weight: user.weight,
        wakeTime: user.wake_time,
        notifications: user.notifications_enabled,
        points: user.points,
        level: user.level,
        avatarUrl: user.avatar_url
      }
    });
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).send('Server error');
  }
});

export default router;
