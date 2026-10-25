
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const token = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

async function auth(req, res, next) {
  try {
    req.userId = jwt.verify(
      req.headers.authorization?.split(" ")[1],
      process.env.JWT_SECRET
    ).id;
    next();
  } catch {
    res.status(401).json({ message: "Please login first." });
  }
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6)
      return res.status(400).json({ message: "Enter valid details. Password must be 6+ characters." });

    const mail = email.trim().toLowerCase();
    if (await User.findOne({ email: mail }))
      return res.status(409).json({ message: "Email already registered." });

    const user = await User.create({
      name: name.trim(), email: mail,
      password: await bcrypt.hash(password, 10)
    });

    res.status(201).json({
      token: token(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
      return res.status(401).json({ message: "Invalid email or password." });

    res.json({
      token: token(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Could not load profile." });
  }
});

router.patch("/profile", auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name?.trim() || !email?.trim())
      return res.status(400).json({ message: "Name and email are required." });

    const mail = email.trim().toLowerCase();
    if (await User.findOne({ email: mail, _id: { $ne: req.userId } }))
      return res.status(409).json({ message: "Email already registered." });

    const user = await User.findByIdAndUpdate(
      req.userId, { name: name.trim(), email: mail },
      { new: true, runValidators: true }
    ).select("name email");

    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Could not update profile." });
  }
});

module.exports = router;
