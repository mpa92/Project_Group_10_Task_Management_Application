import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Tasks.css';
import TaskGroup from './TaskGroup';
import { mockTasks } from './mockData';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'due_date'
  });

  useEffect(() => {
    // TODO: Fetch tasks from API with filters
    // const fetchTasks = async () => {
    //   try {
    //     const response = await axios.get('/api/tasks', { params: filters });
    //     setTasks(response.data);
    //   } catch (err) {
    //     console.error('Error fetching tasks:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchTasks();

    setTasks(mockTasks);
    setLoading(false);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-board">
      <header className="task-board-header">
        <h1>Task Board</h1>
      </header>

      <div className="filters">
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="due_date">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="created_at">Sort by Created Date</option>
        </select>
      </div>

      <Link to="/tasks/new" className="btn-create-task">Create New Task</Link>

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p>No tasks found. Create your first task!</p>
        ) : (
          ["open","in_progress","completed"].map(status => (
            <TaskGroup key={status} tasks={tasks} status={status} />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskBoard;

