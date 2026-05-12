// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, deleteBlog } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    userBlogs: 0,
    categories: []
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await getBlogs();
      const allBlogs = response.data;
      setBlogs(allBlogs);
      
      // Filter blogs for current user
      const usersBlogs = allBlogs.filter(blog => blog.authorId === user?.id);
      setUserBlogs(usersBlogs);
      
      // Calculate statistics
      const categories = [...new Set(allBlogs.map(blog => blog.category))];
      setStats({
        totalBlogs: allBlogs.length,
        userBlogs: usersBlogs.length,
        categories: categories
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      try {
        await deleteBlog(id);
        // Refresh the blogs list
        await fetchData();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's what's happening with your blogs</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{stats.totalBlogs}</h3>
              <p>Total Blogs</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✍️</div>
            <div className="stat-info">
              <h3>{stats.userBlogs}</h3>
              <p>Your Blogs</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-info">
              <h3>{stats.categories.length}</h3>
              <p>Categories</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{user?.role === 'admin' ? 'Admin' : 'Author'}</h3>
              <p>Your Role</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/create" className="action-btn create-btn">
              ✏️ Create New Blog
            </Link>
            <Link to="/" className="action-btn view-btn">
              👁️ View All Blogs
            </Link>
          </div>
        </div>

        {/* Your Blogs Section */}
        <div className="user-blogs-section">
          <h2>Your Blogs ({userBlogs.length})</h2>
          
          {userBlogs.length === 0 ? (
            <div className="no-blogs">
              <p>You haven't created any blogs yet.</p>
              <Link to="/create" className="btn-primary">Create Your First Blog</Link>
            </div>
          ) : (
            <div className="user-blogs-list">
              {userBlogs.map(blog => (
                <div key={blog.id} className="dashboard-blog-card">
                  <div className="blog-info">
                    <h3>{blog.title}</h3>
                    <div className="blog-meta">
                      <span>📅 {new Date(blog.date).toLocaleDateString()}</span>
                      <span>🏷️ {blog.category}</span>
                    </div>
                    <p>{blog.description.substring(0, 150)}...</p>
                  </div>
                  <div className="blog-actions">
                    <Link to={`/blog/${blog.id}`} className="action-link view-link">
                      View
                    </Link>
                    <Link to={`/edit/${blog.id}`} className="action-link edit-link">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(blog.id)} 
                      className="action-link delete-link"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity / Insights */}
        <div className="insights-section">
          <h2>Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Top Category</h4>
              {stats.categories.length > 0 && (
                <p>
                  {stats.categories.reduce((a, b) => 
                    blogs.filter(blog => blog.category === a).length > 
                    blogs.filter(blog => blog.category === b).length ? a : b
                  )}
                </p>
              )}
            </div>
            <div className="insight-card">
              <h4>Writing Streak</h4>
              <p>Keep writing! 🚀</p>
            </div>
            <div className="insight-card">
              <h4>Engagement</h4>
              <p>Share your blogs!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;