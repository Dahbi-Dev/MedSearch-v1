/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [originalBlog, setOriginalBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft',
    featuredImage: null
  });

  const categories = [
    { value: 'health-tips', label: 'Health Tips' },
    { value: 'medical-advice', label: 'Medical Advice' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'diseases', label: 'Diseases' },
    { value: 'treatments', label: 'Treatments' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'research', label: 'Research' },
    { value: 'general', label: 'General' }
  ];

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const blog = await response.json();
          
          // Check if user can edit this blog (author or admin)
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const isAuthor = blog.author._id === currentUser.id;
          const isAdmin = currentUser.role === 'admin';
          
          if (!isAuthor && !isAdmin) {
            navigate('/');
            return;
          }

          setOriginalBlog(blog);
          
          // Populate form with existing data
          setFormData({
            title: blog.title,
            summary: blog.summary,
            content: blog.content,
            category: blog.category,
            tags: blog.tags ? blog.tags.join(', ') : '',
            status: blog.status,
            featuredImage: null // New image file (not the existing URL)
          });

          // Set existing image preview
          if (blog.featuredImage) {
            setImagePreview(blog.featuredImage);
          }
        } else {
          const data = await response.json();
          if (response.status === 404) {
            setErrors({ general: 'Blog post not found' });
          } else if (response.status === 403) {
            navigate('/');
          } else {
            setErrors({ general: data.message || 'Failed to load blog post' });
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setErrors({ general: 'Network error. Please try again.' });
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          featuredImage: 'Image size must be less than 5MB'
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          featuredImage: 'Please select a valid image file'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        featuredImage: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.featuredImage) {
        setErrors(prev => ({
          ...prev,
          featuredImage: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: null
    }));
    
    // If there was an original image, show it again
    if (originalBlog?.featuredImage) {
      setImagePreview(originalBlog.featuredImage);
    } else {
      setImagePreview(null);
    }
    
    // Reset file input
    document.getElementById('featuredImage').value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5 || formData.title.length > 200) {
      newErrors.title = 'Title must be between 5 and 200 characters';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    } else if (formData.summary.length < 10 || formData.summary.length > 500) {
      newErrors.summary = 'Summary must be between 10 and 500 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Validate tags format
    if (formData.tags.trim()) {
      try {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        if (tagsArray.length === 0) {
          newErrors.tags = 'Please enter at least one valid tag';
        }
      } catch (error) {
        newErrors.tags = 'Invalid tags format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('summary', formData.summary.trim());
      submitData.append('content', formData.content.trim());
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);

      // Process tags
      if (formData.tags.trim()) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        submitData.append('tags', JSON.stringify(tagsArray));
      } else {
        submitData.append('tags', JSON.stringify([]));
      }

      // Add image if a new one was selected
      if (formData.featuredImage) {
        submitData.append('featuredImage', formData.featuredImage);
      }

      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to blog detail page
        navigate('/');
      } else {
        if (data.errors) {
          // Handle validation errors from server
          const serverErrors = {};
          data.errors.forEach(error => {
            serverErrors[error.path || error.param] = error.msg;
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: data.message || 'Failed to update blog post' });
        }
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 text-lg">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error if failed to load
  if (errors.general && !originalBlog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Blog Post</h2>
            <p className="text-gray-600 mb-6">{errors.general}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
            <p className="text-blue-100 mt-2">Update your content and share your knowledge</p>
            {originalBlog && !originalBlog.isApproved && (
              <div className="mt-3 bg-yellow-500 bg-opacity-20 border border-yellow-400 rounded-lg p-3">
                <p className="text-yellow-100 text-sm">
                  ⚠️ This post is pending approval. Editing will reset the approval status.
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter an engaging title for your blog post"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              <p className="text-gray-500 text-xs mt-1">{formData.title.length}/200 characters</p>
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 mb-2">
                Summary *
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.summary ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Write a brief summary of your blog post"
              />
              {errors.summary && <p className="text-red-600 text-sm mt-1">{errors.summary}</p>}
              <p className="text-gray-500 text-xs mt-1">{formData.summary.length}/500 characters</p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={12}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.content ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Write your blog content here... (minimum 50 characters)"
              />
              {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
              <p className="text-gray-500 text-xs mt-1">{formData.content.length} characters (minimum 50)</p>
            </div>

            {/* Category and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.tags ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter tags separated by commas (e.g., health, nutrition, fitness)"
              />
              {errors.tags && <p className="text-red-600 text-sm mt-1">{errors.tags}</p>}
              <p className="text-gray-500 text-xs mt-1">Separate multiple tags with commas</p>
            </div>

            {/* Featured Image */}
            <div>
              <label htmlFor="featuredImage" className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <div className="space-y-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <label htmlFor="featuredImage" className="cursor-pointer">
                        <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                          Choose New Image
                        </span>
                        <input
                          id="featuredImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <label htmlFor="featuredImage" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        id="featuredImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {formData.featuredImage && (
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      New image selected
                    </div>
                  )}
                </div>
              )}
              
              {errors.featuredImage && <p className="text-red-600 text-sm mt-1">{errors.featuredImage}</p>}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Post...
                  </div>
                ) : (
                  'Update Post'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/blog/${id}`)}
                className="flex-1 sm:flex-none border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditPost;