import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Tasks.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
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
    // const fetchTask = async () => {
    //   try {
    //     const response = await axios.get(`/api/tasks/${id}`);
    //     setTask(response.data);
    //     setFormData(response.data);
    //   } catch (err) {
    //     console.error('Error fetching task:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchTask();
    
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement update task API call
    // try {
    //   await axios.put(`/api/tasks/${id}`, formData);
    //   setIsEditing(false);
    //   // Refresh task data
    // } catch (err) {
    //   console.error('Error updating task:', err);
    // }
    console.log('Task update:', formData);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // TODO: Implement delete task API call
      // try {
      //   await axios.delete(`/api/tasks/${id}`);
      //   navigate('/tasks');
      // } catch (err) {
      //   console.error('Error deleting task:', err);
      // }
      console.log('Task deleted');
    }
  };

  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  return (
    <div className="task-details">
      <header className="task-details-header">
        <button onClick={() => navigate('/tasks')} className="btn-back">← Back to Tasks</button>
        <div>
          <button onClick={() => setIsEditing(!isEditing)} className="btn-secondary">
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </header>

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
                {task?.status || 'open'}
              </span>
            </div>
            <div className="info-item">
              <strong>Priority:</strong>
              <span className={`task-priority task-priority-${task?.priority || 'medium'}`}>
                {task?.priority || 'medium'}
              </span>
            </div>
            {task?.due_date && (
              <div className="info-item">
                <strong>Due Date:</strong>
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;

