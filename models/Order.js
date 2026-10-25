
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, default: "Placed" },
  paymentMethod: { type: String, default: "COD" },
  paymentStatus: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
