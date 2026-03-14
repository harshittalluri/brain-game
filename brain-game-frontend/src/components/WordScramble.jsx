// src/components/WordScramble.jsx
import { useState, useEffect, useRef } from "react";
import "./WordScramble.css";

const WORDS = [
  { word: "PYTHON",   hint: "A popular programming language 🐍" },
  { word: "PLANET",   hint: "Orbits a star 🪐" },
  { word: "OCEAN",    hint: "Vast body of salt water 🌊" },
  { word: "JUNGLE",   hint: "Dense tropical forest 🌿" },
  { word: "ROCKET",   hint: "Used for space travel 🚀" },
  { word: "DIAMOND",  hint: "Hardest natural substance 💎" },
  { word: "THUNDER",  hint: "Loud sound during a storm ⛈️" },
  { word: "COMPASS",  hint: "Navigation tool 🧭" },
  { word: "VOLCANO",  hint: "Erupts with lava 🌋" },
  { word: "LIBRARY",  hint: "Place full of books 📚" },
];

function scramble(word) {
  let s;
  do { s = word.split("").sort(() => Math.random() - 0.5).join(""); }
  while (s === word);
  return s;
}

function pick() {
  const w = WORDS[Math.floor(Math.random() * WORDS.length)];
  return { ...w, scrambled: scramble(w.word) };
}

export default function WordScramble() {
  const [current, setCurrent] = useState(pick);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null); // "correct" | "wrong"
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, [current]);

  const submit = () => {
    if (!input.trim()) return;
    setTotal((t) => t + 1);
    if (input.trim().toUpperCase() === current.word) {
      setStatus("correct");
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
    } else {
      setStatus("wrong");
      setStreak(0);
    }
    setTimeout(() => {
      setCurrent(pick());
      setInput("");
      setStatus(null);
    }, 900);
  };

  const skip = () => {
    setTotal((t) => t + 1);
    setStreak(0);
    setCurrent(pick());
    setInput("");
    setStatus(null);
  };

  return (
    <div className="ws-wrap">
      <h1 className="ws-title">🔤 Word Scramble</h1>
      <div className="ws-scorebar">
        <span>⭐ Score: <strong>{score}</strong></span>
        <span>🔥 Streak: <strong>{streak}</strong></span>
        <span>📊 {total} played</span>
      </div>

      <div className={`ws-card ${status || ""}`}>
        <p className="ws-hint">{current.hint}</p>
        <div className="ws-scrambled">
          {current.scrambled.split("").map((ch, i) => (
            <span key={i} className="ws-letter" style={{ animationDelay: `${i * 0.05}s` }}>
              {ch}
            </span>
          ))}
        </div>
        {status === "correct" && <div className="ws-feedback correct">✅ Correct! +{10 + streak * 2} pts</div>}
        {status === "wrong"   && <div className="ws-feedback wrong">❌ It was: <strong>{current.word}</strong></div>}
      </div>

      <div className="ws-controls">
        <input
          ref={inputRef}
          className="ws-input"
          type="text"
          placeholder="Type your answer…"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={!!status}
        />
        <button className="ws-btn primary" onClick={submit} disabled={!!status}>Submit</button>
        <button className="ws-btn skip" onClick={skip} disabled={!!status}>Skip</button>
      </div>
    </div>
  );
}