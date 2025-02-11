import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import ErrorBoundary from "./ErrorBoundary";

const Dashboard = () => {
  const navigate = useNavigate();

  // Navigate to the Leaderboard page
  const handleOnClickLeaderboard = () => {
    navigate("/leaderboard");
  };

  // Navigate to the Current Results page
  const handleOnClickCurrent = () => {
    navigate("/current-results");
  };

  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard</h2>

      <div className="dashboard-buttons">
        <button className="btn-quiz" onClick={() => navigate("/quiz")}>
          📝 Start Quiz
        </button>

        {/* Wrapped in ErrorBoundary */}
        <ErrorBoundary>
          <button className="btn-current-results" onClick={handleOnClickCurrent}>
            📊 View My Current Score
          </button>
        </ErrorBoundary>

        <button className="btn-leaderboard" onClick={handleOnClickLeaderboard}>
          🏆 View Leaderboard
        </button> 
      </div>
    </div>
  );
};

export default Dashboard;
