const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
const PORT = 5000;

// -------------------------
// MIDDLEWARES
// -------------------------
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // serve HTML/CSS/JS

// -------------------------
// MONGODB CONNECTION
// -------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/womenSafetyDB")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// -------------------------
// SCHEMAS & MODELS
// -------------------------
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

const locationSchema = new mongoose.Schema({
  userId: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

// SOS Schema
const SOSSchema = new mongoose.Schema({
  number: String,
  createdAt: { type: Date, default: Date.now },
});

// Models
const User = mongoose.model("User", userSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Report = mongoose.model("Report", reportSchema);
const Location = mongoose.model("Location", locationSchema);
const SOS = mongoose.model("SOS", SOSSchema);

// -------------------------
// TWILIO CONFIGURATION
// -------------------------
const client = twilio(
  "ACdcc4e29be67cdd74cd11c######", // 👉 Your Twilio SID
  "bcdc5abddf0b26eeb12336#######"    // 👉 Your Twilio Auth Token
);

const TWILIO_NUMBER = "+17277#####4"; // 👉 Your Twilio Phone Number

// -------------------------
// ROUTES
// -------------------------

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase().trim() });

    if (exists)
      return res.status(400).json({ message: "Email already registered!" });

    await User.create(req.body);

    res.json({ message: "Signup successful!" });
  } catch {
    res.status(500).json({ message: "Signup failed!" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(400).json({ message: "User not found!" });

    if (user.password.trim() !== password.trim())
      return res.status(401).json({ message: "Incorrect password!" });

    res.json({
      message: "Login successful!",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error during login!" });
  }
});

// Contact Form
app.post("/contact", async (req, res) => {
  try {
    await Contact.create(req.body);
    res.json({ message: "Message sent successfully!" });
  } catch {
    res.status(500).json({ message: "Failed to send message!" });
  }
});

// Emergency Report
app.post("/report", async (req, res) => {
  try {
    await Report.create(req.body);
    res.json({ message: "Emergency alert sent successfully!" });
  } catch {
    res.status(500).json({ message: "Failed to send emergency alert!" });
  }
});

// FAST Live Location Save
app.post("/api/location", async (req, res) => {
  try {
    await Location.create({
      userId: req.body.userId,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

// Fetch all locations (Admin Panel)
app.get("/api/locations", async (req, res) => {
  try {
    const locations = await Location.find().sort({ timestamp: -1 });
    res.json(locations);
  } catch {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// -------------------------
// SOS CONTACT & SMS
// -------------------------

// Save SOS Contact
app.post("/save-sos", async (req, res) => {
  try {
    await SOS.create({ number: req.body.number });
    res.json({ success: true, message: "SOS contact saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save SOS contact!" });
  }
});

// Send SOS SMS
app.post("/send-sos", async (req, res) => {
  try {
    await client.messages.create({
      body: "🚨 SOS ALERT! The user urgently needs help!",
      from: TWILIO_NUMBER,
      to: req.body.number,
    });

    res.json({ success: true, message: "SOS SMS sent!" });
  } catch (err) {
    console.error("❌ TWILIO ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to send SMS!" });
  }
});

// -------------------------
// ADMIN PANEL ROUTES
// -------------------------
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/admin-login.html"));
});

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/admin-dashboard.html"));
});

// API for Admin Dashboard
app.get("/admin/api/data", async (req, res) => {
  try {
    const users = await User.find();
    const contacts = await Contact.find();
    const reports = await Report.find();
    const locations = await Location.find().sort({ timestamp: -1 });
    const sos = await SOS.find();

    res.json({ users, contacts, reports, locations, sos });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin data" });
  }
});

app.use("/admin", express.static(path.join(__dirname, "admin")));

app.get("/admin/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "admin-logout.html"));
});

// -------------------------
// START SERVER
// -------------------------
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);


