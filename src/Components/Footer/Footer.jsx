// components/Footer.js
import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">FindDoc</h3>
            <p className="text-gray-300">
              Your trusted platform for finding qualified healthcare professionals.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Find Doctors</a></li>
              <li><a href="#" className="hover:text-white">Health Articles</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Specialties</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Cardiology</a></li>
              <li><a href="#" className="hover:text-white">Dermatology</a></li>
              <li><a href="#" className="hover:text-white">Pediatrics</a></li>
              <li><a href="#" className="hover:text-white">Orthopedics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@finddoc.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 FindDoc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;