
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");

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

// Get all books (public)
router.get("/", async (req, res) => {
  try {
    res.json(await Book.find());
  } catch {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Get only the logged-in seller's books
router.get("/mine", auth, async (req, res) => {
  try {
    res.json(await Book.find({ seller: req.userId }));
  } catch {
    res.status(500).json({ message: "Failed to fetch your books" });
  }
});

// Get one book (public)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(400).json({ message: "Invalid book ID" });
  }
});

// Add book for logged-in seller
router.post("/", auth, async (req, res) => {
  try {
    const { title, author, price, category, description, image, stock } = req.body;
    const book = await Book.create({
      title, author, price, category, description, image, stock,
      seller: req.userId,
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({
      message: "Failed to add book",
      error: err.message,
    });
  }
});

// Update only your own book
router.patch("/:id", auth, async (req, res) => {
  try {
    const { title, author, price, category, description, image, stock } = req.body;
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, seller: req.userId },
      { title, author, price, category, description, image, stock },
      { new: true, runValidators: true }
    );

    if (!book)
      return res.status(404).json({ message: "Book not found or not yours" });

    res.json(book);
  } catch {
    res.status(400).json({ message: "Failed to update book" });
  }
});

// Delete only your own book
router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      seller: req.userId,
    });

    if (!book)
      return res.status(404).json({ message: "Book not found or not yours" });

    res.json({ message: "Book deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid book ID" });
  }
});

module.exports = router;
