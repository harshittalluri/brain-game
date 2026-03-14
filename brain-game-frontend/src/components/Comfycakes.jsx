// src/components/ComfyCakes.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Comfycakes.css";

const DIFFICULTIES = {
  easy:   { layers: 1, toppings: 1, frosting: false, timeLimit: 0,  label: "Easy"   },
  medium: { layers: 2, toppings: 2, frosting: true,  timeLimit: 60, label: "Medium" },
  hard:   { layers: 3, toppings: 3, frosting: true,  timeLimit: 40, label: "Hard"   },
};

const CAKE_SHAPES  = ["🔵","🟣","🟡"];
const FROSTINGS    = ["🍫 Chocolate","🍓 Strawberry","🍋 Lemon","🍵 Mint"];
const TOPPINGS     = ["🍒 Cherry","🌟 Star","🍫 Sprinkles","🍓 Berry","🥜 Nuts","🌈 Rainbow"];
const SHAPE_NAMES  = ["Round","Square","Heart"];

function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeOrder(diff) {
  const cfg = DIFFICULTIES[diff];
  return {
    shape:    Math.floor(Math.random() * CAKE_SHAPES.length),
    frosting: cfg.frosting ? Math.floor(Math.random() * FROSTINGS.length) : null,
    toppings: Array.from({ length: cfg.toppings }, () =>
      Math.floor(Math.random() * TOPPINGS.length)
    ),
    layers:   cfg.layers,
  };
}

function makeCake() {
  return { shape: null, frosting: null, toppings: [] };
}

