/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
<<<<<<< HEAD
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useUser } from '../UserContext/UserContext';

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, setUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
=======
import { Menu, X } from 'lucide-react';
=======
import { Menu, X, Moon, Sun } from 'lucide-react';
>>>>>>> Houssam
import { useUser } from '../UserContext/UserContext';

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, setUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
<<<<<<< HEAD
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
  const [darkMode, setDarkMode] = useState(false);
>>>>>>> Houssam
  const navigate = useNavigate();
  
  // API base URL - fallback to localhost if env var not set
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Houssam
  // Dark mode initialization
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedMode ? JSON.parse(savedMode) : prefersDark;
    
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

<<<<<<< HEAD
=======
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
>>>>>>> Houssam
  // Token management functions
  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const setToken = (token) => {
    try {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error setting token:', error);
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      fetchProfile(token);
    }
  }, []); // Remove user from dependency array to prevent infinite loops

  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errors?.[0]?.msg || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const fetchProfile = async (token = null) => {
    const authToken = token || getToken();
    if (!authToken) return;

    try {
      const userData = await apiCall('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setUser(userData);
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Only logout if it's an authentication error (401/403)
      if (error.message.includes('401') || error.message.includes('403') || error.message.includes('unauthorized')) {
        handleLogout();
      }
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple simultaneous logout calls
    
    setIsLoggingOut(true);
    
    try {
      const token = getToken();
      if (token) {
        // Call logout API endpoint
        await apiCall('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Logout successful');
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and state regardless of API call result
      setToken(null);
      setUser(null);
      setMobileMenuOpen(false);
      setIsLoggingOut(false);
      
      // Navigate to login page
      navigate('/login');
    }
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <nav className="bg-gray-300 dark:bg-gradient-to-r dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 shadow-sm border-b border-gray-200 dark:border-white/10 backdrop-blur-sm transition-all duration-300">
=======
    <nav className="bg-white shadow-sm border-b ">
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
    <nav className="bg-gray-300 dark:bg-gradient-to-r dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 shadow-sm border-b border-gray-200 dark:border-white/10 backdrop-blur-sm transition-all duration-300">
>>>>>>> Houssam
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
<<<<<<< HEAD
<<<<<<< HEAD
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-300 dark:to-teal-300 bg-clip-text text-transparent hover:from-blue-700 hover:to-teal-600 dark:hover:from-blue-200 dark:hover:to-teal-200 transition-all duration-300">
=======
              <Link to="/" className="text-2xl font-bold text-blue-600">
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-300 dark:to-teal-300 bg-clip-text text-transparent hover:from-blue-700 hover:to-teal-600 dark:hover:from-blue-200 dark:hover:to-teal-200 transition-all duration-300">
>>>>>>> Houssam
                MedSearch
              </Link>
            </div>
          </div>
                   
          {/* Desktop Navigation */}
          <div className="hidden md:block">
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Houssam
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle - FIXED */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full transition-all duration-300 backdrop-blur-sm border bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>

<<<<<<< HEAD
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-gray-700 dark:text-blue-100 font-medium flex items-center">
                    <span className="mr-1">Welcome,</span>
                    <span className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-300 dark:to-teal-300 bg-clip-text text-transparent font-bold">
                      {user.name}
                    </span>
                  </div>
                  <Link
                    to="/blog/create"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-400 dark:to-purple-400 dark:hover:from-indigo-300 dark:hover:to-purple-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm flex items-center h-10"
=======
            <div className="ml-10 flex items-baseline space-x-4">
=======
>>>>>>> Houssam
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-gray-700 dark:text-blue-100 font-medium flex items-center">
                    <span className="mr-1">Welcome,</span>
                    <span className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-300 dark:to-teal-300 bg-clip-text text-transparent font-bold">
                      {user.name}
                    </span>
                  </div>
                  <Link
                    to="/blog/create"
<<<<<<< HEAD
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-400 dark:to-purple-400 dark:hover:from-indigo-300 dark:hover:to-purple-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm flex items-center h-10"
>>>>>>> Houssam
                  >
                    Create Post
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
<<<<<<< HEAD
<<<<<<< HEAD
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg transform hover:scale-105 backdrop-blur-sm flex items-center h-10 ${
                      isLoggingOut
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 dark:from-red-400 dark:to-pink-400 dark:hover:from-red-300 dark:hover:to-pink-300 text-white hover:shadow-xl'
=======
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isLoggingOut
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg transform hover:scale-105 backdrop-blur-sm flex items-center h-10 ${
                      isLoggingOut
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 dark:from-red-400 dark:to-pink-400 dark:hover:from-red-300 dark:hover:to-pink-300 text-white hover:shadow-xl'
>>>>>>> Houssam
                    }`}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              ) : (
<<<<<<< HEAD
<<<<<<< HEAD
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 dark:from-blue-400 dark:to-teal-400 dark:hover:from-blue-300 dark:hover:to-teal-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm flex items-center h-10"
=======
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 dark:from-blue-400 dark:to-teal-400 dark:hover:from-blue-300 dark:hover:to-teal-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm flex items-center h-10"
>>>>>>> Houssam
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
<<<<<<< HEAD
<<<<<<< HEAD
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-400 dark:to-emerald-400 dark:hover:from-green-300 dark:hover:to-emerald-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm flex items-center h-10"
=======
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-400 dark:to-emerald-400 dark:hover:from-green-300 dark:hover:to-emerald-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm flex items-center h-10"
>>>>>>> Houssam
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Houssam
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile dark mode toggle - FIXED */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-all duration-300 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </button>
            
<<<<<<< HEAD
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 dark:text-blue-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
=======
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 dark:text-blue-200 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
>>>>>>> Houssam
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
<<<<<<< HEAD
<<<<<<< HEAD
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gradient-to-r dark:from-slate-900/95 dark:via-blue-900/95 dark:to-indigo-900/95 border-t border-gray-200 dark:border-white/10 backdrop-blur-xl">
            {user ? (
              <div className="space-y-2">
                <div className="text-gray-700 dark:text-blue-100 px-3 py-2 font-medium flex items-center">
                  <span className="mr-1">Welcome,</span>
                  <span className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-300 dark:to-teal-300 bg-clip-text text-transparent font-bold">
                    {user.name}
                  </span>
                </div>
                <Link
                  to="/blog/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-400 dark:to-purple-400 dark:hover:from-indigo-300 dark:hover:to-purple-300 text-white px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
=======
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
=======
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gradient-to-r dark:from-slate-900/95 dark:via-blue-900/95 dark:to-indigo-900/95 border-t border-gray-200 dark:border-white/10 backdrop-blur-xl">
>>>>>>> Houssam
            {user ? (
              <div className="space-y-2">
                <div className="text-gray-700 dark:text-blue-100 px-3 py-2 font-medium flex items-center">
                  <span className="mr-1">Welcome,</span>
                  <span className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-300 dark:to-teal-300 bg-clip-text text-transparent font-bold">
                    {user.name}
                  </span>
                </div>
                <Link
                  to="/blog/create"
                  onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
                  className="block w-full text-left bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
                  className="block w-full text-left bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-400 dark:to-purple-400 dark:hover:from-indigo-300 dark:hover:to-purple-300 text-white px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
>>>>>>> Houssam
                >
                  Create Post
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
<<<<<<< HEAD
<<<<<<< HEAD
                  className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-lg transform hover:scale-105 ${
                    isLoggingOut
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 dark:from-red-400 dark:to-pink-400 dark:hover:from-red-300 dark:hover:to-pink-300 text-white'
=======
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isLoggingOut
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
                  className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-lg transform hover:scale-105 ${
                    isLoggingOut
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 dark:from-red-400 dark:to-pink-400 dark:hover:from-red-300 dark:hover:to-pink-300 text-white'
>>>>>>> Houssam
                  }`}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
<<<<<<< HEAD
                  className="block w-full text-left bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 dark:from-blue-400 dark:to-teal-400 dark:hover:from-blue-300 dark:hover:to-teal-300 text-white px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
=======
                  className="block w-full text-left bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
                  className="block w-full text-left bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 dark:from-blue-400 dark:to-teal-400 dark:hover:from-blue-300 dark:hover:to-teal-300 text-white px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
>>>>>>> Houssam
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
<<<<<<< HEAD
                  className="block w-full text-left bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-400 dark:to-emerald-400 dark:hover:from-green-300 dark:hover:to-emerald-300 text-white px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
=======
                  className="block w-full text-left bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
=======
                  className="block w-full text-left bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-400 dark:to-emerald-400 dark:hover:from-green-300 dark:hover:to-emerald-300 text-white px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
>>>>>>> Houssam
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;