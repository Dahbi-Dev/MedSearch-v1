// components/DoctorList.js
import React from 'react';
import DoctorCard from './DoctorCard';
import { Users, Filter } from 'lucide-react';

const DoctorList = ({ doctors, loading, error, searchFilters }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No doctors found
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any doctors matching your search criteria.
          </p>
          {(searchFilters?.search || searchFilters?.city) && (
            <div className="text-sm text-gray-500">
              <p>Current filters:</p>
              <div className="flex justify-center gap-2 mt-2">
                {searchFilters.search && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Search: "{searchFilters.search}"
                  </span>
                )}
                {searchFilters.city && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    City: {searchFilters.city}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Available Doctors
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({doctors.length} found)
            </span>
          </h2>
          
          {/* Active Filters */}
          {(searchFilters?.search || searchFilters?.city) && (
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filtered results</span>
            </div>
          )}
        </div>

        {/* Filter Tags */}
        {(searchFilters?.search || searchFilters?.city) && (
          <div className="flex gap-2 mt-3">
            {searchFilters.search && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Search: "{searchFilters.search}"
              </span>
            )}
            {searchFilters.city && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                City: {searchFilters.city}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorList;