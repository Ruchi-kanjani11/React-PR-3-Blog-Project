import React, { createContext, useState, useContext, useEffect } from 'react';
// createContext - Creates context object
// useState - For component state
// useEffect - For side effects
// useContext - To consume context
import { getUsers, createUser } from '../services/api'; 

// Create context object
const AuthContext = createContext();

// Custom hook for using auth context (cleaner than useContext directly)
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps parts of app needing auth
export const AuthProvider = ({ children }) => {
  // State to store user object (null if not logged in)
  const [user, setUser] = useState(null);
  // Loading state for async operations
  const [loading, setLoading] = useState(true);

  // useEffect runs once when component mounts
  useEffect(() => {
    // Check localStorage for existing user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Parse JSON string back to object
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);  // Authentication check complete
  }, []);  // Empty dependency array = run once

  // Login function
  const login = async (email, password) => {
    try {
      // Fetch all users from mock database
      const response = await getUsers();
      const users = response.data;
      
      // Find user with matching email and password
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Create user object without password for security
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        };
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
        // Update state
        setUser(userData);
        // Return success
        return { success: true };
      }
      // Return error if no user found
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      const response = await getUsers();
      const users = response.data;
      
      // Check if email already exists
      const existingUser = users.find((u) => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }
      
      // Create new user with ID and role
      const newUser = {
        id: Date.now().toString(),  // Simple ID generation
        ...userData,                 // Spread operator - copies all properties
        role: 'user',               // Default role
      };
      
      // In real app, you'd POST to server
      // For demo, we'll just simulate
      const allUsers = [...users, newUser];  // Spread to create new array
      localStorage.setItem('users', JSON.stringify(allUsers));
      
      // Auto-login after registration
      const loginUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
      localStorage.setItem('user', JSON.stringify(loginUser));
      setUser(loginUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');  // Clear storage
    setUser(null);                    // Clear state
  };

  // Value object provided to consuming components
  const value = {
    user,      // Current user or null
    login,     // Login function
    register,  // Register function
    logout,    // Logout function
    loading,   // Loading state
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};