/* eslint-disable react-hooks/exhaustive-deps */
// components/HeroSection.js
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Search, MapPin, Stethoscope, Calendar, Award, Heart, Shield, Star } from 'lucide-react';
=======
import { Search, MapPin, Stethoscope, Calendar, Award } from 'lucide-react';
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752

const HeroSection = ({ onSearchResults, onSearchStart, onClearSearch, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


=======
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752

  // Fetch cities from doctors in database
  useEffect(() => {
    fetchCities();
    // Initial load - fetch all doctors
    handleSearch('', '');
  }, []);

  const fetchCities = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch(`${API_BASE_URL}/doctors`);
=======
      const response = await fetch('http://localhost:5000/api/doctors');
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
      if (response.ok) {
        const doctors = await response.json();
        const uniqueCities = [...new Set(doctors.map(doctor => doctor.city))].filter(Boolean);
        setCities(uniqueCities.sort());
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleSearch = async (search = searchTerm, city = selectedCity) => {
    try {
      setLoading(true);
      if (onSearchStart) onSearchStart();
      
      const params = new URLSearchParams();
      if (search.trim()) {
        params.append('search', search.trim());
      }
      if (city) {
        params.append('city', city);
      }

<<<<<<< HEAD
      const response = await fetch(`${API_BASE_URL}/doctors?${params.toString()}`);
=======
      const response = await fetch(`http://localhost:5000/api/doctors?${params.toString()}`);
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
      if (response.ok) {
        const doctors = await response.json();
        onSearchResults(doctors, null, { search: search.trim(), city });
      } else {
        const errorData = await response.json();
        onSearchResults([], errorData.message || 'Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([], 'Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedCity]);

<<<<<<< HEAD
  // eslint-disable-next-line no-unused-vars
=======
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCity('');
    onClearSearch();
  };

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating medical icons with animation */}
        <div className="absolute top-20 left-10 opacity-10 animate-pulse">
          <Heart className="w-16 h-16 text-blue-300" />
        </div>
        <div className="absolute top-40 right-20 opacity-15 animate-bounce" style={{ animationDelay: '1s' }}>
          <Stethoscope className="w-12 h-12 text-teal-300" />
        </div>
        <div className="absolute bottom-40 left-1/4 opacity-20 animate-pulse" style={{ animationDelay: '2s' }}>
          <Shield className="w-10 h-10 text-green-300" />
        </div>
        <div className="absolute bottom-20 right-1/3 opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Star className="w-8 h-8 text-yellow-300" />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Welcome message for logged-in users */}
          {user && (
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <p className="text-blue-100 text-lg">
                  Welcome back, <span className="font-bold text-white bg-gradient-to-r from-blue-200 to-teal-200 bg-clip-text text-transparent">{user.name}</span>!
                </p>
              </div>
            </div>
          )}

          {/* Main heading with enhanced typography */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-teal-200 bg-clip-text text-transparent">
                Find Your Perfect
              </span>
              <span className="block bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent text-4xl md:text-6xl font-bold mt-2">
                Healthcare Partner
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-100/90 max-w-4xl mx-auto leading-relaxed">
              Experience personalized healthcare with our network of certified professionals. 
              <span className="block mt-2 text-lg text-blue-200/80">
                Your health journey starts with the right connection.
              </span>
            </p>
          </div>

          {/* Enhanced Stats section with glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">500+</div>
              <div className="text-blue-200 font-medium">Verified Specialists</div>
              <div className="text-blue-300/70 text-sm mt-1">Across all medical fields</div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">24/7</div>
              <div className="text-teal-200 font-medium">Instant Booking</div>
              <div className="text-teal-300/70 text-sm mt-1">Available round the clock</div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">98%</div>
              <div className="text-green-200 font-medium">Satisfaction Rate</div>
              <div className="text-green-300/70 text-sm mt-1">Patient-verified reviews</div>
            </div>
          </div>

          {/* Revolutionary Search Form */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-500">
              <div className="text-center mb-8">
                <h3 className="text-white text-2xl font-bold mb-2">
                  Begin Your Health Journey
                </h3>
                <p className="text-blue-200/80">Discover the perfect healthcare professional for your needs</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                {/* Enhanced Search Input */}
                <div className="lg:col-span-5 relative group">
                  <label className="block text-blue-200 text-sm font-medium mb-2 text-left">
                    Search Doctors & Specialties
                  </label>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="e.g., Cardiologist, Dr. Smith..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white text-gray-900 text-lg placeholder-gray-500 transition-all duration-300 hover:bg-white/95"
                    />
                  </div>
                </div>

                {/* Enhanced City Selector */}
                <div className="lg:col-span-4 relative group">
                  <label className="block text-blue-200 text-sm font-medium mb-2 text-left">
                    Select Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-blue-500 transition-colors" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white text-gray-900 text-lg transition-all duration-300 hover:bg-white/95 appearance-none cursor-pointer"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-3 flex gap-3">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 hover:from-blue-700 hover:via-teal-600 hover:to-green-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-5 px-8 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:cursor-not-allowed disabled:scale-100 text-lg transform active:scale-95"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-white mr-3"></div>
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Search className="h-5 w-5 mr-2" />
                        Find Doctors
                      </div>
                    )}
                  </button>
                  
                  {/* Enhanced Clear Button */}
=======
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Welcome message for logged-in users */}
          {user && (
            <div className="mb-6">
              <p className="text-blue-100 text-lg">
                Welcome back, <span className="font-semibold text-white">{user.name}</span>!
              </p>
            </div>
          )}

          {/* Main heading */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Find the Right Doctor
              <span className="block text-blue-200 text-3xl md:text-4xl font-normal mt-2">
                for Your Health Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100 max-w-3xl mx-auto">
              Connect with qualified healthcare professionals in your area and take control of your health
            </p>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Stethoscope className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold mb-1">500+</div>
              <div className="text-blue-200 text-sm">Qualified Doctors</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-blue-200 text-sm">Available Booking</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Award className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold mb-1">98%</div>
              <div className="text-blue-200 text-sm">Patient Satisfaction</div>
            </div>
          </div>

          {/* Enhanced Search Form */}
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <h3 className="text-gray-800 text-lg font-semibold mb-6 text-center">
                Start Your Search
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search doctors, specialties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg transition-all"
                  />
                </div>

                {/* City Selector */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg transition-all appearance-none"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex gap-3">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 hover:from-blue-700 hover:via-teal-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Searching...
                      </div>
                    ) : (
                      'Search Doctors'
                    )}
                  </button>
                  
                  {/* Clear Button */}
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
                  {(searchTerm || selectedCity) && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
<<<<<<< HEAD
                      className="px-6 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-semibold hover:scale-105 transform active:scale-95"
=======
                      className="px-4 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

<<<<<<< HEAD
              {/* Enhanced Quick Search Tags */}
              <div className="mt-10 pt-8 border-t border-white/20">
                <p className="text-blue-200 text-base mb-5 font-medium">Trending Specialties:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { name: 'Cardiology', gradient: 'from-red-500 to-pink-500' },
                    { name: 'Dermatology', gradient: 'from-purple-500 to-indigo-500' },
                    { name: 'Pediatrics', gradient: 'from-blue-500 to-cyan-500' },
                    { name: 'Dentistry', gradient: 'from-teal-500 to-green-500' },
                    { name: 'Neurology', gradient: 'from-orange-500 to-yellow-500' }
                  ].map((specialty) => (
                    <button
                      key={specialty.name}
                      type="button"
                      onClick={() => setSearchTerm(specialty.name)}
                      className={`group relative bg-gradient-to-r ${specialty.gradient} bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 transform active:scale-95 shadow-lg hover:shadow-xl`}
                    >
                      <span className="relative z-10">{specialty.name}</span>
                      <div className={`absolute inset-0 bg-gradient-to-r ${specialty.gradient} opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300`}></div>
=======
              {/* Quick Search Tags */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-3 text-center">Popular Searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Cardiology', 'Dermatology', 'Pediatrics', 'Dentistry', 'Neurology'].map((specialty) => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => setSearchTerm(specialty)}
                      className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-blue-300"
                    >
                      {specialty}
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
                    </button>
                  ))}
                </div>
              </div>
            </div>
<<<<<<< HEAD
          </div>

          {/* Enhanced Loading indicator */}
          {loading && (
            <div className="mt-12 animate-fade-in">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-xl rounded-full px-8 py-4 text-blue-100 border border-white/30 shadow-2xl">
                <div className="relative mr-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/30 border-t-white"></div>
                  <div className="animate-ping absolute inset-0 rounded-full border-2 border-blue-300 opacity-20"></div>
                </div>
                <span className="font-semibold text-lg">Discovering perfect matches for you...</span>
=======
          </form>

          {/* Loading indicator */}
          {loading && (
            <div className="mt-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-blue-100 border border-white/20">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span className="font-medium">Finding the best doctors for you...</span>
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
              </div>
            </div>
          )}
        </div>
      </div>
<<<<<<< HEAD

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
=======
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
    </div>
  );
};

export default HeroSection;