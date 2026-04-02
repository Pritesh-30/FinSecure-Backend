const User = require("../models/User");

const createAdmin = async () => {
  try {
    const userCount = await User.countDocuments();

    // ✅ Only run if DB is empty
    if (userCount === 0) {
      await User.create({
        name: "Admin",
        email: "admin@test.com",
        password: "123456",
        role: "admin",
      });

      console.log("🚀 First Admin Created:");
      console.log("Email: admin@test.com");
      console.log("Password: 123456");
    } else {
      console.log("✅ Users already exist → skipping admin creation");
    }
  } catch (error) {
    console.error("Admin creation error:", error.message);
  }
};

module.exports = createAdmin;