import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Tasks.css';
import { getTaskPriorityText, getTaskStatusText } from './taskUtil';
import UserSearch from '../Common/UserSearch';
import api from '../../utils/api';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    due_date: '',
    assigned_to: ''
  });

  useEffect(() => {
    // TODO: Fetch task details from API
    const fetchTask = async () => {
      try {
        const response = await api.get(`/api/tasks/${id}`);
        setTask(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
    
    // Fetch from mock data
    if (id !== 'new') {
      setTask(mockTasks.find(t => t.id === parseInt(id)));
      setFormData(mockTasks.find(t => t.id === parseInt(id)) || {});
    } else {
      setIsEditing(true);
      return;
    }

    // Fetch task details from API if editing
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/tasks/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        // extract date only from due date
        response.data.due_date = response.data.due_date ? response.data.due_date.split('T')[0] : '';
        
        setTask(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();

    setLoading(false);
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const setUserId = (userId) => {
    setFormData({
      ...formData,
      assigned_to: userId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id === 'new') {
      // Create post
      try {
        const response = await axios.post('/api/tasks', 
          formData, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const newTaskId = response.data.id;
        setErrorMessage(null);
        setIsEditing(false);
        navigate(`/tasks/${newTaskId}`);
      } catch (err) {
        console.error('Error editing task:', err);
        setError('Failed to create task. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      // Edit post
      try {
        const response = await axios.put(`/api/tasks/${id}`, 
          formData, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        console.log("Edit post response:", response.data);
        
        // Format the date from the response
        response.data.due_date = response.data.due_date ? response.data.due_date.split('T')[0] : '';
        
        setFormData(response.data);
        setTask(response.data);
        setIsEditing(false);
        setErrorMessage(null);
        console.log('Task update:', formData);
      } catch (err) {
        console.error('Error editing task:', err);
        setError('Failed to edit task. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Delete post
      try {
        await axios.delete(`/api/tasks/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        setErrorMessage(null);
        navigate('/tasks');
        console.log('Task deleted');
      } catch (err) {
        console.error('Error deleting task:', err);
        setErrorMessage('Failed to delete task. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="task-details">
      <header className="task-details-header">
        <button onClick={() => navigate('/tasks')} className="btn-back">← Back to Tasks</button>
        <div>
          {localStorage.getItem('token') && localStorage.getItem('user') && localStorage.getItem('user').includes(`"id":${task?.created_by}`) && (
            <>
              <button onClick={() => id === 'new' ? navigate('/tasks') : setIsEditing(!isEditing)} className="btn-secondary">
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button onClick={handleDelete} className="btn-danger">Delete</button>
            </>
          )}
        </div>
      </header>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Assign to</label>
            <UserSearch initialSearchTerm={task?.assigned_to ? `${task.assignee_first_name} ${task.assignee_last_name}` : ''} userIdSetter={setUserId}/>
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      ) : (
        <div className="task-details-content">
          <h1>{task?.title || 'Task Title'}</h1>
          <p className="task-description">{task?.description || 'Task description'}</p>
          <div className="task-info">
            <div className="info-item">
              <strong>Status:</strong>
              <span className={`task-status task-status-${task?.status || 'open'}`}>
                {getTaskStatusText(task?.status || 'open')}
              </span>
            </div>
            <div className="info-item">
              <strong>Priority:</strong>
              <span className={`task-priority task-priority-${task?.priority || 'medium'}`}>
                {getTaskPriorityText(task?.priority || 'medium')}
              </span>
            </div>
            {task?.due_date && (
              <div className="info-item">
                <strong>Due Date:</strong>
                <span>{new Date(task.due_date + 'T00:00:00').toLocaleDateString()}</span>
              </div>
            )}
            {task?.assigned_to && (
              <div className="info-item">
                <strong>Assigned To:</strong>
                <span>{`${task.assignee_first_name} ${task.assignee_last_name}`}</span>
              </div>
            )}
            {task?.created_by && (
              <div className="info-item">
                <strong>Creator:</strong>
                <span>{`${task.creator_first_name} ${task.creator_last_name}`}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;

