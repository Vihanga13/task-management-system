const User = require("../models/User");

// GET /api/users  (Admin only — used to populate the "assign to" dropdown)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers };