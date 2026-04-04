const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { toggleUserStatus, getAllUsers} = require("../controllers/userController");


// Get all users (Admin only)
router.get("/all", protect, authorizeRoles("admin"), getAllUsers);

// Admin only
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  toggleUserStatus
);

module.exports = router;