import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const { user, logout } = useAuth();

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (priority) params.priority = priority;
      if (status) params.status = status;

      const res = await api.get("/tasks", { params });
      setTasks(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, priority, status]);

  return (
    <div className="page">
      <header className="navbar">
        <h2>Task Manager</h2>
        <div className="navbar-right">
          <span>
            {user?.name} ({user?.role})
          </span>
          <button onClick={logout} className="btn-secondary">
            Log Out
          </button>
        </div>
      </header>

      <div className="dashboard-toolbar">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Testing">Testing</option>
          <option value="Done">Done</option>
        </select>

        <Link to="/tasks/new" className="btn-primary">
          + New Task
        </Link>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && !error && tasks.length === 0 && (
        <p className="empty-state">No tasks found. Create your first one!</p>
      )}

      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}