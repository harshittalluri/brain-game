import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import brainImage from "../assets/images/brain imagesss.png";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">

      <div className="welcome-wrapper">

        {/* LEFT SIDE IMAGE */}
        <div className="image-section">
          <img
            src={brainImage}
            alt="Brain Game"
            className="brain-image"
          />
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="content-section">

          <h1 className="welcome-title">🎮 Brain Game</h1>

          <p className="welcome-subtitle">
            Train your brain with fun challenges
          </p>

          <div className="welcome-buttons">

            <button
              className="btn math"
              onClick={() => navigate("/math-levels")}
            >
              ➕ Math Games
            </button>

            <button
              className="btn sudoku"
              onClick={() => navigate("/sudoku")}
            >
              🧩 Sudoku
            </button>

            <button
              className="btn leaderboard"
              onClick={() => navigate("/leaderboard")}
            >
              🏆 Leaderboard
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Welcome;