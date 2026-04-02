require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const createAdmin = require("./utils/createAdmin");
const authRoutes = require("./routes/authRoutes");

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

app.listen(5000, () => console.log("Server running on port 5000"));
