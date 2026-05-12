import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../services/api';
import Loader from '../components/Loader';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await getBlogById(id);
      setFormData(response.data);
    } catch (error) {
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBlog(id, formData);
      navigate(`/blog/${id}`);
    } catch (error) {
      setError('Failed to update blog');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="blog-form-container">
      <div className="container">
        <h2>Edit Blog</h2>
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
            />
          </div>
          </form>
          </div>
          </div>
          
)}

export default EditBlog;