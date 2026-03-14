import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="kid-container">
      <h1 className="kid-title">🎉 Welcome to Brain Game!</h1>

      <button className="kid-btn kid-easy" onClick={() => navigate("/math-levels")}>
        ➕ Math Games
      </button>

      <button className="kid-btn kid-medium" onClick={() => navigate("/sudoku")}>
        🧩 Sudoku
      </button>

      <button className="kid-btn kid-hard" onClick={() => navigate("/leaderboard")}>
        🏆 Leaderboard
      </button>
    </div>
  );
}

export default Welcome;
