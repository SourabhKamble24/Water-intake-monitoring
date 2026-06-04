import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthLayout from '../components/Layout/AuthLayout';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { 
        token, 
        newPassword: password 
      });
      toast.success(res.data.message || 'Password successfully reset!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create New Password" 
      subtitle="Your new password must be different from previous used passwords."
      isRegister={false}
    >
      <form onSubmit={handleSubmit} className="space-y-5 flex-grow">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 bg-[#f4f7fb] border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400" 
              placeholder="••••••••••" 
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_8px_20px_rgba(0,180,216,0.3)] text-sm font-bold text-white bg-[#00b4d8] hover:bg-[#0096c7] hover:shadow-[0_10px_25px_rgba(0,180,216,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b4d8] transition-all mt-6 transform active:scale-[0.98]">
          {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
        </button>
      </form>

      <div className="mt-auto pt-8">
        <Link to="/login" className="flex items-center justify-center text-sm font-bold text-[#00b4d8] hover:text-[#0096c7] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
