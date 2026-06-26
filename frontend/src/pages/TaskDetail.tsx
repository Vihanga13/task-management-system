import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";
import type { Task } from "../types";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/tasks/${id}`)
      .then((res) => setTask(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load task"));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    try {
      await api.delete(`/tasks/${id}`);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  if (error) {
    return (
      <div className="page">
        <div style={{ padding: "2rem" }}>
          <div className="error-banner">{error}</div>
          <Link to="/" style={{ color: "#F5F3EE" }}>← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return <div className="page"><p className="empty-state">Loading...</p></div>;
  }

  const statusClass = `status-${task.status.replace(/\s+/g, "-")}`;

  return (
    <div className="page">
      <header className="navbar">
        <h2>Task Details</h2>
        <button onClick={() => navigate("/")} className="btn-secondary">
          Back
        </button>
      </header>

      <div className="detail-shell">
        <div className="task-detail-card" data-priority={task.priority}>
          <div className="task-card-badges">
            <span className={`badge priority-${task.priority}`}>{task.priority}</span>
            <span className={`badge ${statusClass}`}>{task.status}</span>
          </div>

          <h1>{task.title}</h1>

          <p className="task-description">
            {task.description || "No description provided."}
          </p>
        </div>

        <aside className="detail-sidebar">
          <div className="detail-sidebar-label">Details</div>

          <div className="task-meta">
            <div className="meta-item">
              <span className="meta-item-label">Due Date</span>
              <span className="meta-item-value">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-item-label">Created By</span>
              <span className="meta-item-value">{task.createdBy.name}</span>
            </div>

            <div className="meta-item">
              <span className="meta-item-label">Assigned To</span>
              <span className="meta-item-value">{task.assignedTo.name}</span>
            </div>
          </div>

          <div className="task-detail-actions">
            <Link to={`/tasks/${task._id}/edit`} className="btn-primary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}