// src/components/Welcome.js
import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import brainImage from "../assets/images/anime-brain.png";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">

      {/* Full screen background image */}
      <img src={brainImage} alt="Brain Game" className="brain-image" />

      {/* Buttons fixed to bottom-right */}
      <div className="welcome-buttons-box">
        <h1 className="welcome-title">🎮 Brain Game</h1>
        <p className="welcome-subtitle">Train your brain with fun challenges</p>
        <button className="btn all-games" onClick={() => navigate("/game")}>
          🕹️ All Games
        </button>
        <button className="btn leaderboard" onClick={() => navigate("/leaderboard")}>
          🏆 Leaderboard
        </button>
      </div>

    </div>
  );
}

export default Welcome;