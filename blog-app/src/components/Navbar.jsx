import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();            
    navigate('/login');    
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📝 BlogApp
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {user && (
            <>
              <Link to="/create" className="nav-link">Create Blog</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </>
          )}
          
          {user ? (
            <>
              <span className="nav-user">👋 {user.name}</span>
              <button onClick={handleLogout} className="nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;