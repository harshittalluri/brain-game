import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

const GAMES = [
  { key: "MATH",         label: "Math Challenge", icon: "🧮", color: "#00e5ff" },
  { key: "SUDOKU",       label: "Sudoku",         icon: "🔢", color: "#ff4081" },
  { key: "MEMORY",       label: "Memory Flip",    icon: "🃏", color: "#69f0ae" },
  { key: "WORD_SCRAMBLE",label: "Word Scramble",  icon: "🔤", color: "#ffab40" },
  { key: "TYPING",       label: "Typing Speed",   icon: "⌨️", color: "#ce93d8" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

function Leaderboard() {
  const navigate  = useNavigate();
  const [scores,  setScores]  = useState({});
  const [active,  setActive]  = useState("MATH");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    setLoading(true);
    axios
      .get(`http://localhost:8085/api/scores/${active}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setScores((prev) => ({ ...prev, [active]: res.data })))
      .catch(() => alert("Error loading leaderboard"))
      .finally(() => setLoading(false));
  }, [active, navigate]);

  const currentScores = scores[active] || [];
  const activeGame    = GAMES.find((g) => g.key === active);

  return (
    <div className="lb-wrap">
      {/* Header */}
      <div className="lb-header">
        <h1 className="lb-title">🏆 Leaderboard</h1>
        <p className="lb-subtitle">Top players across all games</p>
      </div>

      {/* Game Tabs */}
      <div className="lb-tabs">
        {GAMES.map((g) => (
          <button
            key={g.key}
            className={`lb-tab ${active === g.key ? "active" : ""}`}
            style={{ "--accent": g.color }}
            onClick={() => setActive(g.key)}
          >
            {g.icon} {g.label}
          </button>
        ))}
      </div>

      {/* Scores Table */}
      <div className="lb-card" style={{ "--accent": activeGame.color }}>
        <div className="lb-card-header">
          <span className="lb-game-icon">{activeGame.icon}</span>
          <span className="lb-game-name">{activeGame.label}</span>
        </div>

        {loading ? (
          <div className="lb-loading">Loading…</div>
        ) : currentScores.length === 0 ? (
          <div className="lb-empty">No scores yet. Be the first! 🎮</div>
        ) : (
          <div className="lb-list">
            {/* Column headers */}
            <div className="lb-row lb-row-header">
              <span>Rank</span>
              <span>Player</span>
              <span>Score</span>
            </div>

            {currentScores.map((item, i) => (
              <div
                key={i}
                className={`lb-row ${i < 3 ? "top" : ""}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="lb-rank">
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </span>
                <span className="lb-name">{item[0]}</span>
                <span className="lb-score" style={{ color: activeGame.color }}>
                  {item[1]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
