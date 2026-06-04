import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthLayout from '../components/Layout/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setIsSent(true);
      toast.success(res.data.message || 'Reset link sent successfully!');
      
      if (res.data.previewUrl) {
        // Log the Ethereal email URL for development testing
        console.log("Ethereal Email Preview URL:", res.data.previewUrl);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email address and we'll send you a link to reset your password."
      isRegister={false}
    >
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
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
                placeholder="you@example.com" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_8px_20px_rgba(0,180,216,0.3)] text-sm font-bold text-white bg-[#00b4d8] hover:bg-[#0096c7] hover:shadow-[0_10px_25px_rgba(0,180,216,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b4d8] transition-all mt-4 transform active:scale-[0.98]">
            {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-8">
          <div className="w-16 h-16 bg-[#00b4d8]/10 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="h-8 w-8 text-[#00b4d8]" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Check your email</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            We've sent a password reset link to <br/><span className="font-semibold text-slate-700">{email}</span>
          </p>
        </div>
      )}

      <div className="mt-auto pt-8">
        <Link to="/login" className="flex items-center justify-center text-sm font-bold text-[#00b4d8] hover:text-[#0096c7] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
