import './Tasks.css';
import { Link } from 'react-router-dom';
import { getTaskPriorityText, getTaskStatusText } from './taskUtil';

function Task( { task } ) {
    return (
        <>
            <Link to={`/tasks/${task.id}`} className="task-card">
                <h3>{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                {/*
                <span className={`task-status task-status-${task.status}`}>
                    {getTaskStatusText(task.status)}
                </span>
                */}
                <span className={`task-priority task-priority-${task.priority}`}>
                    {getTaskPriorityText(task.priority)}
                </span>
                </div>
                {task.due_date && (
                    <p className="task-due-date">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                )}
            </Link>
        </>
    )
}

export default Task;