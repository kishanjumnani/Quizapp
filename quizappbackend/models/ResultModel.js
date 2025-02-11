const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  username: String,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

const Result = mongoose.model("Result", ResultSchema);
module.exports = Result;
