import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AuthLayout from '../components/Layout/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Register = () => {
  const [step, setStep] = useState(1);
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

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields to continue.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async e => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }
    
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={step === 1 ? "Create Account" : "Personalize"} 
      subtitle={step === 1 ? "Start your hydration journey today" : "Help us calculate your perfect daily goal"}
      isRegister={true}
    >
      {/* Progress Dots */}
      <div className="flex justify-center space-x-2 mb-8">
        <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-primary' : 'w-2 bg-border'}`} />
        <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-primary' : 'w-2 bg-border'}`} />
      </div>



      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-start">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-[#f4f7fb] border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-[#f4f7fb] border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400" placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-[#f4f7fb] border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400" placeholder="••••••••" />
                </div>
              </div>

              <button type="button" onClick={handleNext} className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_8px_20px_rgba(0,180,216,0.3)] text-sm font-bold text-white bg-[#00b4d8] hover:bg-[#0096c7] hover:shadow-[0_10px_25px_rgba(0,180,216,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b4d8] transition-all mt-4 transform active:scale-[0.98]">
                Continue <ArrowRight size={18} className="ml-2" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Age</label>
                  <input type="number" name="age" required min="1" max="120" value={formData.age} onChange={handleChange} className="input-field w-full bg-surface-hover" placeholder="25" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Weight (kg)</label>
                  <input type="number" name="weight" required min="20" max="300" value={formData.weight} onChange={handleChange} className="input-field w-full bg-surface-hover" placeholder="70" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="input-field w-full bg-surface-hover">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Activity Level</label>
                  <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="input-field w-full bg-surface-hover">
                    <option value="Sedentary">Sedentary</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Wake Time</label>
                  <input type="time" name="wakeTime" required value={formData.wakeTime} onChange={handleChange} className="input-field w-full bg-surface-hover" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Sleep Time</label>
                  <input type="time" name="sleepTime" required value={formData.sleepTime} onChange={handleChange} className="input-field w-full bg-surface-hover" />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={handleBack} className="flex-1 flex justify-center items-center h-12 bg-[#f4f7fb] hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors border border-transparent">
                  <ArrowLeft size={18} className="mr-2" /> Back
                </button>
                <button type="submit" disabled={loading} className="flex-[2] flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_8px_20px_rgba(0,180,216,0.3)] text-sm font-bold text-white bg-[#00b4d8] hover:bg-[#0096c7] hover:shadow-[0_10px_25px_rgba(0,180,216,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b4d8] transition-all transform active:scale-[0.98]">
                  {loading ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-auto pt-8">
        <p className="text-center text-xs text-slate-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00b4d8] hover:text-[#0096c7] font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;