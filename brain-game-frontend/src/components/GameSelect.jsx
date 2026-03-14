// src/components/GameSelect.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GameSelect.css";

const games = [
  { id:"math",       title:"Math Challenge", description:"Test your arithmetic speed across difficulty levels", icon:"🧮", path:"/math-levels",  color:"#00e5ff", tag:"Numbers"  },
  { id:"sudoku",     title:"Sudoku",         description:"Fill the grid using logic and deduction",            icon:"🔢", path:"/sudoku",        color:"#ff4081", tag:"Logic"    },
  { id:"memory",     title:"Memory Flip",    description:"Match pairs of cards before time runs out",          icon:"🃏", path:"/memory",        color:"#69f0ae", tag:"Memory"   },
  { id:"word",       title:"Word Scramble",  description:"Unscramble the letters to find the hidden word",     icon:"🔤", path:"/word-scramble", color:"#ffab40", tag:"Language" },
  { id:"typing",     title:"Typing Speed",   description:"Race against the clock — how fast can you type?",   icon:"⌨️", path:"/typing",        color:"#ce93d8", tag:"Speed"    },
  { id:"2048",       title:"2048",           description:"Slide tiles and combine them to reach 2048!",        icon:"🎯", path:"/2048",          color:"#edc22e", tag:"Puzzle"   },
  { id:"snake",      title:"Snake",          description:"Eat food, grow longer, don't hit the walls!",        icon:"🐍", path:"/snake",         color:"#69f0ae", tag:"Arcade"   },
  { id:"ttt",        title:"Tic Tac Toe",    description:"Beat the unbeatable AI — if you can!",               icon:"✖️", path:"/tictactoe",     color:"#ce93d8", tag:"Strategy" },
  { id:"comfycakes", title:"Comfy Cakes",    description:"Bake cakes to match the customer's order!",          icon:"🎂", path:"/comfy-cakes",   color:"#ff6b9d", tag:"Purble"   },
  { id:"purbleshop", title:"Purble Shop",    description:"Guess the hidden Purble's features!",                icon:"🎭", path:"/purble-shop",   color:"#c084fc", tag:"Purble"   },
  { id:"compuville", title:"Compu-Ville",    description:"Match all emoji pairs to build your village!",       icon:"🏘️", path:"/compu-ville",   color:"#34d399", tag:"Purble"   },
];

const ALL_TAGS = ["All", ...new Set(games.map(g => g.tag))];

export default function GameSelect() {
  const navigate   = useNavigate();
  const [filter, setFilter] = useState("All");

  const visible = filter === "All" ? games : games.filter(g => g.tag === filter);

  return (
    <div className="gs-wrapper">

      {/* ── HERO ── */}
      <div className="gs-hero">
        <div className="gs-hero-scanlines" />
        <div className="gs-hero-content">
          <div className="gs-hero-tag">🎮 Brain Game Arena</div>
          <h1 className="gs-hero-title">
            CHOOSE YOUR<br /><span>GAME</span>
          </h1>
          <p className="gs-hero-sub">
            {games.length} games available &nbsp;·&nbsp; All free &nbsp;·&nbsp; Compete on the leaderboard
          </p>
          <div className="gs-hero-cta">
            <button className="gs-hero-btn primary" onClick={() => navigate(games[0].path)}>
              ▶ Play Now
            </button>
            <button className="gs-hero-btn secondary" onClick={() => navigate("/leaderboard")}>
              🏆 Leaderboard
            </button>
          </div>
        </div>
        <div className="gs-hero-stats">
          <div className="gs-hero-stat">
            <span className="gs-hero-stat-num">{games.length}</span>
            <span className="gs-hero-stat-label">Games</span>
          </div>
          <div className="gs-hero-stat">
            <span className="gs-hero-stat-num">{ALL_TAGS.length - 1}</span>
            <span className="gs-hero-stat-label">Categories</span>
          </div>
          <div className="gs-hero-stat">
            <span className="gs-hero-stat-num">FREE</span>
            <span className="gs-hero-stat-label">Always</span>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="gs-filter-bar">
        <span className="gs-filter-label">Filter:</span>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            className={`gs-filter-btn ${filter === tag ? "active" : ""}`}
            onClick={() => setFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── GAME GRID ── */}
      <div className="gs-section">
        <div className="gs-section-header">
          <h2 className="gs-section-title">All Games</h2>
          <div className="gs-section-line" />
          <span className="gs-section-count">{visible.length} titles</span>
        </div>

        <div className="gs-grid">
          {visible.map((game, i) => (
            <div
              key={game.id}
              className="gs-card"
              style={{ "--accent": game.color, animationDelay: `${i * 0.06}s` }}
              onClick={() => navigate(game.path)}
            >
              {/* Image area */}
              <div className="gs-card-img">
                <div className="gs-card-badge">FREE</div>
                <span className="gs-tag">{game.tag}</span>
                <div className="gs-card-img-icon">{game.icon}</div>
              </div>

              {/* Body */}
              <div className="gs-card-body">
                <h2 className="gs-card-title">{game.title}</h2>
                <p className="gs-card-desc">{game.description}</p>
                <div className="gs-card-footer">
                  <span className="gs-card-free">FREE</span>
                  <button className="gs-btn" onClick={e => { e.stopPropagation(); navigate(game.path); }}>
                    Play →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}