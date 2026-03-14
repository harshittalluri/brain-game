import { useNavigate } from "react-router-dom";

function DifficultySelect() {
  const navigate = useNavigate();

  const chooseLevel = (level) => {
    localStorage.setItem("math-level", level);
    navigate("/math");
  };

  return (
    <div className="kid-container">
      <h1 className="kid-title">Choose Difficulty 🎯</h1>

      <button className="kid-btn kid-easy" onClick={() => chooseLevel("easy")}>
        🟢 Easy
      </button>

      <button className="kid-btn kid-medium" onClick={() => chooseLevel("medium")}>
        🟡 Medium
      </button>

      <button className="kid-btn kid-hard" onClick={() => chooseLevel("hard")}>
        🔴 Hard
      </button>
    </div>
  );
}

export default DifficultySelect;
