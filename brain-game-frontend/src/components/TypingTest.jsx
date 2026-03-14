// src/components/TypingTest.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import "./TypingTest.css";

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog near the riverbank at sunset.",
  "Space exploration has opened new frontiers for humanity beyond our home planet Earth.",
  "Coding is the art of turning logic and creativity into software that changes the world.",
  "Every morning is a fresh opportunity to learn something new and improve yourself.",
  "Mountains stand tall as silent witnesses to the passage of time and human ambition.",
];

const DURATION = 60;

export default function TypingTest() {
  const [text]            = useState(() => PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
  const [typed, setTyped] = useState("");
  const [started, setStarted]   = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [wpm, setWpm]     = useState(0);
  const [acc, setAcc]     = useState(100);
  const inputRef = useRef();
  const timerRef = useRef();

  const calcStats = useCallback((val) => {
    const words   = val.trim().split(/\s+/).filter(Boolean).length;
    const elapsed = DURATION - timeLeft + 1;
    const mins    = elapsed / 60;
    setWpm(Math.round(words / mins) || 0);

    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) correct++;
    }
    setAcc(val.length ? Math.round((correct / val.length) * 100) : 100);
  }, [text, timeLeft]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(timerRef.current); setFinished(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!started) setStarted(true);
    if (finished) return;
    setTyped(val);
    calcStats(val);
    if (val === text) { clearInterval(timerRef.current); setFinished(true); }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setTyped(""); setStarted(false); setFinished(false);
    setTimeLeft(DURATION); setWpm(0); setAcc(100);
    inputRef.current?.focus();
  };

  const renderText = () =>
    text.split("").map((ch, i) => {
      let cls = "tt-char";
      if (i < typed.length) cls += typed[i] === ch ? " correct" : " wrong";
      else if (i === typed.length) cls += " cursor";
      return <span key={i} className={cls}>{ch}</span>;
    });

  const timerColor = timeLeft <= 10 ? "#ff4081" : timeLeft <= 20 ? "#ffab40" : "#ce93d8";

  return (
    <div className="tt-wrap">
      <h1 className="tt-title">⌨️ Typing Speed Test</h1>

      <div className="tt-stats">
        <div className="tt-stat" style={{ "--c": timerColor }}>
          <span className="tt-val">{timeLeft}s</span>
          <span className="tt-lab">Time Left</span>
        </div>
        <div className="tt-stat" style={{ "--c": "#ce93d8" }}>
          <span className="tt-val">{wpm}</span>
          <span className="tt-lab">WPM</span>
        </div>
        <div className="tt-stat" style={{ "--c": acc >= 90 ? "#69f0ae" : "#ff4081" }}>
          <span className="tt-val">{acc}%</span>
          <span className="tt-lab">Accuracy</span>
        </div>
      </div>

      {finished ? (
        <div className="tt-result">
          <h2>🎉 {typed === text ? "Complete!" : "Time's Up!"}</h2>
          <p>You typed <strong>{wpm} WPM</strong> with <strong>{acc}%</strong> accuracy.</p>
          <button className="tt-btn" onClick={reset}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="tt-display">{renderText()}</div>
          {!started && <p className="tt-hint">Start typing to begin the timer…</p>}
          <textarea
            ref={inputRef}
            className="tt-input"
            value={typed}
            onChange={handleChange}
            disabled={finished}
            autoFocus
            spellCheck={false}
            placeholder="Type here…"
          />
          <button className="tt-btn outline" onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
}