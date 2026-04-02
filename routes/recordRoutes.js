const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// import controller
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");

// Create Record - Admin Only
router.post("/", protect, authorizeRoles("admin"), createRecord);

// Get Records - Admin, Analyst, Viewer
router.get(
  "/",
  protect,
  authorizeRoles("admin", "analyst", "viewer"),
  getRecords,
);

// Update Record - Admin Only
router.put("/:id", protect, authorizeRoles("admin"), updateRecord);

// Delete Record - Admin Only
router.delete("/:id", protect, authorizeRoles("admin"), deleteRecord);

module.exports = router;
