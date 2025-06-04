// App.js (Enhanced with Dynamic Doctor Search and State Management)
import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import HeroSection from './Components/HeroSection';
import DoctorsList from './Components/DoctorList';
import BlogsSection from './Components/BlogsSection';
import ContactForm from './Components/ContactForm';
import Footer from './Components/Footer';

const App = () => {
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

  // Static blogs data (keep as is for now)
  const [blogs] = useState([
    {
      _id: '1',
      title: 'Understanding Heart Health in Your 40s',
      excerpt: 'Learn about the key factors that affect cardiovascular health as you age and what you can do to maintain a healthy heart.',
      author: 'Dr. Sarah Johnson',
      createdAt: '2024-01-15',
      category: 'Cardiology',
      readTime: '5 min read'
    },
    {
      _id: '2',
      title: 'Skin Care Tips for Every Season',
      excerpt: 'Discover how to adapt your skincare routine throughout the year to maintain healthy, glowing skin.',
      author: 'Dr. Michael Chen',
      createdAt: '2024-01-10',
      category: 'Dermatology',
      readTime: '7 min read'
    },
    {
      _id: '3',
      title: 'Child Development Milestones',
      excerpt: 'A comprehensive guide to understanding your child\'s growth and development stages from infancy to adolescence.',
      author: 'Dr. Emily Davis',
      createdAt: '2024-01-05',
      category: 'Pediatrics',
      readTime: '10 min read'
    },
    {
      _id: '4',
      title: 'Preventing Sports Injuries',
      excerpt: 'Essential tips for athletes and fitness enthusiasts to prevent common sports-related injuries.',
      author: 'Dr. Robert Wilson',
      createdAt: '2024-01-01',
      category: 'Sports Medicine',
      readTime: '6 min read'
    },
    {
      _id: '5',
      title: 'Mental Health in the Digital Age',
      excerpt: 'Understanding the impact of technology on mental health and strategies for maintaining digital wellness.',
      author: 'Dr. Lisa Thompson',
      createdAt: '2023-12-28',
      category: 'Psychology',
      readTime: '8 min read'
    },
    {
      _id: '6',
      title: 'Nutrition Myths Debunked',
      excerpt: 'Separating fact from fiction in the world of nutrition and healthy eating.',
      author: 'Dr. James Martinez',
      createdAt: '2023-12-25',
      category: 'Nutrition',
      readTime: '9 min read'
    }
  ]);
  
  const [showAllBlogs, setShowAllBlogs] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

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
    setContactSuccess(false); // Reset contact success when starting new search
  };

  // Enhanced contact form submission with API call
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setContactLoading(false);
    }
  };

  // Clear search results
  const clearSearch = () => {
    setDoctors([]);
    setDoctorsError('');
    setHasSearched(false);
    setSearchFilters({ search: '', city: '', specialty: '' });
  };

  // Handle user authentication
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove auth token if exists
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        setUser={setUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

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

      {/* Show blogs section only if not actively showing doctor search results */}
    
        <BlogsSection
          blogs={blogs}
          showAllBlogs={showAllBlogs}
          setShowAllBlogs={setShowAllBlogs}
        />
 

      <ContactForm
        contactForm={contactForm}
        setContactForm={setContactForm}
        handleContactSubmit={handleContactSubmit}
        loading={contactLoading}
        success={contactSuccess}
      />

      <Footer />

      {/* Back to top button */}
      <BackToTopButton />
    </div>
  );
};

// Back to top button component
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLineJoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
};

export default App;