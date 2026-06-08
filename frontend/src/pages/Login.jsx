import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthLayout from '../components/Layout/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        email,
        password
      });
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name || 'User'}!`, {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome to HydroTrack" 
      subtitle="Sign in to access your dashboard and track your hydration."
      isRegister={false}
    >

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 flex-grow">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 bg-[#f4f7fb] border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400" 
              placeholder="vikaas33@gmail.com" 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <Link to="/forgot-password" className="text-xs text-[#00b4d8] hover:text-[#0096c7] font-semibold transition-colors">Forgot password?</Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full pl-11 pr-11 py-3 bg-[#f4f7fb] border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400" 
              placeholder="••••••••••" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-[#00d2ff] focus:ring-[#00d2ff] border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
            Remember me
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_8px_20px_rgba(0,180,216,0.3)] text-sm font-bold text-white bg-[#00b4d8] hover:bg-[#0096c7] hover:shadow-[0_10px_25px_rgba(0,180,216,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b4d8] transition-all mt-4 transform active:scale-[0.98]">
          {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-auto pt-8">
        <p className="text-center text-xs text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00b4d8] hover:text-[#0096c7] font-bold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;