export default function ComfyCakes() {
  const [diff,    setDiff]    = useState(null);
  const [order,   setOrder]   = useState(null);
  const [cake,    setCake]    = useState(makeCake());
  const [score,   setScore]   = useState(0);
  const [round,   setRound]   = useState(1);
  const [timeLeft,setTimeLeft]= useState(0);
  const [result,  setResult]  = useState(null); // "correct"|"wrong"
  const [saved,   setSaved]   = useState(false);

  const saveScore = useCallback(async (s) => {
    const token = localStorage.getItem("token");
    if (!token || saved) return;
    try {
      await axios.post("http://localhost:8085/api/scores",
        { game: "COMFY_CAKES", score: s },
        { headers: { Authorization: `Bearer ${token}` } });
      setSaved(true);
    } catch(e) { console.error(e); }
  }, [saved]);

  useEffect(() => {
    if (!diff || !DIFFICULTIES[diff].timeLimit || result) return;
    if (timeLeft <= 0 && order) { handleSubmit(true); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [diff, timeLeft, result, order]);

  const startGame = (d) => {
    setDiff(d);
    setOrder(makeOrder(d));
    setCake(makeCake());
    setScore(0); setRound(1); setResult(null); setSaved(false);
    setTimeLeft(DIFFICULTIES[d].timeLimit);
  };

  const handleSubmit = (timeout = false) => {
    if (!order) return;
    const correct =
      cake.shape === order.shape &&
      (order.frosting === null || cake.frosting === order.frosting) &&
      order.toppings.every(t => cake.toppings.includes(t)) &&
      cake.toppings.length === order.toppings.length;

    if (!timeout && correct) {
      const pts = DIFFICULTIES[diff].timeLimit
        ? Math.max(10, Math.floor(timeLeft * 2))
        : 10;
      const ns = score + pts;
      setScore(ns);
      setResult("correct");
      setTimeout(() => {
        if (round >= 5) { saveScore(ns); setResult("done"); return; }
        setRound(r => r + 1);
        setOrder(makeOrder(diff));
        setCake(makeCake());
        setResult(null);
        setTimeLeft(DIFFICULTIES[diff].timeLimit);
      }, 1200);
    } else {
      setResult("wrong");
      setTimeout(() => {
        setOrder(makeOrder(diff));
        setCake(makeCake());
        setResult(null);
        setTimeLeft(DIFFICULTIES[diff].timeLimit);
      }, 1200);
    }
  };

  // Difficulty select screen
  if (!diff) return (
    <div className="cc-wrap">
      <h1 className="cc-title">🎂 Comfy Cakes</h1>
      <p className="cc-sub">Bake cakes to match the order!</p>
      <div className="cc-diff-grid">
        {Object.entries(DIFFICULTIES).map(([key, cfg]) => (
          <button key={key} className={`cc-diff-btn ${key}`} onClick={() => startGame(key)}>
            <span className="cc-diff-icon">{key==="easy"?"🟢":key==="medium"?"🟡":"🔴"}</span>
            <span className="cc-diff-label">{cfg.label}</span>
            <span className="cc-diff-desc">
              {cfg.layers} layer{cfg.layers>1?"s":""} · {cfg.toppings} topping{cfg.toppings>1?"s":""}
              {cfg.frosting?" · frosting":""}
              {cfg.timeLimit?` · ${cfg.timeLimit}s`:" · no timer"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const cfg = DIFFICULTIES[diff];

  if (result === "done") return (
    <div className="cc-wrap">
      <div className="cc-done">
        <h2>🎉 All done!</h2>
        <p>You scored <strong>{score}</strong> points!</p>
        <button className="cc-btn primary" onClick={() => setDiff(null)}>Play Again</button>
      </div>
    </div>
  );

  return (
    <div className="cc-wrap">
      <div className="cc-topbar">
        <h1 className="cc-title-sm">🎂 Comfy Cakes</h1>
        <div className="cc-stats">
          <span>Round {round}/5</span>
          <span>⭐ {score}</span>
          {cfg.timeLimit > 0 && (
            <span className={`cc-timer ${timeLeft <= 10 ? "urgent" : ""}`}>⏱ {timeLeft}s</span>
          )}
        </div>
        <button className="cc-btn outline sm" onClick={() => setDiff(null)}>Menu</button>
      </div>

      <div className="cc-main">
        {/* ORDER */}
        <div className="cc-panel order-panel">
          <h3>📋 Order</h3>
          <div className="cc-order-card">
            <div className="cc-order-row">
              <label>Shape</label>
              <span>{CAKE_SHAPES[order.shape]} {SHAPE_NAMES[order.shape]}</span>
            </div>
            {order.frosting !== null && (
              <div className="cc-order-row">
                <label>Frosting</label>
                <span>{FROSTINGS[order.frosting]}</span>
              </div>
            )}
            <div className="cc-order-row">
              <label>Toppings</label>
              <span>{order.toppings.map(t => TOPPINGS[t]).join(", ")}</span>
            </div>
          </div>
        </div>

        {/* YOUR CAKE */}
        <div className="cc-panel cake-panel">
          <h3>🎂 Your Cake</h3>
          <div className={`cc-cake-preview ${result || ""}`}>
            <div className="cc-cake-visual">
              {cake.shape !== null ? CAKE_SHAPES[cake.shape] : "❓"}
            </div>
            {cake.frosting !== null && (
              <div className="cc-cake-frosting">{FROSTINGS[cake.frosting]}</div>
            )}
            {cake.toppings.length > 0 && (
              <div className="cc-cake-toppings">
                {cake.toppings.map((t, i) => <span key={i}>{TOPPINGS[t].split(" ")[0]}</span>)}
              </div>
            )}
            {result === "correct" && <div className="cc-badge correct">✅ Perfect!</div>}
            {result === "wrong"   && <div className="cc-badge wrong">❌ Try again!</div>}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="cc-panel controls-panel">
          <h3>🛠 Build</h3>

          <div className="cc-control-group">
            <label>Shape</label>
            <div className="cc-options">
              {CAKE_SHAPES.map((s, i) => (
                <button key={i}
                  className={`cc-opt ${cake.shape === i ? "selected" : ""}`}
                  onClick={() => setCake(p => ({...p, shape: i}))}>
                  {s} {SHAPE_NAMES[i]}
                </button>
              ))}
            </div>
          </div>

          {cfg.frosting && (
            <div className="cc-control-group">
              <label>Frosting</label>
              <div className="cc-options">
                {FROSTINGS.map((f, i) => (
                  <button key={i}
                    className={`cc-opt ${cake.frosting === i ? "selected" : ""}`}
                    onClick={() => setCake(p => ({...p, frosting: i}))}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="cc-control-group">
            <label>Toppings (pick {cfg.toppings})</label>
            <div className="cc-options">
              {TOPPINGS.map((t, i) => (
                <button key={i}
                  className={`cc-opt ${cake.toppings.includes(i) ? "selected" : ""}`}
                  onClick={() => setCake(p => {
                    const has = p.toppings.includes(i);
                    const tops = has
                      ? p.toppings.filter(x => x !== i)
                      : p.toppings.length < cfg.toppings
                        ? [...p.toppings, i] : p.toppings;
                    return {...p, toppings: tops};
                  })}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button className="cc-btn primary" onClick={() => handleSubmit()}>
            🎂 Serve Cake!
          </button>
        </div>
      </div>
    </div>
  );
}