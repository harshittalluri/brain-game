// src/components/GameSelect.jsx
import { useNavigate } from "react-router-dom";
import "./GameSelect.css";

const games = [
  {
    id: "math",
    title: "Math Challenge",
    description: "Test your arithmetic speed across difficulty levels",
    icon: "🧮",
    path: "/math-levels",
    color: "#00e5ff",
    tag: "Numbers",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Fill the grid using logic and deduction",
    icon: "🔢",
    path: "/sudoku",
    color: "#ff4081",
    tag: "Logic",
  },
  {
    id: "memory",
    title: "Memory Flip",
    description: "Match pairs of cards before time runs out",
    icon: "🃏",
    path: "/memory",
    color: "#69f0ae",
    tag: "Memory",
  },
  {
    id: "word",
    title: "Word Scramble",
    description: "Unscramble the letters to find the hidden word",
    icon: "🔤",
    path: "/word-scramble",
    color: "#ffab40",
    tag: "Language",
  },
  {
    id: "typing",
    title: "Typing Speed",
    description: "Race against the clock — how fast can you type?",
    icon: "⌨️",
    path: "/typing",
    color: "#ce93d8",
    tag: "Speed",
  },
  {
    id: "2048",
    title: "2048",
    description: "Slide tiles and combine them to reach 2048!",
    icon: "🎯",
    path: "/2048",
    color: "#edc22e",
    tag: "Puzzle",
  },
  {
    id: "snake",
    title: "Snake",
    description: "Eat food, grow longer, don't hit the walls!",
    icon: "🐍",
    path: "/snake",
    color: "#69f0ae",
    tag: "Arcade",
  },
  {
    id: "ttt",
    title: "Tic Tac Toe",
    description: "Beat the unbeatable AI — if you can!",
    icon: "✖️",
    path: "/tictactoe",
    color: "#ce93d8",
    tag: "Strategy",
  },
];

export default function GameSelect() {
  const navigate = useNavigate();

  return (
    <div className="gs-wrapper">
      <div className="gs-header">
        <h1 className="gs-title">Choose Your Game</h1>
        <p className="gs-subtitle">Pick a challenge and sharpen your mind</p>
      </div>

      <div className="gs-grid">
        {games.map((game, i) => (
          <div
            key={game.id}
            className="gs-card"
            style={{ "--accent": game.color, animationDelay: `${i * 0.08}s` }}
            onClick={() => navigate(game.path)}
          >
            <span className="gs-tag">{game.tag}</span>
            <div className="gs-icon">{game.icon}</div>
            <h2 className="gs-card-title">{game.title}</h2>
            <p className="gs-card-desc">{game.description}</p>
            <button className="gs-btn">Play Now →</button>
          </div>
        ))}
      </div>
    </div>
  );
}