// components/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog, onDelete }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthor = user && (user.id === blog.authorId || user.role === 'admin');

  return (
    <div className="blog-card">
      <img src={blog.imageUrl || 'https://picsum.photos/400/200'} alt={blog.title} className="blog-image" />
      <div className="blog-content">
        <span className="blog-category">{blog.category}</span>
        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-description">{blog.description}</p>
        <div className="blog-meta">
          <span>✍️ {blog.author}</span>
          <span>📅 {new Date(blog.date).toLocaleDateString()}</span>
        </div>
        <div className="blog-actions">
          <Link to={`/blog/${blog.id}`} className="btn-read">Read More</Link>
          {isAuthor && (
            <>
              <Link to={`/edit/${blog.id}`} className="btn-edit">Edit</Link>
              <button onClick={() => onDelete(blog.id)} className="btn-delete">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;