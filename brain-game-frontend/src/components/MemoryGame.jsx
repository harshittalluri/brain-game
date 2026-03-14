// src/components/MemoryGame.jsx
import { useState, useEffect, useCallback } from "react";
import "./MemoryGame.css";

const EMOJIS = ["🐶","🐱","🦊","🐻","🐼","🦁","🐸","🦋","🌸","🍕","🎸","🚀"];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDeck() {
  const pairs = EMOJIS.slice(0, 8);
  return shuffle([...pairs, ...pairs]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryGame() {
  const [cards, setCards] = useState(buildDeck);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || won) return;
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, won]);

  const checkWin = useCallback((updated) => {
    if (updated.every((c) => c.matched)) {
      setWon(true);
      setRunning(false);
    }
  }, []);

  const flip = (id) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (card.flipped || card.matched) return;

    const newCards = cards.map((c) => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);

    const newSel = [...selected, id];
    setSelected(newSel);

    if (newSel.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = newSel.map((sid) => newCards.find((c) => c.id === sid));
      if (a.emoji === b.emoji) {
        const matched = newCards.map((c) =>
          c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
        );
        setCards(matched);
        setSelected([]);
        setLocked(false);
        checkWin(matched);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => newSel.includes(c.id) ? { ...c, flipped: false } : c)
          );
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const reset = () => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setWon(false);
    setLocked(false);
    setTime(0);
    setRunning(true);
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="mg-wrap">
      <h1 className="mg-title">🃏 Memory Flip</h1>
      <div className="mg-stats">
        <span>⏱ {fmt(time)}</span>
        <span>🔄 {moves} moves</span>
        <button className="mg-reset" onClick={reset}>New Game</button>
      </div>

      {won && (
        <div className="mg-won">
          🎉 You matched all pairs in {moves} moves & {fmt(time)}!
          <button onClick={reset}>Play Again</button>
        </div>
      )}

      <div className="mg-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`mg-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
            onClick={() => flip(card.id)}
          >
            <div className="mg-inner">
              <div className="mg-front">❓</div>
              <div className="mg-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}