# Acceptance Criteria for CRUD Operations

## Task-4: Set Acceptance Criteria for CRUD

### Create Task
- **Given** a user is authenticated and on the task creation page
- **When** the user fills in all required fields (title) and optional fields (description, due date, priority, assigned user)
- **Then** the task should be created successfully and saved to the database
- **And** the user should be redirected to the task details page or task board
- **And** a success message should be displayed

**Required Fields:**
- Title (string, max 255 characters, cannot be empty)

**Optional Fields:**
- Description (text, can be empty)
- Due date (date, must be valid date format if provided)
- Priority (enum: low, medium, high, default: medium)
- Assigned user (foreign key to users table, can be null for unassigned tasks)
- Status (enum: open, in_progress, completed, default: open)

**Validation:**
- Title cannot be empty or only whitespace
- Title cannot exceed 255 characters
- Priority must be one of: low, medium, high (defaults to medium if not provided)
- Status must be one of: open, in_progress, completed (defaults to open if not provided)
- Due date must be a valid date format (YYYY-MM-DD) if provided
- Due date cannot be in the past (optional business rule - can be configured)
- Assigned user must exist in the users table if provided

---

### Read Task
- **Given** a user is authenticated
- **When** the user navigates to the task board or task details page
- **Then** all tasks should be displayed (or filtered based on user's filters)
- **And** task information should include: id, title, description, status, priority, due date, assigned user (name/username), created by (name/username), created date, updated date
- **And** tasks should be sortable by: due date, priority, created date, updated date, assigned user, title (alphabetical)
- **And** users should only see tasks they created or are assigned to (unless admin role)

**Filtering Options:**
- Filter by status (all, open, in_progress, completed)
- Filter by priority (all, low, medium, high)
- Filter by assigned user (dropdown with all users)
- Filter by due date range (start date and end date)
- Filter by created date range
- Filter by "My Tasks" (tasks assigned to current user)
- Filter by "Created by Me" (tasks created by current user)
- Filter by overdue tasks (due date < today and status != completed)

**Sorting Options:**
- Sort by due date (ascending/descending)
- Sort by priority (low to high, high to low)
- Sort by created date (newest/oldest)
- Sort by updated date (newest/oldest)
- Sort by assigned user (alphabetical A-Z, Z-A)
- Sort by title (alphabetical A-Z, Z-A)
- Multiple sort criteria (e.g., priority first, then due date)

---

### Update Task
- **Given** a user is authenticated and viewing a task
- **When** the user clicks "Edit" and modifies task fields
- **Then** the task should be updated in the database
- **And** the updated information should be reflected immediately in the UI
- **And** a success message should be displayed
- **And** the updated_at timestamp should be automatically updated
- **And** task history should record the changes (field name, old value, new value, timestamp, user who made the change) - *Future enhancement*

**Editable Fields:**
- Title
- Description
- Status
- Priority
- Due date
- Assigned user

**Validation:**
- Same validation rules as Create Task
- User must have permission to edit the task (either creator or assigned user)
- Task must exist in the database
- Cannot update a task that has been deleted

---

### Delete Task
- **Given** a user is authenticated and viewing a task
- **When** the user clicks "Delete" and confirms the deletion
- **Then** the task should be removed from the database (or soft-deleted if soft delete is implemented)
- **And** the user should be redirected to the task board
- **And** a success message should be displayed
- **And** associated comments and history should be handled (cascade delete or soft delete)
- **And** the task should no longer appear in task lists or search results

**Permissions:**
- Only the task creator or admin should be able to delete tasks
- Confirmation dialog should be shown before deletion with task title displayed
- Confirmation dialog should have clear "Cancel" and "Delete" buttons
- Deletion should be irreversible (unless soft delete is implemented)

---

## Additional Requirements

### Error Handling
- All CRUD operations should handle errors gracefully
- User-friendly error messages should be displayed
- Network errors should be handled appropriately
- Validation errors should be shown inline with form fields

### Performance
- Task list should load within 2 seconds
- Pagination or virtual scrolling should be implemented for large task lists (100+ tasks)
- Database queries should be optimized with proper indexes

### Security
- All API endpoints should require authentication (JWT token)
- Users should only be able to access/modify their own tasks or tasks assigned to them
- Input validation should prevent SQL injection and XSS attacks
- All user inputs should be sanitized on both client and server side
- Password fields should never be returned in API responses
- Rate limiting should be implemented to prevent abuse
- CORS should be properly configured
- Sensitive error messages should not expose system details

### User Experience
- Loading states should be shown during API calls (spinners, skeleton screens)
- Success/error messages should be clear and actionable
- Success messages should auto-dismiss after 3-5 seconds
- Forms should have proper validation feedback (inline errors, field highlighting)
- Responsive design should work on mobile and desktop
- Keyboard navigation should be supported
- Form submissions should be disabled during processing to prevent duplicate submissions
- Optimistic UI updates where appropriate (update UI immediately, rollback on error)

