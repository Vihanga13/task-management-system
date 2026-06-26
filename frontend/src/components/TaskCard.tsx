import { Link } from "react-router-dom";
import type { Task } from "../types";

const priorityColors: Record<string, string> = {
  Low: "#4caf50",
  Medium: "#ff9800",
  High: "#f44336",
};

const statusColors: Record<string, string> = {
  Open: "#2196f3",
  "In Progress": "#9c27b0",
  Testing: "#ff9800",
  Done: "#4caf50",
};

export default function TaskCard({ task }: { task: Task }) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No due date";

  return (
    <Link to={`/tasks/${task._id}`} className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>
      </div>

      <div className="task-card-badges">
        <span
          className="badge"
          style={{ backgroundColor: priorityColors[task.priority] }}
        >
          {task.priority}
        </span>
        <span
          className="badge"
          style={{ backgroundColor: statusColors[task.status] }}
        >
          {task.status}
        </span>
      </div>

      <div className="task-card-footer">
        <span>📅 {formattedDate}</span>
      </div>
    </Link>
  );
}