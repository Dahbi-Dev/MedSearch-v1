
// components/BlogsSection.js
import React from 'react';
import BlogCard from './BlogCard';

const BlogsSection = ({ blogs, showAllBlogs, setShowAllBlogs }) => {
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
