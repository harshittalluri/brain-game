import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./MathGame.css";

function MathGame() {

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("+");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [shake, setShake] = useState(false);

  const correctSound = useRef(null);
  const wrongSound = useRef(null);

  const difficulty = localStorage.getItem("math-level") || "easy";

  const limits = {
    easy: 10,
    medium: 30,
    hard: 60
  };

  const randomOperation = () => {
    const ops = ["+", "-", "*", "/"];
    return ops[Math.floor(Math.random() * ops.length)];
  };

  const generateProblem = () => {

    setFeedback("");

    const max = limits[difficulty];

    let x = Math.floor(Math.random() * max) + 1;
    let y = Math.floor(Math.random() * max) + 1;
    let operation = randomOperation();

    if (operation === "/") {
      y = Math.floor(Math.random() * (max - 1)) + 1;
      const multiplier = Math.floor(Math.random() * max) + 1;
      x = y * multiplier;
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
      case "/": return a / b;
      default: return 0;
    }

  };

  const checkAnswer = () => {

    const correct = correctAnswer();

    if (Number(answer) === correct) {

      setScore(score + 1);
      setFeedback("🎉 Correct!");

      correctSound.current.play();

      setTimeout(() => {
        setAnswer("");
        generateProblem();
      }, 1000);

    } else {

      setFeedback(`❌ Wrong! Correct answer: ${correct}`);

      wrongSound.current.play();

      setShake(true);
      setTimeout(() => setShake(false), 600);

      setTimeout(() => {
        setAnswer("");
        generateProblem();
      }, 2000);
    }
  };

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

    <div className="math-page">

      <audio ref={correctSound} src="/sounds/correct.mp3" />
      <audio ref={wrongSound} src="/sounds/wrong.mp3" />

      <div className="math-card">

        <h1 className="math-title">🧠 Math Challenge</h1>

        <div className="math-question">
          {a} {op} {b}
        </div>

        <input
          className={`math-input ${shake ? "shake" : ""}`}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer"
        />

        <button className="math-submit" onClick={checkAnswer}>
          ✔ Submit
        </button>

        <p className="math-feedback">{feedback}</p>

        <div className="score">Score : {score}</div>

        <button className="save-btn" onClick={saveScore}>
          💾 Save Score
        </button>

      </div>

    </div>
  );
}

export default MathGame;