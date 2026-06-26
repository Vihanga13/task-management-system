import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types";

export default function Dashboard() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const { user, logout } = useAuth();

  // Separate fetch for sidebar counts — always reflects the full unfiltered set
  const fetchAllForCounts = async () => {
    try {
      const res = await api.get("/tasks");
      setAllTasks(res.data);
    } catch {
      // counts are non-critical, fail silently
    }
  };

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
    fetchAllForCounts();
  }, []);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, priority, status]);

  const countByStatus = (s: string) =>
    allTasks.filter((t) => t.status === s).length;

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">Task Manager</div>

        <div className="sidebar-user">
          <strong>{user?.name}</strong>
          {user?.role}
        </div>

        <div className="sidebar-stats">
          <div className="sidebar-stats-label">Status overview</div>

          <div className="stat-row">
            <span className="stat-row-label">
              <span className="stat-dot open" />
              Open
            </span>
            <span className="stat-row-count">{countByStatus("Open")}</span>
          </div>

          <div className="stat-row">
            <span className="stat-row-label">
              <span className="stat-dot progress" />
              In Progress
            </span>
            <span className="stat-row-count">{countByStatus("In Progress")}</span>
          </div>

          <div className="stat-row">
            <span className="stat-row-label">
              <span className="stat-dot testing" />
              Testing
            </span>
            <span className="stat-row-count">{countByStatus("Testing")}</span>
          </div>

          <div className="stat-row">
            <span className="stat-row-label">
              <span className="stat-dot done" />
              Done
            </span>
            <span className="stat-row-count">{countByStatus("Done")}</span>
          </div>
        </div>

        <div className="sidebar-spacer" />

        <button onClick={logout} className="btn-secondary">
          Log Out
        </button>
      </aside>

      <main className="dashboard-main">
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

        {loading && <p className="empty-state">Loading tasks...</p>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && tasks.length === 0 && (
          <p className="empty-state">No tasks found. Create your first one!</p>
        )}

        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </main>
    </div>
  );
}