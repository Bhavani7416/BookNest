
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
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

router.post("/", auth, async (req, res) => {
  try {
    const items = [];
    let total = 0;

    for (const i of req.body.items || []) {
      if (!/^[a-f\d]{24}$/i.test(i.book || "") ||
          !Number.isInteger(i.quantity) || i.quantity < 1)
        return res.status(400).json({ message: "Invalid order items." });

      const book = await Book.findById(i.book);
      if (!book) return res.status(400).json({ message: "Book not found." });

      items.push({ book: book._id, quantity: i.quantity });
      total += book.price * i.quantity;
    }

    if (!items.length)
      return res.status(400).json({ message: "Your order is empty." });

    const paymentMethod = ["COD", "Online"].includes(req.body.paymentMethod)
      ? req.body.paymentMethod : "COD";

    res.status(201).json(await Order.create({
      user: req.userId, items, total, paymentMethod,
      paymentStatus: "Pending"
    }));
  } catch {
    res.status(500).json({ message: "Could not place order." });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    res.json(await Order.find({ user: req.userId })
      .populate("items.book").sort({ createdAt: -1 }));
  } catch {
    res.status(500).json({ message: "Could not load orders." });
  }
});

router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id, user: req.userId
    });
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.status === "Cancelled")
      return res.status(400).json({ message: "Order already cancelled." });

    order.status = "Cancelled";
    await order.save();
    res.json({ message: "Order cancelled successfully.", order });
  } catch {
    res.status(500).json({ message: "Could not cancel order." });
  }
});

module.exports = router;
