import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Results.css";

const Results = () => {
  const { username } = useParams(); // Get username from URL
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      setError("❌ Invalid username. Please check the URL.");
      return;
    }

    console.log(`Fetching results for: ${username}`);

    axios
      .get(`http://localhost:5000/api/results/${username}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching results:", error);

        if (error.response) {
          if (error.response.status === 404) {
            setError(`⚠️ No results found for ${username}.`);
          } else {
            setError("❌ Failed to load results. Please try again.");
          }
        } else {
          setError("❌ Network error. Check your connection.");
        }
      });
  }, [username]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!userData) {
    return <p className="loading-message">Loading results...</p>;
  }

  return (
    <div className="results-container">
      <h2>{userData.username}'s Quiz Attempts</h2>

      {userData.attempts.length === 0 ? (
        <p>No previous results found.</p>
      ) : (
        userData.attempts.map((attempt, index) => (
          <div key={index} className="attempt-card">
            <h3>Attempt {index + 1}</h3>
            <p>Score: {attempt.score} / {attempt.totalQuestions || "N/A"}</p>
            <p>Date: {new Date(attempt.date).toLocaleString()}</p>
            <button
              onClick={() => navigate(`/results/${username}/attempt/${index}`)}
              className="btn btn-blue"
            >
              View Details
            </button>
          </div>
        ))
      )}

      {/* Buttons Section */}
      <div className="buttons-container">
        <button onClick={() => navigate("/leaderboard")} className="btn btn-green">
          Leaderboard
        </button>
        <button onClick={() => navigate(`/responses/${username}`)} className="btn btn-yellow">
          Know Your Responses
        </button>
        <button onClick={() => navigate("/")} className="btn btn-red">
          Home
        </button>
      </div>
    </div>
  );
};

export default Results;
