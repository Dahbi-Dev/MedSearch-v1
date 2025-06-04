// components/DoctorList.js
import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import { Users, Filter, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

const DoctorList = ({ doctors, loading, error, searchFilters, onClearSearch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 3;

  // Reset to first page when doctors change
  useEffect(() => {
    setCurrentPage(1);
  }, [doctors]);

  // Calculate pagination
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const endIndex = startIndex + doctorsPerPage;
  const currentDoctors = doctors.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    // Smooth scroll to top of results
    document.getElementById('doctors-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding the best doctors for you</h3>
              <p className="text-gray-600">Please wait while we search our database...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <X className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Search Error</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={onClearSearch}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (doctors.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No doctors found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any doctors matching your search criteria. Try adjusting your filters or search terms.
              </p>
              
              {/* Active Filters Display */}
              {(searchFilters?.search || searchFilters?.city) && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">Current search filters:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {searchFilters.search && (
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                        <Search className="h-3 w-3 inline mr-1" />
                        "{searchFilters.search}"
                      </span>
                    )}
                    {searchFilters.city && (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        📍 {searchFilters.city}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <button 
                onClick={onClearSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters & Show All Doctors
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="doctors-section" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Available Doctors
                </h2>
                <p className="text-lg text-gray-600 mt-1">
                  {doctors.length} qualified healthcare professionals found
                </p>
              </div>
            </div>

            {/* Active Filters */}
            {(searchFilters?.search || searchFilters?.city) && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center mb-3">
                  <Filter className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Active Filters</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {searchFilters.search && (
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                      <Search className="h-3 w-3 inline mr-1" />
                      "{searchFilters.search}"
                    </span>
                  )}
                  {searchFilters.city && (
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                      📍 {searchFilters.city}
                    </span>
                  )}
                  <button
                    onClick={onClearSearch}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-200"
                  >
                    <X className="h-3 w-3 inline mr-1" />
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {currentDoctors.map((doctor, index) => (
            <div 
              key={doctor._id} 
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>

        {/* Enhanced Pagination */}
       {totalPages > 1 && (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Previous Button */}
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 hover:from-blue-700 hover:via-teal-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
        }`}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={nextPage}
        disabled={currentPage === totalPages}
        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 hover:from-blue-700 hover:via-teal-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
        }`}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </button>
    </div>

   
  </div>
)}

      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default DoctorList;