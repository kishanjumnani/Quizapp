import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/leaderboard")
      .then(response => setLeaderboard(response.data))
      .catch(error => console.error("Error fetching leaderboard:", error));
  }, []);

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>Responses</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className={index < 3 ? `top-${index + 1}` : ""}>
              <td>{getMedal(index + 1)} {index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>
                <button className="btn-view" onClick={() => navigate(`/results/${entry.username}`)}>
                  View Answers
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="leaderboard-buttons">
        <button className="btn-back" onClick={() => navigate("/")}>🏠 Home</button>
        <button className="btn-results" onClick={() => navigate(`/results/${localStorage.getItem("username")}`)}>📜 View My Results</button>
      </div>
    </div>
  );
};

export default Leaderboard;
