import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { 
  FaMoon, 
  FaSun, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaHeart, 
  FaCommentAlt, 
  FaShoppingBag, 
  FaPlusCircle, 
  FaChartLine, 
  FaSearch, 
  FaShieldAlt 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setIsMenuOpen(false);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    'Graphics & Design',
    'Programming & Tech',
    'Digital Marketing',
    'Video & Animation',
    'Writing & Translation',
    'AI Services',
  ];

  return (
    <header className="glass-header">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              F
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                fiverr<span className="text-emerald-500 font-extrabold text-2xl leading-none">.</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase -mt-1">
                Freelance Hub
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              placeholder="Search for any service..."
              className="w-full pl-10 pr-24 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white dark:focus:bg-slate-950 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-full transition-colors"
            >
              Search
            </button>
          </form>

          {/* Desktop Links & Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <Link
              to="/about"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              About
            </Link>

            {user ? (
              <>
                <Link
                  to="/orders"
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <FaShoppingBag className="text-slate-400 text-xs" />
                  <span>Orders</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <FaHeart className="text-slate-400 text-xs" />
                  <span>Wishlist</span>
                </Link>

                <Link
                  to="/chat"
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <FaCommentAlt className="text-slate-400 text-xs" />
                  <span>Messages</span>
                </Link>

                {user.role === 'seller' && (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <FaChartLine className="text-slate-400 text-xs" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/create-gig" className="btn-primary py-2 text-xs font-semibold">
                      <FaPlusCircle /> Create Gig
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 hover:opacity-80 transition-opacity"
                  >
                    <FaShieldAlt className="text-xs" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* User Avatar Chip */}
                <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/30"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{user.name}</span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{user.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  >
                    <FaSignOutAlt className="text-base" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 text-xs font-semibold">
                  Join Marketplace
                </Link>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <FaSun className="text-amber-400 text-sm" /> : <FaMoon className="text-slate-600 text-sm" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-700 dark:text-slate-200">
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>

        </div>

        {/* Categories Strip */}
        <div className="hidden md:flex items-center space-x-8 py-2 overflow-x-auto border-t border-slate-100 dark:border-slate-900/80 text-xs font-medium text-slate-500 dark:text-slate-400 scrollbar-none">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/?category=${encodeURIComponent(cat)}`}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search services..."
              className="input-field py-2 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 bg-emerald-600 text-white rounded-lg text-xs">
              Go
            </button>
          </form>

          <div className="flex flex-col space-y-3 pt-2 text-sm font-semibold">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-slate-700 dark:text-slate-200">Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-slate-700 dark:text-slate-200">About Platform</Link>

            {user ? (
              <>
                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="text-slate-700 dark:text-slate-200">My Orders</Link>
                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-slate-700 dark:text-slate-200">Wishlist</Link>
                <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="text-slate-700 dark:text-slate-200">Messages</Link>
                {user.role === 'seller' && (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-slate-700 dark:text-slate-200">Seller Dashboard</Link>
                    <Link to="/create-gig" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center">Create New Gig</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-purple-600 dark:text-purple-400">Admin Moderation</Link>
                )}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} className="w-8 h-8 rounded-full" />
                    <span className="text-xs font-bold">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-xs text-rose-600 font-bold">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary text-center">Sign In</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center">Join Marketplace</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;