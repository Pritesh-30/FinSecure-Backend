const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { toggleUserStatus } = require("../controllers/userController");

// Admin only
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  toggleUserStatus
);

module.exports = router;