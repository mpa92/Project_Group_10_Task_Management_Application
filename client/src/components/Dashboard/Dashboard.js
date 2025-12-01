import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
          className="btn-logout" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <div className="dashboard-section">
        <h2>Welcome{user?.firstName ? `, ${user.firstName}` : ''}!</h2>
        <p>You have successfully logged in to the Task Management Application.</p>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Manage your tasks, track progress, and stay organized.
        </p>
      </div>

      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <Link to="/tasks" className="action-card action-card-primary">
            <h4>View Task Board</h4>
            <p>See all your tasks organized by status</p>
          </Link>
          
          <Link to="/tasks/new" className="action-card action-card-success">
            <h4>Create New Task</h4>
            <p>Add a new task to your board</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

