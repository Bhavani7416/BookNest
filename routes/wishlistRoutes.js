const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Wishlist = require("../models/Wishlist");
const Book = require("../models/Book");

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Please login first." });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

// Get wishlist
router.get("/", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.userId,
    }).populate("books");

    res.json(wishlist || { books: [] });
  } catch (err) {
    res.status(500).json({ message: "Could not load wishlist." });
  }
});

// Add book to wishlist
router.post("/:bookId", auth, async (req, res) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.bookId)) {
      return res.status(400).json({
        message: "This book is not saved in the database.",
      });
    }

    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.userId },
      { $addToSet: { books: book._id }, $setOnInsert: { user: req.userId } },
      { upsert: true, new: true, runValidators: true }
    ).populate("books");

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Could not update wishlist." });
  }
});

// Remove book from wishlist
router.delete("/:bookId", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.userId },
      { $pull: { books: req.params.bookId } },
      { new: true }
    ).populate("books");

    res.json(wishlist || { books: [] });
  } catch (err) {
    res.status(500).json({ message: "Could not remove book." });
  }
});

module.exports = router;