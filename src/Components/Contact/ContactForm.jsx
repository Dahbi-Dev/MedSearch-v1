/* eslint-disable no-unused-vars */
// components/ContactForm.js
import React, { useState } from 'react';
import { useUser } from '../UserContext/UserContext';	

const ContactForm = () => {
  const { user } = useUser();
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors([]);
    setSuccess(false);

    // Get token from localStorage since it's stored separately
    const token = localStorage.getItem('token');
    
    if (!token || !user) {
      setError('You must be logged in to send a message');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactForm)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setValidationErrors(data.errors);
        } else {
          setError(data.message || 'Failed to send message');
        }
        return;
      }

      setSuccess(true);
      // Reset only the message field, keep name and email from user data
      setContactForm({
        name: user?.name || '',
        email: user?.email || '',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Contact form error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt if user is not authenticated
  if (!user || !localStorage.getItem('token')) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
              Have questions? We'd love to hear from you. Please log in to send us a message.
            </p>
            <div className="bg-white shadow-lg rounded-xl p-10">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentication Required</h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to send us a message. This helps us provide better support and keep track of your inquiries.
              </p>
              <div className="space-y-3">
                <a 
                  href="/login" 
                  className="block w-full bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 hover:from-blue-700 hover:via-teal-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                  Log In
                </a>
                <a 
                  href="/register" 
                  className="block w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <form 
          onSubmit={handleContactSubmit} 
          className="bg-white shadow-lg rounded-xl p-10 space-y-8"
          noValidate
        >
          {/* Error Messages */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold">Please fix the following errors:</span>
                  <ul className="mt-1 list-disc list-inside">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error.msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-3 focus:ring-blue-600 focus:border-blue-600 transition"
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-3 focus:ring-blue-600 focus:border-blue-600 transition"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-3 focus:ring-blue-600 focus:border-blue-600 transition resize-none"
              placeholder="Write your message here..."
              required
              disabled={loading}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full 
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 hover:from-blue-700 hover:via-teal-600 hover:to-green-700'
              }
              text-white font-semibold py-4 rounded-lg shadow-md
              transition duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-teal-400
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Message'
            )}
          </button>

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Message sent successfully!</span>
              </div>
              <p className="text-sm mt-1">We'll get back to you as soon as possible.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;