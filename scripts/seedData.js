require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Record = require("../models/Record");

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional)
    await User.deleteMany();
    await Record.deleteMany();

    // Create users
    const users = await User.create([
      {
        name: "Admin",
        email: "admin@test.com",
        password: "123456",
        role: "admin",
      },
      {
        name: "Analyst",
        email: "analyst@test.com",
        password: "123456",
        role: "analyst",
      },
      {
        name: "Viewer",
        email: "viewer@test.com",
        password: "123456",
        role: "viewer",
      },
    ]);

    // Create records (optional)
    await Record.create([
      {
        amount: 5000,
        type: "income",
        category: "salary",
        note: "Monthly salary",
        createdBy: users[0]._id,
      },
      {
        amount: 1000,
        type: "expense",
        category: "food",
        note: "Dinner",
        createdBy: users[0]._id,
      },
    ]);

    console.log("✅ Mock data inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();