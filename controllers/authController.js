const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    res.json({
      message: "User registered",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // 🚫 Check if user is inactive
    if (user.status !== "active") {
      return res.status(403).json({
        message: "Account is inactive. Contact admin.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password (Generate OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();

    console.log(`🔐 OTP for ${email}: ${otp}`);

    res.json({ message: "OTP sent (check console)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetOTP !== otp || user.resetOTPExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Set new password
    user.password = newPassword;

    // Clear OTP
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
