import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { FaMoon, FaSun, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Fiverr</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Clone</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  Orders
                </Link>
                {user.role === 'seller' && (
                  <>
                    <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                      Dashboard
                    </Link>
                    <Link to="/create-gig" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                      Create Gig
                    </Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                    Admin
                  </Link>
                )}
                <Link to="/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  Wishlist
                </Link>
                <Link to="/chat" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  Chat
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  Register
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden p-2">
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">Home</Link>
              {user ? (
                <>
                  <Link to="/orders" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">Orders</Link>
                  {user.role === 'seller' && (
                    <>
                      <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">Dashboard</Link>
                      <Link to="/create-gig" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-center">Create Gig</Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">Admin</Link>
                  )}
                  <Link to="/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">Wishlist</Link>
                  <Link to="/chat" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">Chat</Link>
                  <button onClick={handleLogout} className="text-red-600 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">Login</Link>
                  <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-center">Register</Link>
                </>
              )}
              <button onClick={toggleTheme} className="flex items-center space-x-2">
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
                <span>Toggle Theme</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;