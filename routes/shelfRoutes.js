
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Shelf = require("../models/Shelf");

router.use((req, res, next) => {
  try {
    req.userId = jwt.verify(req.headers.authorization?.split(" ")[1], process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ message: "Please login first." });
  }
});

router.get("/", async (req, res) => {
  try {
    res.json(await Shelf.findOne({ user: req.userId }).populate("books.book") || { books: [] });
  } catch {
    res.status(500).json({ message: "Could not load shelf." });
  }
});

router.put("/", async (req, res) => {
  try {
    const shelf = await Shelf.findOneAndUpdate(
      { user: req.userId },
      { user: req.userId, books: req.body.books },
      { upsert: true, new: true, runValidators: true }
    ).populate("books.book");
    res.json(shelf);
  } catch {
    res.status(400).json({ message: "Could not save shelf. Check book IDs and progress." });
  }
});

module.exports = router;
