const Task = require("../models/Task");

// GET /api/tasks  (supports ?search=&priority=&status=)
const getTasks = async (req, res) => {
  try {
    let filter = {};

    // Admin sees everything. A normal user only sees tasks they made or were given.
    if (req.user.role !== "Admin") {
      filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner =
      task.createdBy._id.toString() === req.user._id.toString() ||
      task.assignedTo._id.toString() === req.user._id.toString();

    if (req.user.role !== "Admin" && !isOwner) {
      return res.status(403).json({ message: "Not allowed to view this task" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      createdBy: req.user._id,
      assignedTo: assignedTo || req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner =
      task.createdBy.toString() === req.user._id.toString() ||
      task.assignedTo.toString() === req.user._id.toString();

    if (req.user.role !== "Admin" && !isOwner) {
      return res.status(403).json({ message: "Not allowed to edit this task" });
    }

    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner = task.createdBy.toString() === req.user._id.toString();

    if (req.user.role !== "Admin" && !isOwner) {
      return res.status(403).json({ message: "Not allowed to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };