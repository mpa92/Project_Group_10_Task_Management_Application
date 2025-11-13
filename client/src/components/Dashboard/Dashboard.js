import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get user info from localStorage or API
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Optional: Verify token with backend
        const response = await api.get('/dashboard');
        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        if (err.response?.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="btn-primary" 
          onClick={handleLogout}
          style={{ background: '#e74c3c' }}
        >
          Logout
        </button>
      </header>

      <div className="dashboard-section">
        <h2>Welcome{user?.firstName ? `, ${user.firstName}` : ''}!</h2>
        <p>You have successfully logged in to the Task Management Application.</p>
        <p>This is a basic dashboard. Full dashboard features will be implemented later.</p>
      </div>

      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <p>Task management features will be available here once CRUD operations are implemented.</p>
      </div>
    </div>
  );
};

export default Dashboard;

