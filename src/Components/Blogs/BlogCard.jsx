// components/BlogCard.js
import React from 'react';
import { Link } from 'react-router'; // Assuming you're using React Router

const BlogCard = ({ blog }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      'health-tips': 'bg-green-100 text-green-800',
      'medical-advice': 'bg-blue-100 text-blue-800',
      'nutrition': 'bg-orange-100 text-orange-800',
      'fitness': 'bg-purple-100 text-purple-800',
      'mental-health': 'bg-pink-100 text-pink-800',
      'diseases': 'bg-red-100 text-red-800',
      'treatments': 'bg-indigo-100 text-indigo-800',
      'lifestyle': 'bg-yellow-100 text-yellow-800',
      'research': 'bg-gray-100 text-gray-800',
      'general': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
      {/* Featured Image */}
      <div className="h-48 relative">
        {blog.featuredImage ? (
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 ${blog.featuredImage ? 'hidden' : ''}`}
        ></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(blog.category)}`}>
            {blog.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {blog.title}
        </h3>
        
        {/* Summary/Excerpt */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {truncateText(blog.summary)}
        </p>
        
        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <span>By {blog.author?.name || 'Unknown Author'}</span>
            {blog.author?.role === 'doctor' && (
              <span className="ml-2 text-blue-600 text-xs font-medium">
                Dr.
              </span>
            )}
          </div>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {blog.views || 0}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              {blog.likes?.length || 0}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
              {blog.comments?.length || 0}
            </span>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <Link 
          to={`/blog/${blog._id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200"
        >
          Read More 
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;