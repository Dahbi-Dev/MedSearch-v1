// components/BlogsSection.js
import React, { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import BlogService from '../../services/blogService';

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [pagination, setPagination] = useState(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getBlogs({ limit: 6 });
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Health Articles</h2>
            <p className="text-xl text-gray-600">Stay informed with the latest health tips and medical insights</p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Health Articles</h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error loading articles: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No blogs found
  if (blogs.length === 0) {
    return (
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Health Articles</h2>
            <p className="text-xl text-gray-600">No articles available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  const displayedBlogs = showAllBlogs ? blogs : blogs.slice(0, 3);

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Health Articles</h2>
          <p className="text-xl text-gray-600">Stay informed with the latest health tips and medical insights</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedBlogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
        
        {blogs.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllBlogs(!showAllBlogs)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-md font-semibold transition duration-200"
            >
              {showAllBlogs ? 'Show Less' : 'Show More Articles'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsSection;