import React, { useState, useEffect } from 'react';
import { Menu, X, User, Mail, Lock, UserPlus, LogIn, Eye, EyeOff, Stethoscope, MapPin, Award } from 'lucide-react';

const Navbar = ({ user, setUser, mobileMenuOpen, setMobileMenuOpen }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    specialty: '',
    experience: '',
    city: ''
  });

  // API base URL - change this to your actual backend URL
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Check for existing token on mount
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      const userData = await apiCall('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(userData);
    } catch (error) {
      console.error('Profile fetch error:', error);
      handleLogout();
    }
  };

  const validateForm = (formData, isLogin = false) => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (formData.role === 'doctor') {
        if (!formData.specialty) {
          newErrors.specialty = 'Specialty is required for doctors';
        }
        if (!formData.experience || formData.experience < 0) {
          newErrors.experience = 'Valid experience is required for doctors';
        }
        if (!formData.city) {
          newErrors.city = 'City is required for doctors';
        }
      }
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');

    // Validate form
    const formErrors = validateForm(loginForm, true);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: loginForm
      });
      
      const { token: newToken, user: userData } = response;
      
      setToken(newToken);
      setUser(userData);
      setMessage('Login successful!');
      setShowAuthModal(false);
      
      // Clear form
      setLoginForm({ email: '', password: '' });
      
    } catch (error) {
      setErrors({ general: error.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');

    // Validate form
    const formErrors = validateForm(registerForm, false);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: registerForm
      });
      
      const { token: newToken, user: userData } = response;
      
      setToken(newToken);
      setUser(userData);
      setMessage('Registration successful!');
      setShowAuthModal(false);
      
      // Clear form
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
        specialty: '',
        experience: '',
        city: ''
      });
      
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentView('login');
    setMessage('');
    setErrors({});
    setShowAuthModal(false);
  };

  const clearErrors = () => {
    setErrors({});
    setMessage('');
  };

  const switchView = (view) => {
    setCurrentView(view);
    clearErrors();
  };

  const openAuthModal = (view) => {
    setCurrentView(view);
    setShowAuthModal(true);
    clearErrors();
    setMobileMenuOpen(false); // Close mobile menu when opening auth modal
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    clearErrors();
    setLoginForm({ email: '', password: '' });
    setRegisterForm({
      name: '',
      email: '',
      password: '',
      role: 'user',
      specialty: '',
      experience: '',
      city: ''
    });
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">FindDoc</h1>
              </div>
            </div>
                     
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Welcome, {user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
 
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="block w-full text-left bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="block w-full text-left bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity- flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header with tabs */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-bold">FindDoc Authentication</h2>
                <button
                  onClick={closeAuthModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center space-x-1 bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => switchView('login')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === 'login'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn className="w-4 h-4 inline mr-2" />
                  Login
                </button>
                <button
                  onClick={() => switchView('register')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === 'register'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form content */}
            <div className="p-6">
              {message && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                  {message}
                </div>
              )}

              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {currentView === 'login' ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Welcome Back</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Create Account</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={registerForm.role}
                      onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="user">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                  </div>

                  {registerForm.role === 'doctor' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                        <div className="relative">
                          <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={registerForm.specialty}
                            onChange={(e) => setRegisterForm({ ...registerForm, specialty: e.target.value })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.specialty ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., Cardiology, Dermatology"
                          />
                        </div>
                        {errors.specialty && <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                        <div className="relative">
                          <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={registerForm.experience}
                            onChange={(e) => setRegisterForm({ ...registerForm, experience: e.target.value })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.experience ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Years of experience"
                            min="0"
                          />
                        </div>
                        {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={registerForm.city}
                            onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.city ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Your city"
                          />
                        </div>
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              )}

              <div className="mt-4 text-center text-sm text-gray-600">
                {currentView === 'login' ? (
                  <p>Don't have an account? <button onClick={() => switchView('register')} className="text-blue-600 hover:underline">Sign up</button></p>
                ) : (
                  <p>Already have an account? <button onClick={() => switchView('login')} className="text-blue-600 hover:underline">Sign in</button></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;