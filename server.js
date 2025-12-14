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
app.use(express.static(path.join(__dirname, "public")));

// -------------------------
// MONGODB CONNECTION
// -------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/womenSafetyDB")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// -------------------------
// SCHEMAS
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
  createdAt: { type: Date, default: Date.now },
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

const sosSchema = new mongoose.Schema({
  number: String,
  createdAt: { type: Date, default: Date.now },
});

// -------------------------
// MODELS
// -------------------------
const User = mongoose.model("User", userSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Report = mongoose.model("Report", reportSchema);
const Location = mongoose.model("Location", locationSchema);
const SOS = mongoose.model("SOS", sosSchema);

// -------------------------
// TWILIO CONFIG
// -------------------------
const client = twilio(
  "ACdcc4e29be67cdd74cd11c0dcc0802415",
  "4316c0cf5e1b7609af8f3bbb58284b01"
);

const TWILIO_NUMBER = "+17277613924";

// -------------------------
// AUTH ROUTES
// -------------------------
app.post("/signup", async (req, res) => {
  try {
    const exists = await User.findOne({
      email: req.body.email.toLowerCase().trim(),
    });

    if (exists)
      return res.status(400).json({ message: "Email already registered!" });

    await User.create(req.body);
    res.json({ message: "Signup successful!" });
  } catch {
    res.status(500).json({ message: "Signup failed!" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email.toLowerCase().trim(),
    });

    if (!user)
      return res.status(400).json({ message: "User not found!" });

    if (user.password !== req.body.password)
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
    res.status(500).json({ message: "Login error!" });
  }
});

// -------------------------
// CONTACT FORM
// -------------------------
app.post("/contact", async (req, res) => {
  try {
    await Contact.create(req.body);
    res.json({ message: "Message sent successfully!" });
  } catch {
    res.status(500).json({ message: "Failed to send message!" });
  }
});

// -------------------------
// EMERGENCY REPORT
// -------------------------
app.post("/report", async (req, res) => {
  try {
    await Report.create(req.body);
    res.json({ message: "Emergency alert sent!" });
  } catch {
    res.status(500).json({ message: "Emergency alert failed!" });
  }
});

// -------------------------
// LIVE LOCATION
// -------------------------
app.post("/api/location", async (req, res) => {
  try {
    await Location.create(req.body);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

app.get("/api/locations", async (req, res) => {
  const locations = await Location.find().sort({ timestamp: -1 });
  res.json(locations);
});

// -------------------------
// SOS CONTACT & SMS
// -------------------------
app.post("/save-sos", async (req, res) => {
  try {
    await SOS.create({ number: req.body.number });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

app.post("/send-sos", async (req, res) => {
  try {
    await client.messages.create({
      body: "🚨 SOS ALERT! Immediate help needed!",
      from: TWILIO_NUMBER,
      to: req.body.number,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// -------------------------
// ADMIN PANEL
// -------------------------
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/admin-login.html"));
});

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/admin-dashboard.html"));
});

app.get("/admin/api/data", async (req, res) => {
  const users = await User.find();
  const contacts = await Contact.find();
  const reports = await Report.find();
  const locations = await Location.find().sort({ timestamp: -1 });
  const sos = await SOS.find();

  res.json({ users, contacts, reports, locations, sos });
});

app.get("/admin/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/admin-logout.html"));
});

// -------------------------
// START SERVER
// -------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});




