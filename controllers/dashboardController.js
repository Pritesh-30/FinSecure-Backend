const Record = require("../models/Record");

const getTotalIncome = async (req, res) => {
  try {
    const result = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({ totalIncome: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalExpense = async (req, res) => {
  try {
    const result = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({ totalExpense: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    res.status(500).json({ error: error.message });
  }
};

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

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getTotalIncome,
  getTotalExpense,
  getBalance,
  getTrends,
  getCategoryBreakdown,
};
