export interface User {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Testing" | "Done";
  dueDate?: string;
  createdBy: User;
  assignedTo: User;
  createdAt: string;
  updatedAt: string;
}