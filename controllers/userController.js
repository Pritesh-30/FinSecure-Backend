const User = require("../models/User");

// Toggle user status (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle status
    user.status = user.status === "active" ? "inactive" : "active";

    await user.save();

    res.json({
      message: `User is now ${user.status}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { toggleUserStatus };