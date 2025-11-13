const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// ============================================
// CRUD Operations Skeleton (Task-4)
// These are skeleton files for CRUD operations
// Full implementation will be done by the team
// ============================================

// GET /api/tasks - Get all tasks (with filtering and sorting)
// Expected query params: status, priority, assignedTo, dueDateFrom, dueDateTo, sortBy, sortOrder
router.get('/', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement get all tasks with filtering and sorting
    // - Filter by status, priority, assigned user, due date range
    // - Sort by due date, priority, created date, assigned user
    // - Return only tasks created by or assigned to the authenticated user
    
    res.status(501).json({ 
      message: 'Get all tasks endpoint - to be implemented',
      note: 'This is a skeleton endpoint. See docs/ACCEPTANCE_CRITERIA.md for requirements.'
    });
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks/:id - Get a single task
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // TODO: Implement get single task
    // - Verify task exists
    // - Verify user has permission (created by or assigned to user)
    // - Return task details with all fields
    
    res.status(501).json({ 
      message: 'Get single task endpoint - to be implemented',
      taskId: taskId,
      note: 'This is a skeleton endpoint. See docs/ACCEPTANCE_CRITERIA.md for requirements.'
    });
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

