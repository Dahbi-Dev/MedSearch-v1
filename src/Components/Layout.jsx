// components/Layout.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import HeroSection from './Hero/HeroSection';
import DoctorsList from './Doctor-List/DoctorList';
import BlogsSection from './Blogs/BlogsSection';
import ContactForm from './Contact/ContactForm';
import Footer from './Footer/Footer';
import ScrollToTop from './Scroll/ScrollToTop';


const Layout = () => {
   const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dynamic doctor search states
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    city: '',
    specialty: ''
  });

 



  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Handle search results from HeroSection
  const handleSearchResults = (results, errorMessage, filters = {}) => {
    setDoctors(results);
    setDoctorsError(errorMessage || '');
    setDoctorsLoading(false);
    setHasSearched(true);
    setSearchFilters(filters);
  };

  // Handle loading state when search starts
  const handleSearchStart = () => {
    setDoctorsLoading(true);
    setDoctorsError('');
  };

 

  // Clear search results
  const clearSearch = () => {
    setDoctors([]);
    setDoctorsError('');
    setHasSearched(false);
    setSearchFilters({ search: '', city: '', specialty: '' });
  };



  return (
    <div className="min-h-screen bg-gray-50">

          <Navbar user={user} setUser={setUser} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <HeroSection
        onSearchResults={handleSearchResults}
        onSearchStart={handleSearchStart}
        onClearSearch={clearSearch}
        user={user}
      />

      {/* Only show DoctorsList if there has been a search or there are results */}
      {(hasSearched || doctors.length > 0) && (
        <DoctorsList 
          doctors={doctors}
          loading={doctorsLoading}
          error={doctorsError}
          searchFilters={searchFilters}
          onClearSearch={clearSearch}
          user={user}
        />
      )}

      {/* Show blogs section */}
      <BlogsSection
      
      />

      <ContactForm />

      <Footer />

      <ScrollToTop />
    </div>
  );
};

export default Layout;