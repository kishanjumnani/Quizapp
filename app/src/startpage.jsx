import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StartPage.css";

const StartPage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (username.trim() === "") {
      alert("Please enter your name to start the quiz.");
      return;
    }
    localStorage.setItem("username", username); // Save name
    navigate("/quiz"); // Navigate to Quiz page
  };

  return (
    <div className="start-container">
      <h2>Welcome to the Quiz!</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleStart}>Start Quiz</button>
    </div>
  );
};

export default StartPage;
