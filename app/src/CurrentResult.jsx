import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CurrentResults.css";

const CurrentResults = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [filteredAnswers, setFilteredAnswers] = useState([]); // Stores filtered answers
  const [topic, setTopic] = useState("Unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null); // Keeps track of selected subject
  const [subjectScores, setSubjectScores] = useState({ grammar: 0, attention: 0, math: 0 });

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      console.warn("⚠️ Username not found in localStorage.");
      setError("No username found. Please log in.");
    }
  }, [username]);

  const fetchLatestResponse = async () => {
    setShowResults(true);
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`http://localhost:5000/api/saved-response/${username}/latest`);
      console.log("📩 Latest Response:", data);

      if (data && data.responses) {
        setCurrentScore(data.score || 0);
        setAnswers(data.responses.filter(ans => ans && ans.answer)); // Removes null responses
        setFilteredAnswers(data.responses.filter(ans => ans && ans.answer)); // Initially show all answers
        setSubjectScores({
          grammar: data.subjectScores?.grammar || 0,
          attention: data.subjectScores?.attention || 0,
          math: data.subjectScores?.math || 0,
        });
        setTopic(data.responses?.[0]?.topic || "Unknown");
      } else {
        resetResults();
      }
    } catch (error) {
      console.error("❌ Error fetching latest response:", error);
      setError("⚠️ Error fetching score. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetResults = () => {
    setCurrentScore(0);
    setAnswers([]);
    setFilteredAnswers([]);
    setTopic("Unknown");
    setSubjectScores({ grammar: 0, attention: 0, math: 0 });
  };

  // Function to filter answers based on subject
  const filterBySubject = (subject) => {
    setSelectedSubject(subject);
    setFilteredAnswers(answers.filter(ans => ans.subject?.toLowerCase() === subject.toLowerCase()));
  };

  return (
    <div className="current-results-container">
      <h2>📊 Your Current Score</h2>

      {error && <p className="error-message">{error}</p>}

      <button className="btn-show-score" onClick={fetchLatestResponse} disabled={loading}>
        {loading ? "⏳ Loading..." : "🔍 Show Current Score & Responses"}
      </button>

      {showResults && !loading && (
        <>
          <p className="score-display"><strong>🏆 Score:</strong> {currentScore}</p>
          <p className="score-display">
            <strong>📘 Grammar:</strong> {subjectScores.grammar} | 
            <strong> 🎯 Attention:</strong> {subjectScores.attention} | 
            <strong> 🧮 Math:</strong> {subjectScores.math}
          </p>

          {/* Subject filter buttons */}
          <div className="filter-buttons">
            <button className="btn-filter" onClick={() => setFilteredAnswers(answers)}>🔄 All Subjects</button>
            <button className="btn-filter" onClick={() => filterBySubject("Grammar")}>📘 Grammar</button>
            <button className="btn-filter" onClick={() => filterBySubject("Attention")}>🎯 Attention</button>
            <button className="btn-filter" onClick={() => filterBySubject("Math")}>🧮 Math</button>
          </div>

          {filteredAnswers.length > 0 ? (
            <div className="answers-container">
              <h3>✅ Your Answers:</h3>
              <ul>
                {filteredAnswers.map((ans, index) => {
                  const isCorrect = ans.answer === ans.correctAnswer;
                  return (
                    <li key={index} className={`answer-item ${isCorrect ? "correct" : "incorrect"}`}>
                      <strong>Q{index + 1}:</strong> {ans.question}
                      <br />
                      {isCorrect ? (
                        <span className="correct-answer">✔ {ans.answer}</span>
                      ) : (
                        <span className="incorrect-answer">
                          ❌ Your Answer: {ans.answer} <br />
                          ✅ Correct Answer: {ans.correctAnswer}
                        </span>
                      )}
                      <br />
                      <strong>📖 Topic:</strong> {ans.topic || "Unknown"} <br />
                      <strong>📚 Subject:</strong> {ans.subject || "Unknown"}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="no-answers">⚠️ No responses found for {selectedSubject || "this subject"}.</p>
          )}
        </>
      )}

      <div className="buttons">
        <button className="btn-home" onClick={() => navigate("/")}>🏠 Home</button>
        <button className="btn-leaderboard" onClick={() => navigate("/leaderboard")}>🏆 Leaderboard</button>
      </div>
    </div>
  );
};

export default CurrentResults;
