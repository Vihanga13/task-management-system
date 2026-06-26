# Task Management System

A full-stack task management web app where users can create, assign, track, and manage tasks with role-based access control.

**Live Demo:** https://taskmanagerassingment.netlify.app/
**Backend API:** https://task-management-system-7l0t.onrender.com

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–60 seconds to respond while the server wakes up.

---

## Features

- **Authentication** — Register and log in with JWT-based sessions
- **Role-based access**
  - The first registered account automatically becomes **Admin**
  - All other accounts are **User**
  - Admins can see and manage every task
  - Users can only see tasks they created or were assigned
- **Task management**
  - Create, view, edit, and delete tasks
  - Each task has a title, description, priority (Low / Medium / High), status (Open / In Progress / Testing / Done), and due date
  - Tasks are linked to a creator and an assignee
  - Admins can assign tasks to any registered user; regular users' tasks default to themselves
- **Search & filter** — Filter the task list by title (search), priority, and status
- **Card-based UI** — Responsive card layout for the task list

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), TypeScript, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose), hosted on MongoDB Atlas |
| Auth | JSON Web Tokens (JWT), bcrypt for password hashing |
| Deployment | Backend on Render · Frontend on Netlify |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── config/        # Database connection
│   ├── controllers/   # Route logic (auth, tasks, users)
│   ├── middleware/     # JWT auth + admin-only guard
│   ├── models/         # Mongoose schemas (User, Task)
│   ├── routes/         # Express route definitions
│   └── server.js       # App entry point
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance with auth interceptor
    │   ├── components/  # TaskCard, ProtectedRoute
    │   ├── context/      # AuthContext (global auth state)
    │   ├── pages/        # Login, Register, Dashboard, TaskForm, TaskDetail
    │   └── App.tsx       # Route definitions
    └── ...
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or later recommended)
- A MongoDB Atlas account (free tier works) or a local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/Vihanga13/task-management-system.git
cd task-management-system
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
```

Start the backend:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

By default, the frontend's API base URL is set in `src/api/axios.ts`. For local development, point it to your local backend:

```ts
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});
```

Start the frontend:

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

---

## Usage

1. **Register** a new account. The very first account created becomes an **Admin**; every account after that is a regular **User**.
2. **Log in** to reach the dashboard.
3. Use **+ New Task** to create a task. Admins will see an additional "Assign To" dropdown to assign the task to any registered user.
4. Use the **search bar** and **priority/status filters** to narrow down the task list.
5. Click any task card to view full details, and use the **Edit** or **Delete** buttons from there.
6. **Admins** see every task in the system; **regular users** only see tasks they created or were assigned to.

---

## API Overview

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/auth/me` | Get the current logged-in user | Yes |
| GET | `/api/users` | List all users (for the assign-to dropdown) | Yes (Admin only) |
| GET | `/api/tasks` | List tasks (filtered by role; supports `?search=&priority=&status=`) | Yes |
| GET | `/api/tasks/:id` | Get a single task | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

---

## Design Notes

- **Role assignment** is intentionally simple: the first registered user becomes Admin, removing the need for a manual role-selection step during sign-up.
- **Password security**: passwords are hashed with bcrypt before being stored; plaintext passwords are never persisted or returned by the API.
- **Authorization** is enforced on the backend (not just hidden in the UI) — task ownership and role checks happen in the controllers, so a regular user cannot access another user's task even by calling the API directly.