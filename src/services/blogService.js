// services/blogService.js
const API_BASE_URL =  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class BlogService {
  // Get all blogs with optional filters
  static async getBlogs(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add parameters if they exist
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.author) queryParams.append('author', params.author);
      
      const url = `${API_BASE_URL}/blogs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get single blog by ID
  static async getBlogById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  // Like a blog (requires authentication)
  static async likeBlog(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error liking blog:', error);
      throw error;
    }
  }

  // Add comment to blog (requires authentication)
  static async addComment(id, content, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Create new blog (requires authentication and doctor/admin role)
  static async createBlog(blogData, token) {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('summary', blogData.summary);
      formData.append('category', blogData.category);
      formData.append('status', blogData.status || 'draft');
      
      // Add tags as JSON string
      if (blogData.tags) {
        formData.append('tags', JSON.stringify(blogData.tags));
      }
      
      // Add featured image if exists
      if (blogData.featuredImage) {
        formData.append('featuredImage', blogData.featuredImage);
      }

      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update blog (requires authentication and ownership/admin)
  static async updateBlog(id, blogData, token) {
    try {
      const formData = new FormData();
      
      // Add only the fields that are being updated
      Object.keys(blogData).forEach(key => {
        if (key === 'tags' && blogData[key]) {
          formData.append(key, JSON.stringify(blogData[key]));
        } else if (key !== 'featuredImage' && blogData[key] !== undefined) {
          formData.append(key, blogData[key]);
        }
      });
      
      // Add featured image if exists
      if (blogData.featuredImage instanceof File) {
        formData.append('featuredImage', blogData.featuredImage);
      }

      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete blog (requires authentication and ownership/admin)
  static async deleteBlog(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Get user's own blogs (requires authentication)
  static async getMyBlogs(params = {}, token) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      
      const url = `${API_BASE_URL}/blogs/my/blogs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching my blogs:', error);
      throw error;
    }
  }
}

export default BlogService;