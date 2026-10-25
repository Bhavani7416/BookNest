
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const Book = require("../models/Book");

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.id;
    next();
  } catch {
    res.status(401).json({ message: "Please login first." });
  }
}

router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.book");
    res.json(cart || { items: [] });
  } catch {
    res.status(500).json({ message: "Could not load cart." });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const items = [];
    for (const item of req.body.items || []) {
      const bookId = item.book || item._id || item.id;
      if (!bookId || !Number.isInteger(item.quantity) || item.quantity < 1)
        return res.status(400).json({ message: "Invalid cart item." });

      const book = await Book.findById(bookId);
      if (!book) return res.status(400).json({ message: "Book not found." });

      items.push({ book: book._id, quantity: item.quantity });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.userId },
      { user: req.userId, items },
      { upsert: true, new: true, runValidators: true }
    ).populate("items.book");

    res.json(cart);
  } catch {
    res.status(500).json({ message: "Could not save cart." });
  }
});

module.exports = router;
