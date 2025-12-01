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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = result.rows[0];

    if (!req.user.id === task.created_by && !req.user.id === task.assigned_to) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error in GET /api/tasks/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks - Create a new task
// Expected body: { title, description?, dueDate?, priority?, assignedTo?, status? }
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, dueDate, priority, assignedTo, status } = req.body;
    
    // TODO: Implement create task
    // - Validate required fields (title is required)
    // - Validate optional fields (priority: low/medium/high, status: open/in_progress/completed)
    // - Set created_by to authenticated user
    // - Save to database
    // - Return created task
    
    res.status(501).json({ 
      message: 'Create task endpoint - to be implemented',
      receivedData: { title, description, dueDate, priority, assignedTo, status },
      createdBy: userId,
      note: 'This is a skeleton endpoint. See docs/ACCEPTANCE_CRITERIA.md for requirements.'
    });
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tasks/:id - Update a task
// Expected body: { title?, description?, dueDate?, priority?, assignedTo?, status? }
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const updateData = req.body;
    
    // TODO: Implement update task
    // - Verify task exists
    // - Verify user has permission (created by or assigned to user)
    // - Validate update fields
    // - Update task in database
    // - Return updated task
    
    res.status(501).json({ 
      message: 'Update task endpoint - to be implemented',
      taskId: taskId,
      updateData: updateData,
      updatedBy: userId,
      note: 'This is a skeleton endpoint. See docs/ACCEPTANCE_CRITERIA.md for requirements.'
    });
  } catch (error) {
    console.error('Error in PUT /api/tasks/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    
    // TODO: Implement delete task
    // - Verify task exists
    // - Verify user has permission (only creator can delete)
    // - Show confirmation (handled on frontend)
    // - Delete task from database (or soft delete)
    // - Handle cascade deletes for related data
    
    res.status(501).json({ 
      message: 'Delete task endpoint - to be implemented',
      taskId: taskId,
      deletedBy: userId,
      note: 'This is a skeleton endpoint. See docs/ACCEPTANCE_CRITERIA.md for requirements.'
    });
  } catch (error) {
    console.error('Error in DELETE /api/tasks/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

