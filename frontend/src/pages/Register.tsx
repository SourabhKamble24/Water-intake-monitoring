import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Mail, Lock, User as UserIcon, Loader2, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    weight: '',
    activityLevel: 'Moderate',
    wakeTime: '07:00',
    sleepTime: '23:00'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight)
      };
      
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden font-sans pt-12 pb-12">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
      
      <div className="glass-panel w-full max-w-md p-8 relative z-10 shadow-premium">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-primary-dark to-primary p-3 rounded-2xl shadow-lg mb-4">
            <Droplets className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2 tracking-tight">Create Account</h1>
          <p className="text-text-secondary">Start your hydration journey today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-text-secondary" />
              </div>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field w-full pl-10 bg-surface-hover" placeholder="John Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-secondary" />
              </div>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field w-full pl-10 bg-surface-hover" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-secondary" />
              </div>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className="input-field w-full pl-10 bg-surface-hover" placeholder="••••••••" />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center space-x-2">
              <Target size={16} />
              <span>Personalize Your Experience</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Age</label>
                <input type="number" name="age" required min="1" max="120" value={formData.age} onChange={handleChange} className="input-field w-full bg-surface-hover" placeholder="25" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Weight (kg)</label>
                <input type="number" name="weight" required min="20" max="300" value={formData.weight} onChange={handleChange} className="input-field w-full bg-surface-hover" placeholder="70" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field w-full bg-surface-hover">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Activity Level</label>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="input-field w-full bg-surface-hover">
                  <option value="Sedentary">Sedentary</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Active">Active</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-xs text-text-secondary mb-1">Wake Time</label>
              <input type="time" name="wakeTime" required value={formData.wakeTime} onChange={handleChange} className="input-field w-full bg-surface-hover" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center h-12 mt-8">
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-text-secondary text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-light font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
