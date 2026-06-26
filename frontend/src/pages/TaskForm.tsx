import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

export default function TaskForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "Admin") {
      api.get("/users").then((res) => setUsers(res.data)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (isEditing) {
      api.get(`/tasks/${id}`).then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setStatus(task.status);
        setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : "");
        setAssignedTo(task.assignedTo._id);
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate || undefined,
      assignedTo: assignedTo || undefined,
    };

    try {
      if (isEditing) {
        await api.put(`/tasks/${id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const formattedDueDate = dueDate
    ? new Date(dueDate + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No due date";

  const assignedUser = users.find((u) => u._id === assignedTo);
  const statusClass = `status-${status.replace(/\s+/g, "-")}`;

  return (
    <div className="page">
      <header className="navbar">
        <h2>{isEditing ? "Edit Task" : "New Task"}</h2>
        <button onClick={() => navigate("/")} className="btn-secondary">
          Back
        </button>
      </header>

      <div className="form-shell">
        <form className="task-form" onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}

          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Fix login bug"
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about the task..."
            rows={4}
          />

          <div className="form-row">
            <div>
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Testing">Testing</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {user?.role === "Admin" && (
            <>
              <label>Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">-- Myself --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
          </button>
        </form>

        <div className="form-preview">
          <div className="form-preview-label">Live preview</div>

          {title ? (
            <div className="preview-card" data-priority={priority}>
              <h3>{title}</h3>

              <div className="task-card-badges">
                <span className={`badge priority-${priority}`}>{priority}</span>
                <span className={`badge ${statusClass}`}>{status}</span>
              </div>

              {description && <p>{description}</p>}

              <div className="task-card-footer">
                <span>{formattedDueDate}</span>
              </div>

              {assignedUser && (
                <div className="task-card-footer">
                  <span>Assigned to {assignedUser.name}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="preview-empty">Start typing a title to see the preview</div>
          )}
        </div>
      </div>
    </div>
  );
}