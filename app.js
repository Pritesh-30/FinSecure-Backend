require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const createAdmin = require("./utils/createAdmin");
const authRoutes = require("./routes/authRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

connectDB()
  .then(() => {
    createAdmin();
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
