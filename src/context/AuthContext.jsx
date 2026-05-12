import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUsers, createUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await getUsers();
      const users = response.data;
      
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await getUsers();
      const users = response.data;
      
      const existingUser = users.find((u) => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user',
      };
      
      await createUser(newUser);
      
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
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Make sure JSON Server is running on port 3000' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};