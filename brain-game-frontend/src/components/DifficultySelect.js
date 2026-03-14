import { useNavigate } from "react-router-dom";
import "./DifficultySelect.css";

function DifficultySelect() {
  const navigate = useNavigate();

  const chooseLevel = (level) => {
    localStorage.setItem("math-level", level);
    navigate("/math");
  };

  return (
    <div className="difficulty-page">

      {/* CONFETTI */}
      <div className="confetti">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>

      {/* FLOATING BRAINS */}
      <div className="brains">
        <span>🧠</span>
        <span>🧠</span>
        <span>🧠</span>
        <span>🧠</span>
      </div>

      {/* FLOATING NUMBERS */}
      <div className="math-bg">
        <span>7</span>
        <span>3</span>
        <span>9</span>
        <span>5</span>
        <span>+</span>
        <span>×</span>
        <span>÷</span>
        <span>8</span>
        <span>4</span>
      </div>

      {/* SPARKLES */}
      <div className="sparkles">
        <span>✨</span>
        <span>✨</span>
        <span>✨</span>
        <span>✨</span>
        <span>✨</span>
      </div>

      <div className="difficulty-card">

        <h1 className="difficulty-title">Choose Difficulty 🎯</h1>

        <div className="levels">

          <button className="level easy" onClick={() => chooseLevel("easy")}>
            🟢 Easy
          </button>

          <button className="level medium" onClick={() => chooseLevel("medium")}>
            🟡 Medium
          </button>

          <button className="level hard" onClick={() => chooseLevel("hard")}>
            🔴 Hard
          </button>

        </div>

      </div>

    </div>
  );
}

export default DifficultySelect;