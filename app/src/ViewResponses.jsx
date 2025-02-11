import { useEffect, useState } from "react";
import axios from "axios";
import './quiz.css';


const ViewResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/view-responses")
      .then((res) => {
        console.log("🔹 API Response:", res.data); // ✅ Debugging
        setResponses(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
        
      })
      .catch((err) => {
        console.error("❌ Error fetching responses:", err);
        setError("Failed to load responses. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading responses...</p>;
  if (error) return <p style={{ color: "red" }}>⚠️ {error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto",bgcolor: "#726E6D" }}>
      <h2>📋 All User Responses</h2>
      {responses.length === 0 ? (
        <p>No responses available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {responses.map((user, index) => {
            const bgColor = index % 2 === 0 ? "#f8f9fa" : "#e9ecef"; // Alternate background
            return (
              <li key={index} style={{
                  borderBottom: "2px solid #ccc",
                  paddingBottom: "10px",
                  marginBottom: "15px",
                  background: bgColor,
                  borderRadius: "8px",
                  padding: "10px",
                }}>
                <h3 style={{ marginBottom: "10px" , color:"#0C090A"}}>
                  🧑 {user.username} | 🏆 Score: 
                  <span style={{ fontWeight: "bold", color: "#726E6D" }}> {user.score}</span>
                </h3>
                <ul style={{ paddingLeft: "20px" }}>
                  {(user.responses || []).map((response, idx) => {
                    if (!response || !response.question || !response.correctAnswer) return null; // Prevent crashes
                    const isCorrect = response.answer === response.correctAnswer;
                    return (
                      <li key={idx} style={{
                          marginBottom: "10px",
                          padding: "8px",
                          background: isCorrect ? "#50C878" : "#E55451",
                          borderRadius: "5px",
                        }}>
                        <strong>Q:</strong> {response.question} <br />
                        <strong>Your Answer:</strong> 
                        <span style={{ fontWeight: "bold", color: isCorrect ? "green" : "red" }}>
                          {response.answer || "No Answer"} {isCorrect ? "✔️" : "❌"}
                        </span>
                        <br />
                        <strong>Correct Answer:</strong> 
                        <span style={{ color: "blue", fontWeight: "bold" }}>
                          {response.correctAnswer}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ViewResponses;
