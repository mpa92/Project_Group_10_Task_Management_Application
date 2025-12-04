import './Tasks.css';
import Task from "./Task";
import { getTaskStatusText } from "./taskUtil";

const statusMap = {
    "high": 1,
    "medium": 2,
    "low": 3
}

function TaskGroup({ tasks, status, filters }) {
    let filteredTasks = tasks.filter(task => task.status === status);

    if (filters.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    switch (filters.sortBy) {
        case 'due_date':
            filteredTasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());       
            break;

        case 'priority':
            filteredTasks.sort((a, b) => statusMap[a] - statusMap[b]);
            break;

        default:
            break;
    }

    return (
        <div className="task-group">
            <h2>{getTaskStatusText(status)}</h2>
            <div className="task-group-tasks">
                {filteredTasks.length === 0 ? (
                    <p>No tasks in this category.</p>
                ) : (
                    filteredTasks.map(task => (
                        <Task key={task.id} task={task} />
                    ))
                )}
            </div>
        </div>
    );
}

export default TaskGroup;