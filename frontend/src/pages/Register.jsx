import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShoppingBag, FaBriefcase, FaShieldAlt } from 'react-icons/fa';

const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Registration successful! Welcome to Fiverr.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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

          <h2 className="text-3xl font-extrabold leading-tight pt-6">
            Join the World's Freelance Community
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Whether you want to hire top digital specialists or offer your skills to global clients, get started in seconds.
          </p>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-700/60 relative z-10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-emerald-400" />
            <span>Escrow Payment Guarantee on All Orders</span>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Form Side */}
      <div className="p-8 md:p-10 space-y-5 flex flex-col justify-center bg-white dark:bg-slate-900">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Your Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Join thousands of buyers & freelancers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'buyer'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <FaShoppingBag /> Hire Freelancers
              </button>

              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'seller'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <FaBriefcase /> Offer Services
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className="input-field pl-10 text-xs"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FaUser className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                className="input-field pl-10 text-xs"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
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
            {loading ? 'Creating Account...' : (
              <>
                Create Account <FaArrowRight className="text-xs" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Register;