import './Tasks.css';
import Task from "./Task";
import { getTaskStatusText } from "./taskUtil";

function TaskGroup({ tasks, status }) {
    const filteredTasks = tasks.filter(task => task.status === status);
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