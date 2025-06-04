
// App.js (Updated)
import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import AuthModal from './Components/AuthModal';
import HeroSection from './Components/HeroSection';
import DoctorsList from './Components/DoctorsList';
import BlogsSection from './Components/BlogsSection';
import ContactForm from './Components/ContactForm';
import Footer from './Components/Footer';

const App = () => {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState('');
  const [doctors] = useState([
    {
      _id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      city: 'New York',
      experience: 12,
      rating: 4.8,
      reviews: 156
    },
    {
      _id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      city: 'Los Angeles',
      experience: 8,
      rating: 4.9,
      reviews: 89
    },
    {
      _id: '3',
      name: 'Dr. Emily Davis',
      specialty: 'Pediatrics',
      city: 'Chicago',
      experience: 15,
      rating: 4.7,
      reviews: 203
    },
    {
      _id: '4',
      name: 'Dr. Robert Wilson',
      specialty: 'Orthopedics',
      city: 'Houston',
      experience: 20,
      rating: 4.9,
      reviews: 167
    }
  ]);
  const [blogs] = useState([
    {
      _id: '1',
      title: 'Understanding Heart Health in Your 40s',
      excerpt: 'Learn about the key factors that affect cardiovascular health as you age and what you can do to maintain a healthy heart.',
      author: 'Dr. Sarah Johnson',
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      title: 'Skin Care Tips for Every Season',
      excerpt: 'Discover how to adapt your skincare routine throughout the year to maintain healthy, glowing skin.',
      author: 'Dr. Michael Chen',
      createdAt: '2024-01-10'
    },
    {
      _id: '3',
      title: 'Child Development Milestones',
      excerpt: 'A comprehensive guide to understanding your child\'s growth and development stages from infancy to adolescence.',
      author: 'Dr. Emily Davis',
      createdAt: '2024-01-05'
    },
    {
      _id: '4',
      title: 'Preventing Sports Injuries',
      excerpt: 'Essential tips for athletes and fitness enthusiasts to prevent common sports-related injuries.',
      author: 'Dr. Robert Wilson',
      createdAt: '2024-01-01'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth forms state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'user' 
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: loginForm.email.split('@')[0], email: loginForm.email });
    setShowAuth('');
    setLoginForm({ email: '', password: '' });
    alert('Successfully logged in!');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setUser({ name: registerForm.name, email: registerForm.email });
    setShowAuth('');
    setRegisterForm({ name: '', email: '', password: '', role: 'user' });
    alert('Successfully registered!');
  };

  const handleLogout = () => {
    setUser(null);
    alert('Successfully logged out!');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setContactForm({ name: '', email: '', message: '' });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || doctor.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const cities = [...new Set(doctors.map(doctor => doctor.city))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <AuthModal
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />

      <HeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cities={cities}
      />

      <DoctorsList doctors={filteredDoctors} />

      <BlogsSection
        blogs={blogs}
        showAllBlogs={showAllBlogs}
        setShowAllBlogs={setShowAllBlogs}
      />

      <ContactForm
        contactForm={contactForm}
        setContactForm={setContactForm}
        handleContactSubmit={handleContactSubmit}
      />

      <Footer />
    </div>
  );
};

export default App;