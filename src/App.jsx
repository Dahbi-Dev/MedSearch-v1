import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './Components/Layout';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import PostPage from './Components/Blogs/PostPage';
import CreatePost from './Components/CreateEditPost/CreatePost';
import EditPost from './Components/CreateEditPost/EditPost';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/blog/:id" element={<PostPage />} />
        {/* Create Post */}
        <Route path="/blog/create" element={<CreatePost />} />
        {/* Edit Post */}
        <Route path="/blog/edit/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
};

export default App;