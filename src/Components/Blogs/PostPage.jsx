import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import BlogService from '../../services/blogService';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [user, setUser] = useState(null);
  const [imageError, setImageError] = useState(false); // Track image loading errors
  const [imageLoading, setImageLoading] = useState(true); // Track image loading state

  // Check if user is logged in and get user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getBlogById(id);
        setBlog(data);
        setLikesCount(data.likes?.length || 0);
        
        // Check if current user has liked this blog
        if (user && data.likes) {
          setIsLiked(data.likes.some(like => like.user._id === user.id));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, user]);

  // Helper functions
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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

  const canEditDelete = () => {
    if (!user || !blog) return false;
    return user.id === blog.author._id || user.role === 'admin';
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If the image path is already a full URL, return as is
    if (imagePath.startsWith('https://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path, construct the full URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = API_BASE_URL.replace('/api', ''); // Remove /api from the end
    
    // Handle different path formats
    if (imagePath.startsWith('/')) {
      return `${baseUrl}${imagePath}`;
    } else {
      return `${baseUrl}/${imagePath}`;
    }
  };

  // Handle image load error
  const handleImageError = () => {
    console.error('Failed to load image:', blog.featuredImage);
    setImageError(true);
    setImageLoading(false);
  };

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle like/unlike
  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const result = await BlogService.likeBlog(id, token);
      setIsLiked(result.isLiked);
      setLikesCount(result.likes);
    } catch (err) {
      console.error('Error liking blog:', err);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const token = localStorage.getItem('token');
      const result = await BlogService.addComment(id, newComment, token);
      
      // Update blog state with new comment
      setBlog(prev => ({
        ...prev,
        comments: [...prev.comments, result.comment]
      }));
      
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await BlogService.deleteBlog(id, token);
      navigate('/');
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Error deleting blog post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blog</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  // Get the properly formatted image URL
  const featuredImageUrl = getImageUrl(blog.featuredImage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {featuredImageUrl && !imageError && (
            <div className="h-96 relative bg-gray-200">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
              <img 
                src={featuredImageUrl} 
                alt={blog.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
             
            </div>
          )}

          {/* Show error message if image fails to load */}
          {imageError && blog.featuredImage && (
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p>Failed to load image</p>
                <p className="text-xs mt-1">URL: {featuredImageUrl}</p>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Category and Edit/Delete buttons */}
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(blog.category)}`}>
                {blog.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              
              {canEditDelete() && (
                <div className="flex space-x-2">
                  <Link
                    to={`/blog/edit/${blog._id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {blog.author?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {blog.author?.name || 'Unknown Author'}
                    </span>
                    {blog.author?.role === 'doctor' && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        Doctor
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {blog.author?.specialty && (
                      <span>{blog.author.specialty} • </span>
                    )}
                    Published {formatDate(blog.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                {blog.views || 0} views
              </div>
              
              <button 
                onClick={handleLike}
                className={`flex items-center cursor-pointer ${isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition duration-200`}
              >
                <svg className="w-5 h-5 mr-2" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likesCount} likes
              </button>
              
              <a href="#comment"> 
                <div className="flex items-center text-gray-600 cursor-pointer">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                  </svg>
                  {blog.comments?.length || 0} comments
                </div>
              </a>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
                {blog.summary}
              </div>
              
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }}
              />
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-8" id="comment">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Comments ({blog.comments?.length || 0})
              </h3>

              {/* Add Comment Form */}
              {user ? (
                <div className="mb-8">
                  <div className="mb-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="4"
                    ></textarea>
                  </div>
                  <button
                    onClick={handleCommentSubmit}
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-gray-600 mb-2">Please log in to leave a comment</p>
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Log in here
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {blog.comments && blog.comments.length > 0 ? (
                  blog.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {comment.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {comment.user?.name || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default PostPage;