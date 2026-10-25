
const mongoose = require("mongoose");

module.exports = mongoose.model("Shelf", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  books: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    status: { type: String, enum: ["Want to Read", "Currently Reading", "Completed"], default: "Want to Read" },
    progress: { type: Number, min: 0, max: 100, default: 0 }
  }]
}, { timestamps: true }));
