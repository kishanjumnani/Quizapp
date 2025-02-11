const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  username: String,
  score: Number,
  responses: [
    {
      question: String,
      answer: String,
      correctAnswer: String,
    },
  ],
});

const ResponseModel = mongoose.model("Response", responseSchema);
module.exports = ResponseModel;
