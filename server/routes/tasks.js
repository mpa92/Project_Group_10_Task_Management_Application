const pool = require('../config/db');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// ============================================
// CRUD Operations Skeleton (Task-4)
// These are skeleton files for CRUD operations
// Full implementation will be done by the team
// ============================================

// GET /api/tasks - Get all tasks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await pool.query(`
      SELECT 
        t.*,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name,
        assignee.first_name AS assignee_first_name,
        assignee.last_name AS assignee_last_name
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      ORDER BY t.created_at DESC
    `);
    res.status(200).json(tasks.rows);
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks/:id - Get a single task
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const result = await pool.query(`
      SELECT 
        t.*,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name,
        assignee.first_name AS assignee_first_name,
        assignee.last_name AS assignee_last_name
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.id = $1
    `, [taskId]);

    // ensure task is found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = result.rows[0];

    // ensure user has permission to view the task
    if (!req.user.userId === task.created_by && !req.user.id === task.assigned_to) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // return the task
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error in GET /api/tasks/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks - Create a new task
// Expected body: { title, description?, due_date?, priority?, assignedTo?, status? }
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, due_date, priority, assigned_to, status } = req.body;
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Validate optional fields
    const validPriorities = ['low', 'medium', 'high'];
    const validStatuses = ['open', 'in_progress', 'completed'];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority. Must be low, medium, or high' });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be open, in_progress, or completed' });
    }

    // Insert task into database
    const result = await pool.query(`
      INSERT INTO tasks (title, description, due_date, priority, assigned_to, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      title.trim(),
      description || null,
      due_date || null,
      priority || 'medium',
      assigned_to || null,
      status || 'open',
      userId
    ]);

    const createdTask = result.rows[0];

    // Fetch the task with user names
    const taskWithNames = await pool.query(`
      SELECT 
        t.*,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name,
        assignee.first_name AS assignee_first_name,
        assignee.last_name AS assignee_last_name
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.id = $1
    `, [createdTask.id]);

    return res.status(201).json(taskWithNames.rows[0]);
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tasks/:id - Update a task
// Expected body: { title?, description?, due_date?, priority?, assignedTo?, status? }
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { title, description, due_date, priority, assigned_to, status } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    // Verify task exists
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = taskResult.rows[0];

    // Verify user has permission (created by or assigned to user)
    if (task.created_by !== userId && task.assigned_to !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate optional fields
    const validPriorities = ['low', 'medium', 'high'];
    const validStatuses = ['open', 'in_progress', 'completed'];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority. Must be low, medium, or high' });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be open, in_progress, or completed' });
    }

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    // Update task in database
    const updateResult = await pool.query(`
      UPDATE tasks
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        due_date = COALESCE($3, due_date),
        priority = COALESCE($4, priority),
        assigned_to = COALESCE($5, assigned_to),
        status = COALESCE($6, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [
      title ? title.trim() : null,
      description !== undefined ? description : null,
      due_date !== undefined ? due_date : null,
      priority || null,
      assigned_to !== undefined ? assigned_to : null,
      status || null,
      taskId
    ]);

    // Fetch the updated task with user names
    const taskWithNames = await pool.query(`
      SELECT 
        t.*,
        creator.first_name AS creator_first_name,
        creator.last_name AS creator_last_name,
        assignee.first_name AS assignee_first_name,
        assignee.last_name AS assignee_last_name
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.id = $1
    `, [taskId]);

    return res.status(200).json(taskWithNames.rows[0]);
  } catch (error) {
    console.error('Error in PUT /api/tasks/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.user.userId;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    // Verify task exists
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = taskResult.rows[0];

    // Verify user has permission (only creator can delete)
    if (task.created_by !== userId) {
      return res.status(403).json({ error: 'Access denied. Only the task creator can delete this task.' });
    }

    // Delete task from database
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);

    return res.status(200).json({ 
      message: 'Task deleted successfully',
      taskId: taskId
    });
  } catch (error) {
    console.error('Error in DELETE /api/tasks/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

