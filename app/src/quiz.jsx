import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [totalScore, setTotalScore] = useState(0);
  const [grammarScore, setGrammarScore] = useState(0);
  const [attentionScore, setAttentionScore] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [loading, setLoading] = useState(false); // Prevent multiple submissions

  useEffect(() => {
    axios.get("http://localhost:5000/api/questions")
      .then((response) => {
        setQuestions(response.data.questions || response.data);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerClick = (answer) => {
    setResponses((prev) => {
      const updatedResponses = [...prev];
      const question = questions[currentQuestion];
      const isCorrect = answer === question.answer;

      if (isCorrect) {
        setTotalScore((prev) => prev + 1);
        if (question.subject?.toLowerCase() === "grammar") {
          setGrammarScore((prev) => prev + 1);
        } else if (question.subject?.toLowerCase() === "attention") {
          setAttentionScore((prev) => prev + 1);
        } else if (question.subject?.toLowerCase() === "math") {
          setMathScore((prev) => prev + 1);
        }
      }

      updatedResponses[currentQuestion] = {
        question: question.question,
        topic: question.topic || "Unknown",
        subject: question.subject || "Unknown",
        answer,
        correctAnswer: question.answer,
      };
      return updatedResponses;
    });

    setSkippedQuestions((prev) => prev.filter((q) => q !== currentQuestion));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (!skippedQuestions.includes(currentQuestion)) {
      setSkippedQuestions((prev) => [...prev, currentQuestion]);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleFinish = async () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    alert(`Final Score: ${totalScore}\nGrammar: ${grammarScore}\nAttention: ${attentionScore}\nMath: ${mathScore}`);

    try {
      await axios.post("http://localhost:5000/api/save-response", {
        username: localStorage.getItem("username") || "Guest",
        scores: { totalScore, grammarScore, attentionScore, mathScore },
        responses,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting responses:", error);
      alert("Failed to submit responses. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <div className="timer-container">
        <h5>⏳ Time Left: <span className="timer-text">{formatTime(timeLeft)}</span></h5>
      </div>
      <div className="quiz-wrap">
        <div className="dashboard-container">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`jump-button ${
                responses[index]
                  ? "btn-answered"
                  : skippedQuestions.includes(index)
                  ? "btn-skipped"
                  : index === currentQuestion
                  ? "btn-selected"
                  : "btn-unanswered"
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="question-container">
          <h3>Question {currentQuestion + 1} of {questions.length}</h3>
          <h5>📚 Subject: {questions[currentQuestion]?.subject}</h5>
          <h6>📝 Topic: {questions[currentQuestion]?.topic}</h6>
          <p>{questions[currentQuestion]?.question}</p>
          {questions[currentQuestion]?.options?.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(opt)}
              className={`answer-button ${responses[currentQuestion]?.answer === opt ? "selected" : ""}`}
            >
              {opt}
            </button>
          ))}

          <div className="btn-group">
            <button onClick={handleSkip} className="btn-skip">Skip</button>
            {currentQuestion === questions.length - 1 ? (
              <button onClick={handleFinish} className="btn-finish" disabled={loading}>
                {loading ? "Submitting..." : "Finish"}
              </button>
            ) : (
              <button onClick={handleNext} className="btn-next">Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
