import { Link } from "react-router-dom";
import type { Task } from "../types";

export default function TaskCard({ task }: { task: Task }) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No due date";

  const statusClass = `status-${task.status.replace(/\s+/g, "-")}`;

  return (
    <Link
      to={`/tasks/${task._id}`}
      className="task-card"
      data-priority={task.priority}
    >
      <div className="task-card-header">
        <h3>{task.title}</h3>
      </div>

      <div className="task-card-badges">
        <span className={`badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <span className={`badge ${statusClass}`}>{task.status}</span>
      </div>

      <div className="task-card-footer">
        <span>{formattedDate}</span>
      </div>
    </Link>
  );
}