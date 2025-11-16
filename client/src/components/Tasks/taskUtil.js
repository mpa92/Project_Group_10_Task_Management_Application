export function getTaskStatusText(status) {
    switch (status) {
        case 'open':
            return 'Open';
        case 'in_progress':
            return 'In Progress';
        case 'completed':
            return 'Completed';
        default:
            return status;
    }
}