const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  responses: [
    {
      question: String,
      answer: String,
      correctAnswer: String,
      topic: String,
      subject: String,
    }
  ],
  subjectScores: {
    grammar: { type: Number, default: 0 },
    attention: { type: Number, default: 0 },
    math: { type: Number, default: 0 },
  },
}, { timestamps: true });

const Response = mongoose.model("Response", ResponseSchema);

module.exports = Response; // ✅ Make sure this
