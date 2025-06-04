// components/DoctorCard.js
import React, { useState } from 'react';
import { User, MapPin, Calendar, Star, Phone, Mail, CheckCircle, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Format rating display
  const renderRating = () => {
    const rating = doctor.rating || 0;
    const reviews = doctor.reviews || 0;
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(rating)
                  ? 'text-yellow-400 fill-current'
                  : i < rating
                  ? 'text-yellow-400 fill-current opacity-50'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
        {reviews > 0 && (
          <span className="text-xs text-gray-500">({reviews})</span>
        )}
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
              {doctor.profileImage ? (
                <img 
                  src={doctor.profileImage} 
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              )}
            </div>
            {doctor.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium text-sm sm:text-base">
                  {doctor.specialty}
                </p>
              </div>
              
              {/* Verification Badge */}
              {doctor.isVerified && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="mt-2">
              {renderRating()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{doctor.city || 'City not specified'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{doctor.experience || 0} years exp.</span>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`px-6 overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-96 pb-4' : 'max-h-0'
      }`}>
        <div className="border-t border-gray-100 pt-4 space-y-3">
          {/* Contact Info */}
          {(doctor.phone || doctor.email) && (
            <div className="space-y-2">
              {doctor.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <a 
                    href={`tel:${doctor.phone}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {doctor.phone}
                  </a>
                </div>
              )}
              {doctor.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <a 
                    href={`mailto:${doctor.email}`}
                    className="truncate hover:text-blue-600 transition-colors"
                  >
                    {doctor.email}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {doctor.bio && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">About</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {doctor.bio}
              </p>
            </div>
          )}

          {/* Address */}
          {doctor.address && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Address</h4>
              <p className="text-sm text-gray-600">
                {doctor.address}
              </p>
            </div>
          )}

          {/* Additional Info */}
          {doctor.availableHours && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span>Available: {doctor.availableHours}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expand/Collapse Button */}
      {(doctor.bio || doctor.address || doctor.phone || doctor.email) && (
        <div className="px-6 pb-4">
          <button 
            onClick={toggleExpansion}
            className="w-full flex items-center justify-center py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5">
            Book Appointment
          </button>
          <button className="flex-1 sm:flex-initial sm:px-6 py-3 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200 hover:shadow-md">
            View Profile
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
    </div>
  );
};

export default DoctorCard;