// pages/BlogDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogById, deleteBlog } from '../services/api';
import Loader from '../components/Loader';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await getBlogById(id);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const isAuthor = user && (user.id === blog?.authorId || user.role === 'admin');

  if (loading) return <Loader />;
  if (!blog) return <div className="container">Blog not found</div>;

  return (
    <div className="blog-details">
      <div className="container">
        <div className="blog-header">
          <img src={blog.imageUrl || 'https://picsum.photos/1200/400'} alt={blog.title} />
          <h1>{blog.title}</h1>
          <div className="blog-info">
            <span>✍️ {blog.author}</span>
            <span>📅 {new Date(blog.date).toLocaleDateString()}</span>
            <span>🏷️ {blog.category}</span>
          </div>
        </div>
        <div className="blog-body">
          <p>{blog.content || blog.description}</p>
        </div>
        {isAuthor && (
          <div className="blog-actions">
            <Link to={`/edit/${blog.id}`} className="btn-edit">Edit Blog</Link>
            <button onClick={handleDelete} className="btn-delete">Delete Blog</button>
          </div>
        )}
        <Link to="/" className="btn-back">← Back to Home</Link>
      </div>
    </div>
  );
};

export default BlogDetails;