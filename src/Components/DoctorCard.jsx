
// components/DoctorCard.js
import React from 'react';
import { User, MapPin, Calendar, Star } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-gray-600">{doctor.specialty}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {doctor.city}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {doctor.experience} years experience
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 mr-2 text-yellow-500" />
          {doctor.rating}/5 ({doctor.reviews} reviews)
        </div>
      </div>
      <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition duration-200">
        Book Appointment
      </button>
    </div>
  );
};

export default DoctorCard;
