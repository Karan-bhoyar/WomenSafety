const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve HTML, CSS, JS

// ✅ MongoDB local connection
mongoose
  .connect("mongodb://127.0.0.1:27017/womenSafetyDB")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* -------------------------------------
   🧩 SCHEMAS & MODELS
------------------------------------- */

// ✅ Updated User Schema for signup
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  emergencyContact: String,
  emergencyPhone: String,
  notifications: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  newsletter: Boolean,
});

const reportSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  contact: String,
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Report = mongoose.model("Report", reportSchema);

/* -------------------------------------
   🧩 ROUTES
------------------------------------- */

// ✅ Signup API (now accepts all fields)
app.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      emergencyContact,
      emergencyPhone,
      notifications,
    } = req.body;

    // ✅ Prevent duplicates
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    await User.create({
      firstName,
      lastName,
      email: email.toLowerCase().trim(), // 🔥 ensure same format
      phone,
      password: password.trim(),
      emergencyContact,
      emergencyPhone,
      notifications,
    });

    res.status(200).json({ message: "Signup successful!" });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Signup failed!" });
  }
});



// ✅ Login API (fixed)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    // 🔍 Find user by lowercase email (in case user typed capital letters)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: "User not found!" });
    }

    // 🧩 Compare plain text passwords (for now)
    if (user.password.trim() !== password.trim()) {
      console.log("❌ Wrong password for:", email);
      return res.status(401).json({ message: "Incorrect password!" });
    }

    // ✅ Success
    res.status(200).json({
      message: "Login successful!",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login!" });
  }
});


// ✅ Contact API
app.post("/contact", async (req, res) => {
  try {
    await Contact.create(req.body);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Contact Error:", err);
    res.status(500).json({ message: "Failed to send message!" });
  }
});

// ✅ Emergency Report API
app.post("/report", async (req, res) => {
  try {
    await Report.create(req.body);
    res.status(200).json({ message: "Emergency alert sent successfully!" });
  } catch (err) {
    console.error("❌ Report Error:", err);
    res.status(500).json({ message: "Failed to send emergency alert!" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
