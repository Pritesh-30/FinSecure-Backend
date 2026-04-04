const User = require("../models/User");

// Helper formatter
const formatUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  status: u.status,
});

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role status");

    res.json(users.map(formatUser));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle / Update user status (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({
      message: `User is now ${user.status}`,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { toggleUserStatus, getAllUsers };