const Record = require("../models/Record");

// Helper formatter
const formatRecord = (r) => ({
  id: r._id,
  amount: r.amount,
  type: r.type,
  category: r.category,
  date: r.date,
  note: r.note,
  createdBy: r.createdBy?.name,
});

// Create Record (Admin)
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      note,
      createdBy: req.user.id,
    });

    res.json({
      message: "Record created",
      record: formatRecord(record),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Records
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    const records = await Record.find(filter)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(records.map(formatRecord));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Record
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("createdBy", "name");

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({
      message: "Record updated",
      record: formatRecord(record),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Record
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
};