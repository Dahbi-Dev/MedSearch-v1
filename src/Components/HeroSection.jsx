// components/HeroSection.js
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

const HeroSection = ({ onSearchResults, onSearchStart }) => {
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
        // Extract unique cities from doctors
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
      if (onSearchStart) onSearchStart(); // Notify parent that search is starting
      
      // Build query parameters
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
        onSearchResults(doctors, null);
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

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find the Right Doctor
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with qualified healthcare professionals in your area
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search doctors, specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-6 rounded-md font-semibold transition duration-200"
              >
                {loading ? 'Searching...' : 'Search Doctors'}
              </button>
            </div>
          </form>

          {/* Loading indicator */}
          {loading && (
            <div className="mt-4">
              <div className="inline-flex items-center text-blue-100">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching for doctors...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;