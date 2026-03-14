// src/components/SnakeGame.js
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "./SnakeGame.css";

const ROWS = 20, COLS = 20, CELL = 24, TICK = 130;

const DIRS = {
  UP:    [-1,  0],
  DOWN:  [ 1,  0],
  LEFT:  [ 0, -1],
  RIGHT: [ 0,  1],
};

function randFood(snake) {
  let pos;
  do {
    pos = [Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)];
  } while (snake.some(([r, c]) => r === pos[0] && c === pos[1]));
  return pos;
}

export default function SnakeGame() {
  const initSnake = [[10,10],[10,9],[10,8]];
  const [snake,  setSnake]  = useState(initSnake);
  const [food,   setFood]   = useState([5, 5]);
  const [score,  setScore]  = useState(0);
  const [best,   setBest]   = useState(() => +localStorage.getItem("snakeBest") || 0);
  const [status, setStatus] = useState("idle");
  const [saved,  setSaved]  = useState(false);
  const dirRef   = useRef("RIGHT");
  const nextDir  = useRef("RIGHT");
  const snakeRef = useRef(initSnake);
  const foodRef  = useRef([5, 5]);
  const scoreRef = useRef(0);

  const saveScore = useCallback(async (s) => {
    const token = localStorage.getItem("token");
    if (!token || saved) return;
    try {
      await axios.post(
        "http://localhost:8085/api/scores",
        { game: "SNAKE", score: s },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
    } catch (e) { console.error(e); }
  }, [saved]);

  useEffect(() => {
    const keyMap = {
      ArrowUp:"UP", ArrowDown:"DOWN", ArrowLeft:"LEFT", ArrowRight:"RIGHT",
      w:"UP", s:"DOWN", a:"LEFT", d:"RIGHT",
    };
    const opposite = { UP:"DOWN", DOWN:"UP", LEFT:"RIGHT", RIGHT:"LEFT" };
    const onKey = (e) => {
      const nd = keyMap[e.key];
      if (!nd) return;
      e.preventDefault();
      if (status === "idle") setStatus("running");
      if (nd !== opposite[dirRef.current]) nextDir.current = nd;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status]);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current  = food;  }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      dirRef.current = nextDir.current;
      const prev = snakeRef.current;
      const [dr, dc] = DIRS[dirRef.current];
      const head = [prev[0][0] + dr, prev[0][1] + dc];
      if (head[0] < 0 || head[0] >= ROWS || head[1] < 0 || head[1] >= COLS) {
        setStatus("over"); saveScore(scoreRef.current); return;
      }
      if (prev.some(([r, c]) => r === head[0] && c === head[1])) {
        setStatus("over"); saveScore(scoreRef.current); return;
      }
      const ateFood = head[0] === foodRef.current[0] && head[1] === foodRef.current[1];
      const newSnake = ateFood ? [head, ...prev] : [head, ...prev.slice(0, -1)];
      snakeRef.current = newSnake;
      setSnake(newSnake);
      if (ateFood) {
        const ns = scoreRef.current + 10;
        scoreRef.current = ns;
        setScore(ns);
        setBest((b) => { const nb = Math.max(b, ns); localStorage.setItem("snakeBest", nb); return nb; });
        const nf = randFood(newSnake);
        foodRef.current = nf;
        setFood(nf);
      }
    }, TICK);
    return () => clearInterval(id);
  }, [status, saveScore]);

  const reset = () => {
    const s = [[10,10],[10,9],[10,8]];
    snakeRef.current = s; foodRef.current = [5,5]; scoreRef.current = 0;
    dirRef.current = "RIGHT"; nextDir.current = "RIGHT";
    setSnake(s); setFood([5,5]); setScore(0); setStatus("idle"); setSaved(false);
  };

  const mobileDir = (d) => {
    const opp = { UP:"DOWN", DOWN:"UP", LEFT:"RIGHT", RIGHT:"LEFT" };
    if (d === opp[dirRef.current]) return;
    if (status === "idle") setStatus("running");
    nextDir.current = d;
  };

  return (
    <div className="sn-wrap">
      <h1 className="sn-title">🐍 Snake</h1>
      <div className="sn-stats">
        <div className="sn-stat"><span>{score}</span><label>Score</label></div>
        <div className="sn-stat"><span>{best}</span><label>Best</label></div>
        <button className="sn-btn" onClick={reset}>Reset</button>
      </div>
      {status === "idle" && <p className="sn-hint">Press arrow keys or WASD to start</p>}
      <div className="sn-board" style={{ width: COLS*CELL, height: ROWS*CELL }}>
        {status === "over" && (
          <div className="sn-overlay">
            <p>💀 Game Over!</p>
            <span>Score: {score}</span>
            <button onClick={reset}>Play Again</button>
          </div>
        )}
        <div className="sn-food" style={{ top: food[0]*CELL, left: food[1]*CELL, width: CELL, height: CELL }} />
        {snake.map(([r, c], i) => (
          <div key={`${r}-${c}-${i}`}
            className={`sn-cell ${i === 0 ? "head" : ""}`}
            style={{ top: r*CELL, left: c*CELL, width: CELL, height: CELL,
                     opacity: Math.max(0.4, 1 - (i/snake.length)*0.6) }} />
        ))}
      </div>
      <div className="sn-dpad">
        <div /><button onClick={() => mobileDir("UP")}>▲</button><div />
        <button onClick={() => mobileDir("LEFT")}>◀</button>
        <button onClick={() => mobileDir("DOWN")}>▼</button>
        <button onClick={() => mobileDir("RIGHT")}>▶</button>
      </div>
    </div>
  );
}