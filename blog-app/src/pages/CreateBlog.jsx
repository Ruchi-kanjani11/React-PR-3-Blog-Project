// pages/CreateBlog.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../services/api';

const CreateBlog = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newBlog = {
      ...formData,
      author: user.name,
      authorId: user.id,
      date: new Date().toISOString().split('T')[0],
      id: Date.now().toString()
    };
    
    try {
      await createBlog(newBlog);
      navigate('/');
    } catch (error) {
      setError('Failed to create blog');
    }
  };

  return (
    <div className="blog-form-container">
      <div className="container">
        <h2>Create New Blog</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="React">React</option>
              <option value="JavaScript">JavaScript</option>
              <option value="CSS">CSS</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="10"
            />
          </div>
          
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">Create Blog</button>
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;