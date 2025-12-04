let currentId = 6;

export function getNextId() {
    return currentId++;
}

export const mockTasks = [
    {
        id: 1,
        title: 'Design Homepage Layout',
        description: 'Create wireframes and mockups for the new homepage design',
        status: 'in_progress',
        priority: 'high',
        due_date: '2025-11-20'
    },
    {
        id: 2,
        title: 'Fix Login Bug',
        description: 'Users are unable to login with special characters in password',
        status: 'open',
        priority: 'high',
        due_date: '2025-11-18'
    },
    {
        id: 3,
        title: 'Update Documentation',
        description: 'Add API documentation for new endpoints',
        status: 'open',
        priority: 'medium',
        due_date: '2025-11-25'
    },
    {
        id: 4,
        title: 'Database Optimization',
        description: 'Optimize slow queries in the tasks table',
        status: 'completed',
        priority: 'medium',
        due_date: '2025-11-15'
    },
    {
        id: 5,
        title: 'Setup CI/CD Pipeline',
        description: 'Configure automated testing and deployment',
        status: 'in_progress',
        priority: 'low',
        due_date: '2025-11-30'
    }
];