import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const getBlogs = () => API.get('/blogs');
export const getBlogById = (id) => API.get(`/blogs/${id}`);
export const createBlog = (data) => API.post('/blogs', data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

export const getUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post('/users', data);  // ← THIS MUST EXIST