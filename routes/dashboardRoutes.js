const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const {
  getTotalIncome,
  getTotalExpense,
  getBalance,
  getCategoryBreakdown,
  getTrends,
  getRecentActivity,
} = require("../controllers/dashboardController");

// Total Income - Admin, Analyst, Viewer
router.get(
  "/income",
  protect,
  authorizeRoles("admin", "analyst", "viewer"),
  getTotalIncome,
);

// Total Expense - Admin, Analyst, Viewer
router.get(
  "/expense",
  protect,
  authorizeRoles("admin", "analyst", "viewer"),
  getTotalExpense,
);

// Balance - Admin, Analyst, Viewer
router.get("/balance", protect, authorizeRoles("admin", "analyst", "viewer"), getBalance);

// Category Breakdown - Admin, Analyst
router.get(
  "/category",
  protect,
  authorizeRoles("admin", "analyst"),
  getCategoryBreakdown,
);

// Get Trends - Admin, Analyst
router.get("/trends", protect, authorizeRoles("admin", "analyst"), getTrends);

// Get Recent Activity - Admin, Analyst, Viewer
router.get(
  "/recent",
  protect,
  authorizeRoles("admin", "analyst", "viewer"),
  getRecentActivity
);

module.exports = router;
