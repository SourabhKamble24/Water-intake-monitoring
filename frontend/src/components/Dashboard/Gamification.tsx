import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date_earned: string;
}

const Gamification = () => {
  const { user, token } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/water/achievements', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAchievements(res.data);
      } catch (error) {
        console.error('Error fetching achievements', error);
      }
    };
    if (token) fetchAchievements();
  }, [token]);

  const nextLevelPoints = (user?.level || 1) * 1000;
  const progressPercent = Math.min(((user?.points || 0) / nextLevelPoints) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Level and Points Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-6 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 opacity-10">
          <Crown size={100} className="text-primary" />
        </div>
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Star className="text-yellow-400" size={24} />
              <span>Level {user?.level || 1}</span>
            </h2>
            <p className="text-text-secondary text-sm mt-1">{user?.points || 0} Total Points</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-secondary mb-1">Next Level</p>
            <p className="font-bold text-primary">{nextLevelPoints - (user?.points || 0)} pts to go</p>
          </div>
        </div>

        {/* Progress Bar to next level */}
        <div className="w-full h-3 bg-surface rounded-full overflow-hidden relative z-10 border border-border">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </motion.div>

      {/* Badges/Achievements Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6"
      >
        <h2 className="text-lg font-bold flex items-center space-x-2 mb-6">
          <Trophy className="text-orange-400" size={20} />
          <span>Badges & Achievements</span>
        </h2>
        
        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {achievements.map((ach, i) => (
              <motion.div 
                key={ach.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="flex flex-col items-center p-4 bg-surface rounded-xl border border-primary/20 shadow-sm hover:shadow-md transition-shadow cursor-default"
                title={ach.description}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Target className="text-primary" size={24} />
                </div>
                <p className="text-sm font-bold text-center leading-tight">{ach.title}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-surface rounded-xl border border-dashed border-border text-text-secondary">
            <Trophy size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Log your first glass of water to unlock a badge!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Gamification;
