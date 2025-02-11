import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartPage from "./StartPage";
import Quiz from "./quiz";
import Dashboard from "./Dashboard.jsx";
import Leaderboard from "./Leaderboard";
import Results from "./results.jsx";  // ✅ Correct capitalization
import CurrentResults from "./CurrentResult"; // Import the new component
import ViewResponses from "./ViewResponses";  // ✅ Ensure file exists

import "./app.css";

const App = () => {
  // const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      {/* <div className={darkMode ? "dark-mode" : "light-mode"}>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button> */}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/dashboard" element={<Dashboard />} />  {/* ✅ Added Dashboard Route */}
        <Route path="/results/:username" element={<Results />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/ViewResponses" element={<ViewResponses />} />
        <Route path="/current-results" element={<CurrentResults />} />
<Route path="*" element={<h2>Page Not Found</h2>} />
        
        <Route path="*" element={<h2>Page Not Found</h2>} />

       

      </Routes>

    </Router>
  );
};

export default App;
