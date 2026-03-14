// src/components/PurbleShop.jsx
import { useState, useCallback } from "react";
import axios from "axios";
import "./Purbleshop.css";

const DIFFICULTIES = {
  easy:   { features: 2, colors: 3, maxGuesses: 8, label: "Easy"   },
  medium: { features: 3, colors: 4, maxGuesses: 6, label: "Medium" },
  hard:   { features: 4, colors: 5, maxGuesses: 5, label: "Hard"   },
};

const FEATURE_NAMES  = ["Eyes", "Nose", "Mouth", "Hat"];
const FEATURE_EMOJIS = [
  ["👁️","😳","🥺","😎"],   // eyes
  ["👃","🐽","✨","🔴"],    // nose
  ["😊","😁","😐","😶"],    // mouth
  ["🎩","👒","🪖","🎓"],    // hat
];
const COLORS = ["🟣","🔵","🟢","🟡","🔴"];
const COLOR_NAMES = ["Purple","Blue","Green","Yellow","Red"];

function makeAnswer(cfg) {
  return Array.from({ length: cfg.features }, (_, fi) =>
    Math.floor(Math.random() * cfg.colors)
  );
}

function getHints(guess, answer) {
  // Returns array of: "correct" | "present" | "absent"  (like Mastermind)
  const hints = Array(guess.length).fill("absent");
  const ansLeft = [...answer];
  // First pass: correct positions
  guess.forEach((v, i) => { if (v === answer[i]) { hints[i] = "correct"; ansLeft[i] = -1; } });
  return hints;
}

export default function PurbleShop() {
  const [diff,    setDiff]    = useState(null);
  const [answer,  setAnswer]  = useState(null);
  const [current, setCurrent] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [status,  setStatus]  = useState("playing"); // playing|won|lost
  const [score,   setScore]   = useState(0);
  const [saved,   setSaved]   = useState(false);

  const saveScore = useCallback(async (s) => {
    const token = localStorage.getItem("token");
    if (!token || saved) return;
    try {
      await axios.post("http://localhost:8085/api/scores",
        { game: "PURBLE_SHOP", score: s },
        { headers: { Authorization: `Bearer ${token}` } });
      setSaved(true);
    } catch(e) { console.error(e); }
  }, [saved]);

  const startGame = (d) => {
    const cfg = DIFFICULTIES[d];
    setDiff(d);
    setAnswer(makeAnswer(cfg));
    setCurrent(Array(cfg.features).fill(0));
    setGuesses([]);
    setStatus("playing");
    setSaved(false);
  };

  const cycleFeature = (fi) => {
    if (status !== "playing") return;
    const cfg = DIFFICULTIES[diff];
    setCurrent(p => p.map((v, i) => i === fi ? (v + 1) % cfg.colors : v));
  };

  const submitGuess = () => {
    const cfg = DIFFICULTIES[diff];
    const hints = getHints(current, answer);
    const newGuesses = [...guesses, { values: [...current], hints }];
    setGuesses(newGuesses);

    const won = hints.every(h => h === "correct");
    if (won) {
      const pts = Math.max(10, (cfg.maxGuesses - newGuesses.length + 1) * 20);
      setScore(pts);
      setStatus("won");
      saveScore(pts);
    } else if (newGuesses.length >= cfg.maxGuesses) {
      setStatus("lost");
      saveScore(0);
    }
    setCurrent(Array(cfg.features).fill(0));
  };

  if (!diff) return (
    <div className="ps-wrap">
      <h1 className="ps-title">🎭 Purble Shop</h1>
      <p className="ps-sub">Guess the hidden Purble's features!</p>
      <div className="ps-diff-grid">
        {Object.entries(DIFFICULTIES).map(([key, cfg]) => (
          <button key={key} className={`ps-diff-btn ${key}`} onClick={() => startGame(key)}>
            <span>{key==="easy"?"🟢":key==="medium"?"🟡":"🔴"}</span>
            <strong>{cfg.label}</strong>
            <span className="ps-diff-desc">{cfg.features} features · {cfg.colors} colors · {cfg.maxGuesses} guesses</span>
          </button>
        ))}
      </div>
    </div>
  );

  const cfg = DIFFICULTIES[diff];

  return (
    <div className="ps-wrap">
      <div className="ps-topbar">
        <h1 className="ps-title-sm">🎭 Purble Shop</h1>
        <span className="ps-guesses-left">
          {cfg.maxGuesses - guesses.length} guesses left
        </span>
        <button className="ps-btn outline sm" onClick={() => setDiff(null)}>Menu</button>
      </div>

      {/* Result banner */}
      {status === "won" && (
        <div className="ps-banner won">
          🎉 You got it in {guesses.length} guess{guesses.length!==1?"es":""}! +{score} pts
          <button onClick={() => startGame(diff)}>Play Again</button>
        </div>
      )}
      {status === "lost" && (
        <div className="ps-banner lost">
          😢 The answer was: {answer.map((v, i) => FEATURE_EMOJIS[i][v]).join(" ")}
          <button onClick={() => startGame(diff)}>Try Again</button>
        </div>
      )}

      <div className="ps-main">
        {/* Guess history */}
        <div className="ps-history">
          <h3>Guess History</h3>
          {guesses.length === 0 && <p className="ps-empty">No guesses yet</p>}
          {guesses.map((g, gi) => (
            <div key={gi} className="ps-guess-row">
              <span className="ps-guess-num">#{gi+1}</span>
              {g.values.map((v, fi) => (
                <span key={fi} className={`ps-guess-cell ${g.hints[fi]}`}>
                  {FEATURE_EMOJIS[fi][v]}
                </span>
              ))}
              <div className="ps-hints">
                {g.hints.map((h, i) => (
                  <span key={i} className={`ps-hint ${h}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current guess builder */}
        {status === "playing" && (
          <div className="ps-builder">
            <h3>Build Your Guess</h3>
            <div className="ps-purble-preview">
              {current.map((v, fi) => (
                <div key={fi} className="ps-feature-slot" onClick={() => cycleFeature(fi)}>
                  <span className="ps-feature-emoji">{FEATURE_EMOJIS[fi][v]}</span>
                  <span className="ps-feature-name">{FEATURE_NAMES[fi]}</span>
                  <span className="ps-feature-color">{COLOR_NAMES[v]}</span>
                </div>
              ))}
            </div>
            <p className="ps-hint-text">Click each feature to cycle through options</p>
            <button className="ps-btn primary" onClick={submitGuess}>
              Submit Guess →
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="ps-legend">
        <span className="ps-hint correct" /> Correct position
        <span className="ps-hint absent"  /> Not in answer
      </div>
    </div>
  );
}