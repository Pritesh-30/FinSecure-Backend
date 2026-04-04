const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role status");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Toggle user status (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle status
    const { status } = req.body;
    user.status = status;

    await user.save();

    res.json({
      message: `User is now ${user.status}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { toggleUserStatus, getAllUsers };