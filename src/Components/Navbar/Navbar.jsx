/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useUser } from '../UserContext/UserContext';


const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const { user, setUser } = useUser();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  
  // API base URL - fallback to localhost if env var not set
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    <nav className="bg-white shadow-sm border-b ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                MedSearch
              </Link>
            </div>
          </div>
                   
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <Link
                    to="/blog/create"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Create Post
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isLoggingOut
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {user ? (
              <div className="space-y-2">
                <div className="text-gray-700 px-3 py-2">Welcome, {user.name}</div>
                <Link
                  to="/blog/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Create Post
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isLoggingOut
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
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
                  className="block w-full text-left bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
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