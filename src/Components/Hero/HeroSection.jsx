/* eslint-disable react-hooks/exhaustive-deps */
// components/HeroSection.js
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Stethoscope, Calendar, Award } from 'lucide-react';

const HeroSection = ({ onSearchResults, onSearchStart, onClearSearch, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cities from doctors in database
  useEffect(() => {
    fetchCities();
    // Initial load - fetch all doctors
    handleSearch('', '');
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors');
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

      const response = await fetch(`http://localhost:5000/api/doctors?${params.toString()}`);
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
                  {(searchTerm || selectedCity) && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="px-4 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

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
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Loading indicator */}
          {loading && (
            <div className="mt-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-blue-100 border border-white/20">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span className="font-medium">Finding the best doctors for you...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;