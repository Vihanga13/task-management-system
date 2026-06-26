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
        <div className="error-banner">{error}</div>
        <Link to="/">← Back to dashboard</Link>
      </div>
    );
  }

  if (!task) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page">
      <header className="navbar">
        <h2>Task Details</h2>
        <button onClick={() => navigate("/")} className="btn-secondary">
          Back
        </button>
      </header>

      <div className="task-detail-card">
        <h1>{task.title}</h1>

        <div className="task-card-badges">
          <span className="badge">{task.priority}</span>
          <span className="badge">{task.status}</span>
        </div>

        <p className="task-description">
          {task.description || "No description provided."}
        </p>

        <div className="task-meta">
          <p>
            <strong>Due Date:</strong>{" "}
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"}
          </p>
          <p>
            <strong>Created By:</strong> {task.createdBy.name} ({task.createdBy.email})
          </p>
          <p>
            <strong>Assigned To:</strong> {task.assignedTo.name} ({task.assignedTo.email})
          </p>
        </div>

        <div className="task-detail-actions">
          <Link to={`/tasks/${task._id}/edit`} className="btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}