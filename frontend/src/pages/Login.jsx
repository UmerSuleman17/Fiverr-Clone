import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden card border-none shadow-soft-lg">
      
      {/* Left Branding Side */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-xl">
              F
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              fiverr<span className="text-emerald-400">.</span>
            </span>
          </Link>

          <h2 className="text-3xl font-extrabold leading-tight pt-8">
            Access Your Freelance Workspace
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your orders, communicate with clients in real-time, and track your business growth.
          </p>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-700/60 relative z-10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-emerald-400" />
            <span>256-bit Encrypted Escrow Security</span>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Form Side */}
      <div className="p-8 md:p-12 space-y-6 flex flex-col justify-center bg-white dark:bg-slate-900">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sign In to Fiverr</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                className="input-field pl-10 text-xs"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field pl-10 pr-10 text-xs"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs font-bold"
          >
            {loading ? 'Signing in...' : (
              <>
                Sign In <FaArrowRight className="text-xs" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Login;