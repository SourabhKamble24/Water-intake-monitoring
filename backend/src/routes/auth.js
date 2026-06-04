import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { supabase } from '../config/supabaseClient.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();

// Calculate daily goal based on weight and activity level
const calculateGoal = (weight, activityLevel) => {
  let bonus = 0;
  if (activityLevel === 'Moderate') bonus = 250;
  if (activityLevel === 'Active') bonus = 500;
  return weight * 35 + bonus;
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      weight,
      activityLevel,
      wakeTime,
      sleepTime
    } = req.body;
    const {
      data: existingUser,
      error: checkError
    } = await supabase.from('users').select('id').eq('email', email).single();
    if (existingUser) {
      res.status(400).json({
        message: 'User already exists'
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const dailyGoal = calculateGoal(weight, activityLevel);
    const {
      data: user,
      error: insertError
    } = await supabase.from('users').insert([{
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
    }]).select().single();
    if (insertError) {
      console.error(insertError);
      res.status(500).json({
        message: 'Error creating user'
      });
      return;
    }
    const payload = {
      userId: user.id
    };
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    jwt.sign(payload, secret, {
      expiresIn: '7d'
    }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          name,
          email,
          dailyGoal,
          points: user.points,
          level: user.level
        }
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const {
      data: user,
      error
    } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !user) {
      res.status(400).json({
        message: 'Invalid Credentials'
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(400).json({
        message: 'Invalid Credentials'
      });
      return;
    }
    const payload = {
      userId: user.id
    };
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    jwt.sign(payload, secret, {
      expiresIn: '7d'
    }, (err, token) => {
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
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route PUT /api/auth/settings
router.put('/settings', authenticate, async (req, res) => {
  try {
    const {
      name,
      dailyGoal,
      weight,
      wakeTime,
      notifications,
      avatarUrl
    } = req.body;
    const {
      data: user,
      error
    } = await supabase.from('users').update({
      name,
      daily_goal: dailyGoal,
      weight,
      wake_time: wakeTime,
      notifications_enabled: notifications,
      avatar_url: avatarUrl
    }).eq('id', req.userId).select('id, name, email, daily_goal, weight, wake_time, notifications_enabled, points, level, avatar_url').single();
    if (error || !user) {
      console.error(error);
      res.status(500).json({
        message: 'Error updating settings'
      });
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
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Create reusable transporter object using Ethereal for testing
let testAccount;
let transporter;
const initTransporter = async () => {
  if (!transporter) {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

// @route POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const { data: user, error } = await supabase.from('users').select('id, name').eq('email', email).single();
    
    if (error || !user) {
      // Don't leak that user doesn't exist
      return res.status(200).json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

    // Save token in DB
    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_token: resetTokenHash,
        reset_token_expires_at: expiresAt
      })
      .eq('id', user.id);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ message: 'Error processing request' });
    }

    // Send Email
    await initTransporter();
    
    // In production, this would be an environment variable
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    
    const info = await transporter.sendMail({
      from: '"HydroTrack Admin" <no-reply@hydrotrack.com>',
      to: email,
      subject: "Password Reset Request - HydroTrack",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>You requested a password reset. Please click the link below to set a new password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({ 
      message: 'If an account with that email exists, we sent a password reset link.',
      previewUrl: nodemailer.getTestMessageUrl(info) // For easy access during development
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token that hasn't expired
    const { data: user, error } = await supabase
      .from('users')
      .select('id, reset_token_expires_at')
      .eq('reset_token', resetTokenHash)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Check expiry
    if (new Date(user.reset_token_expires_at) < new Date()) {
      return res.status(400).json({ message: 'Password reset token has expired' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password and clear token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expires_at: null
      })
      .eq('id', user.id);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ message: 'Error resetting password' });
    }

    res.status(200).json({ message: 'Password successfully reset! You can now log in.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

export default router;