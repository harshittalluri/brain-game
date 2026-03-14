import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MathGame() {
  const navigate = useNavigate();

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("+");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [shake, setShake] = useState(false);

  // 🎵 Audio references
  const correctSound = useRef(null);
  const wrongSound = useRef(null);

  // Difficulty settings
  const difficulty = localStorage.getItem("math-level") || "easy";
  const limits = {
    easy: 10,
    medium: 30,
    hard: 60,
  };

  // Pick a random operator
  const randomOperation = () => {
    const ops = ["+", "-", "*", "/"];
    return ops[Math.floor(Math.random() * ops.length)];
  };

  // Generate random math problem
  const generateProblem = () => {
    setFeedback("");

    const max = limits[difficulty];
    let x = Math.floor(Math.random() * max) + 1;
    let y = Math.floor(Math.random() * max) + 1;
    let operation = randomOperation();

    // Ensure division is an INTEGER
    if (operation === "/") {
      y = Math.floor(Math.random() * (max - 1)) + 1; // divisor
      const multiplier = Math.floor(Math.random() * max) + 1;
      x = y * multiplier; // ensures perfect division
    }

    setA(x);
    setB(y);
    setOp(operation);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const correctAnswer = () => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return a / b; // safe, always integer now
      default: return 0;
    }
  };

  // Check user's answer
 const checkAnswer = () => {
  const correct = correctAnswer();

  if (Number(answer) === correct) {
    setScore(score + 1);
    setFeedback("🎉 Correct!");
    correctSound.current.play();

    // Move to next after 1 sec
    setTimeout(() => {
      setAnswer("");
      generateProblem();
    }, 1000);

  } else {
    setFeedback(`❌ Wrong! Correct answer: ${correct}`);
    wrongSound.current.play();

    // Shake
    setShake(true);
    setTimeout(() => setShake(false), 600);

    // Wait 2 seconds so user can see the correct answer
    setTimeout(() => {
      setAnswer("");
      generateProblem();
    }, 2000);
  }
};


  // Save score to backend
  const saveScore = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:8085/api/scores",
      { gameType: "MATH", score },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Score Saved!");
  };

  return (
    <div className="kid-container">

      {/* Audio files */}
      <audio ref={correctSound} src="/sounds/correct.mp3"></audio>
      <audio ref={wrongSound} src="/sounds/wrong.mp3"></audio>

      <h1 className="kid-title">Math Game ✨</h1>

      <h2 className="kid-subtitle">
        {a} {op} {b}
      </h2>

      <input
        className={`sudoku-cell ${shake ? "shake" : ""}`}
        style={{ width: "60%", marginBottom: "10px" }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter answer"
      />

      <button className="kid-btn kid-medium" onClick={checkAnswer}>
        Submit ✔
      </button>

      <p
  className={`feedback-text ${
    feedback.includes("Correct answer") ? "feedback-wrong" : "feedback-correct"
  }`}
>
  {feedback}
</p>


      <h3 className="kid-title">Score: {score}</h3>

      <button
        className="kid-btn"
        style={{ background: "#8df0ff" }}
        onClick={saveScore}
      >
        💾 Save Score
      </button>
    </div>
  );
}

export default MathGame;
