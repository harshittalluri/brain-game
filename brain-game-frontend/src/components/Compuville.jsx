// src/components/CompuVille.jsx  — Memory pairs with difficulty levels
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Compuville.css";

const DIFFICULTIES = {
  easy:   { pairs: 6,  cols: 4, timeLimit: 0,  label: "Easy"   },
  medium: { pairs: 8,  cols: 4, timeLimit: 90, label: "Medium" },
  hard:   { pairs: 12, cols: 6, timeLimit: 90, label: "Hard"   },
};

const ALL_EMOJIS = [
  "🐶","🐱","🦊","🐻","🐼","🦁","🐸","🦋",
  "🌸","🍕","🎸","🚀","🍦","🎯","🦄","⚡",
  "🍩","🎪","🌈","🔮","🦀","🌺","🎭","🏆",
];

function buildDeck(pairs) {
  const icons = ALL_EMOJIS.slice(0, pairs);
  return [...icons, ...icons]
    .sort(() => Math.random() - 0.5)
    .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
}

export default function CompuVille() {
  const [diff,    setDiff]    = useState(null);
  const [cards,   setCards]   = useState([]);
  const [selected,setSelected]= useState([]);
  const [locked,  setLocked]  = useState(false);
  const [moves,   setMoves]   = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft,setTimeLeft]= useState(0);
  const [status,  setStatus]  = useState("playing");
  const [saved,   setSaved]   = useState(false);

  const saveScore = useCallback(async (s) => {
    const token = localStorage.getItem("token");
    if (!token || saved) return;
    try {
      await axios.post("http://localhost:8085/api/scores",
        { game: "COMPU_VILLE", score: s },
        { headers: { Authorization: `Bearer ${token}` } });
      setSaved(true);
    } catch(e) { console.error(e); }
  }, [saved]);

  // Timer
  useEffect(() => {
    if (!diff || !DIFFICULTIES[diff].timeLimit || status !== "playing") return;
    if (timeLeft <= 0) { setStatus("lost"); saveScore(0); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [diff, timeLeft, status, saveScore]);

  const startGame = (d) => {
    const cfg = DIFFICULTIES[d];
    setDiff(d);
    setCards(buildDeck(cfg.pairs));
    setSelected([]); setLocked(false);
    setMoves(0); setMatches(0);
    setTimeLeft(cfg.timeLimit);
    setStatus("playing"); setSaved(false);
  };

  const flip = (id) => {
    if (locked || status !== "playing") return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map(c => c.id === id ? {...c, flipped: true} : c);
    setCards(newCards);
    const newSel = [...selected, id];
    setSelected(newSel);

    if (newSel.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = newSel.map(sid => newCards.find(c => c.id === sid));
      if (a.emoji === b.emoji) {
        const matched = newCards.map(c =>
          c.id === a.id || c.id === b.id ? {...c, matched: true} : c
        );
        setCards(matched);
        setSelected([]);
        setLocked(false);
        const newMatches = matches + 1;
        setMatches(newMatches);
        const cfg = DIFFICULTIES[diff];
        if (newMatches === cfg.pairs) {
          const pts = cfg.timeLimit
            ? Math.max(10, timeLeft * 2 + (cfg.pairs * 5 - moves * 2))
            : Math.max(10, cfg.pairs * 10 - moves * 2);
          setStatus("won");
          saveScore(pts);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => newSel.includes(c.id) ? {...c, flipped: false} : c));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  if (!diff) return (
    <div className="cv-wrap">
      <h1 className="cv-title">🏘️ Compu-Ville</h1>
      <p className="cv-sub">Match all the pairs to build your village!</p>
      <div className="cv-diff-grid">
        {Object.entries(DIFFICULTIES).map(([key, cfg]) => (
          <button key={key} className={`cv-diff-btn ${key}`} onClick={() => startGame(key)}>
            <span>{key==="easy"?"🟢":key==="medium"?"🟡":"🔴"}</span>
            <strong>{cfg.label}</strong>
            <span className="cv-diff-desc">
              {cfg.pairs} pairs · {cfg.pairs*2} cards
              {cfg.timeLimit ? ` · ${cfg.timeLimit}s` : " · no timer"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const cfg = DIFFICULTIES[diff];
  const pct = (matches / cfg.pairs) * 100;

  return (
    <div className="cv-wrap">
      <div className="cv-topbar">
        <h1 className="cv-title-sm">🏘️ Compu-Ville</h1>
        <div className="cv-stats">
          <span>🔄 {moves}</span>
          <span>✅ {matches}/{cfg.pairs}</span>
          {cfg.timeLimit > 0 && (
            <span className={`cv-timer ${timeLeft <= 15 ? "urgent" : ""}`}>⏱ {timeLeft}s</span>
          )}
        </div>
        <button className="cv-btn outline sm" onClick={() => setDiff(null)}>Menu</button>
      </div>

      {/* Progress bar */}
      <div className="cv-progress-bar">
        <div className="cv-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {(status === "won" || status === "lost") && (
        <div className={`cv-banner ${status}`}>
          {status === "won" ? `🎉 You matched all pairs in ${moves} moves!` : "⏰ Time's up!"}
          <button onClick={() => startGame(diff)}>Play Again</button>
          <button className="cv-btn outline sm" onClick={() => setDiff(null)}>Menu</button>
        </div>
      )}

      <div className="cv-grid" style={{ gridTemplateColumns: `repeat(${cfg.cols}, 1fr)` }}>
        {cards.map(card => (
          <div
            key={card.id}
            className={`cv-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
            onClick={() => flip(card.id)}
          >
            <div className="cv-inner">
              <div className="cv-front">?</div>
              <div className="cv-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}