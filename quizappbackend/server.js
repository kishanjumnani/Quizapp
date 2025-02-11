// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 5000;

// // ✅ CORS Configuration
// const allowedOrigins = ["http://localhost:5000", "http://localhost:5173"];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("❌ CORS Policy: Origin Not Allowed"));
//       }
//     },
//     credentials: true,
//   })
// );

// // ✅ Middleware
// app.use(express.json());

// // ✅ Connect to MongoDB
// mongoose
//   .connect("mongodb://127.0.0.1:27017/quizapp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // ✅ Define Schema & Model
// const ResponseSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true },
//     score: { type: Number, default: 0 },
//     subjectScores: { type: Object, default: {} },
//     responses: [
//       {
//         question: { type: String, required: true },
//         answer: { type: String, required: true },
//         correctAnswer: { type: String, required: true },
//         topic: { type: String, required: true },
//         subject: { type: String, required: true },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const ResponseModel = mongoose.model("Response", ResponseSchema); // ✅ Fixed missing model

// // ✅ Load Questions from JSON File
// const questionsFile = path.join(__dirname, "questions.json");
// let questions = [];

// if (fs.existsSync(questionsFile)) {
//   try {
//     const fileData = fs.readFileSync(questionsFile, "utf8");
//     questions = JSON.parse(fileData).questions || [];
//     console.log(`✅ Loaded ${questions.length} questions from file.`);
//   } catch (error) {
//     console.error("❌ Error loading questions.json:", error);
//   }
// } else {
//   console.warn("⚠️ Warning: questions.json not found!");
// }

// // ✅ API to Fetch Questions
// app.get("/api/questions", (req, res) => {
//   res.json({ questions: questions.length ? questions : "No questions available" });
// });

// // ✅ API to Save Quiz Response
// app.post("/api/save-response", async (req, res) => {
//   try {
//     console.log("📩 Received request body:", req.body);

//     const { username, responses } = req.body;
//     if (!username || !Array.isArray(responses)) {
//       return res.status(400).json({ error: "❌ Invalid input data." });
//     }

//     let score = 0;
//     let subjectScores = {};

//     responses.forEach((r) => {
//       if (!r || !r.subject) {
//         console.error("❌ Invalid response object:", r);
//         return;
//       }

//       if (!subjectScores[r.subject]) subjectScores[r.subject] = 0;
//       if (r.answer === r.correctAnswer) {
//         score += 1;
//         subjectScores[r.subject] += 1;
//       }
//     });

//     const newResponse = new ResponseModel({ username, score, subjectScores, responses });
//     await newResponse.save();
//     res.status(201).json({ message: "✅ Response saved successfully!" });

//   } catch (error) {
//     console.error("❌ Error saving response:", error);
//     res.status(500).json({ error: "❌ Internal server error.", details: error.message });
//   }
// });

// // app.post("/api/save-response", async (req, res) => {
// //   try {
// //     console.log("📩 Received request body:", req.body);

// //     const { username, responses } = req.body;
// //     if (!username || !Array.isArray(responses)) {
// //       return res.status(400).json({ error: "❌ Invalid input data." });
// //     }

// //     let score = 0;
// //     let subjectScores = {};

// //     responses.forEach((r) => {
// //       if (!subjectScores[r.subject]) subjectScores[r.subject] = 0;
// //       if (r.answer === r.correctAnswer) {
// //         score += 1;
// //         subjectScores[r.subject] += 1;
// //       }
// //     });

// //     const newResponse = new ResponseModel({ username, score, subjectScores, responses });
// //     await newResponse.save();
// //     res.status(201).json({ message: "✅ Response saved successfully!" });
// //   } catch (error) {
// //     console.error("❌ Error saving response:", error);
// //     res.status(500).json({ error: "❌ Internal server error.", details: error.message });
// //   }
// // });

// // ✅ API to Fetch All Quiz Responses
// app.get("/api/view-responses", async (req, res) => {
//   try {
//     const responses = await ResponseModel.find().sort({ createdAt: -1 });
//     res.json(responses);
//   } catch (error) {
//     console.error("❌ Error fetching responses:", error);
//     res.status(500).json({ error: "❌ Failed to fetch responses." });
//   }
// });

// // ✅ API to Fetch Latest Score for a User
// // app.get("/api/saved-response/:username/latest", async (req, res) => {
// //   try {
// //     const { username } = req.params;
// //     const latestResponse = await ResponseModel.findOne({ username }).sort({ createdAt: -1 });

// //     if (!latestResponse) {
// //       return res.status(404).json({ message: "⚠️ No saved responses found for this user." });
// //     }

// //     res.json({
// //       score: latestResponse.score,
// //       subjectScores: latestResponse.subjectScores,
// //       responses: latestResponse.responses,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error fetching latest saved response:", error);
// //     res.status(500).json({ message: "❌ Server error, please try again later." });
// //   }
// // });
// app.get("/api/saved-response/:username/latest", async (req, res) => {
//   const { username } = req.params;

//   console.log("🔍 Fetching latest response for:", username);
//   console.log("🛠️ Response Model:", Response); // ✅ Check if the model is recognized

//   try {
//     const userResponse = await Response.findOne({ username }).sort({ _id: -1 });

//     if (!userResponse) {
//       return res.status(404).json({ error: "No response found for this user" });
//     }

//     res.json(userResponse);
//   } catch (error) {
//     console.error("❌ Error fetching response:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });



// // ✅ Start the Server
// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// ✅ CORS Configuration
const allowedOrigins = ["http://localhost:5000", "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ CORS Policy: Origin Not Allowed"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/quizapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Schema & Model
const ResponseSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    score: { type: Number, default: 0 },
    subjectScores: { type: Object, default: {} },
    responses: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        correctAnswer: { type: String, required: true },
        topic: { type: String, required: true },
        subject: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const ResponseModel = mongoose.model("Response", ResponseSchema); // ✅ Fixed Model Reference
consol.log("kishan");
// ✅ API to Fetch Latest Score for a User
app.get("/api/saved-response/:username/latest", async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`🔍 Fetching latest response for: ${username}`);

    const latestResponse = await ResponseModel.findOne({ username }).sort({ createdAt: -1 });

    if (!latestResponse) {
      console.warn(`⚠️ No saved response found for user: ${username}`);
      return res.status(404).json({ error: "No response found for this user" });
    }

    res.json({
      score: latestResponse.score,
      subjectScores: latestResponse.subjectScores,
      responses: latestResponse.responses,
    });
  } catch (error) {
    console.error("❌ Error fetching response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start the Server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
