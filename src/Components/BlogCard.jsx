// components/BlogCard.js
import React from 'react';

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
      <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
        <p className="text-gray-600 mb-4">{blog.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>By {blog.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
          Read More →
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
