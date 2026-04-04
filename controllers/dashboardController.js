const Record = require("../models/Record");

// Total Income
const getTotalIncome = async (req, res) => {
  try {
    const result = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({ totalIncome: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Total Expense
const getTotalExpense = async (req, res) => {
  try {
    const result = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({ totalExpense: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Balance
const getBalance = async (req, res) => {
  try {
    const income = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expense = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Trends (cleaned)
const getTrends = async (req, res) => {
  try {
    const result = await Record.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Clean response
    const formatted = result.map((r) => ({
      year: r._id.year,
      month: r._id.month,
      total: r.total,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Category Breakdown
const getCategoryBreakdown = async (req, res) => {
  try {
    const result = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const formatted = result.map((r) => ({
      category: r._id,
      total: r.total,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Recent Activity (cleaned)
const getRecentActivity = async (req, res) => {
  try {
    const records = await Record.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name");

    const formatted = records.map((r) => ({
      id: r._id,
      amount: r.amount,
      type: r.type,
      category: r.category,
      date: r.date,
      createdBy: r.createdBy?.name,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTotalIncome,
  getTotalExpense,
  getBalance,
  getTrends,
  getCategoryBreakdown,
  getRecentActivity,
};
