// src/components/Game2048.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Game2048.css";

const SIZE = 4;

function empty() {
  return Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
}

function addRandom(grid) {
  const g = grid.map((r) => [...r]);
  const empty = [];
  g.forEach((r, i) => r.forEach((v, j) => { if (!v) empty.push([i, j]); }));
  if (!empty.length) return g;
  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  g[i][j] = Math.random() < 0.9 ? 2 : 4;
  return g;
}

function initGrid() {
  return addRandom(addRandom(empty()));
}

function slideRow(row) {
  let arr = row.filter((v) => v);
  let score = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter((v) => v);
  while (arr.length < SIZE) arr.push(0);
  return { row: arr, score };
}

function moveLeft(grid) {
  let score = 0;
  const newGrid = grid.map((row) => {
    const { row: r, score: s } = slideRow(row);
    score += s;
    return r;
  });
  return { grid: newGrid, score };
}

function rotateGrid(grid) {
  return grid[0].map((_, i) => grid.map((row) => row[i]).reverse());
}

function move(grid, dir) {
  let g = grid.map((r) => [...r]);
  let totalScore = 0;
  const rotations = { left: 0, up: 1, right: 2, down: 3 };
  const rot = rotations[dir];
  for (let i = 0; i < rot; i++) g = rotateGrid(g);
  const { grid: moved, score } = moveLeft(g);
  totalScore = score;
  let result = moved;
  for (let i = 0; i < (4 - rot) % 4; i++) result = rotateGrid(result);
  return { grid: result, score: totalScore };
}

function gridsEqual(a, b) {
  return a.every((row, i) => row.every((v, j) => v === b[i][j]));
}

function isGameOver(grid) {
  if (grid.some((r) => r.some((v) => !v))) return false;
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE; j++) {
      if (j < SIZE - 1 && grid[i][j] === grid[i][j + 1]) return false;
      if (i < SIZE - 1 && grid[i][j] === grid[i + 1][j]) return false;
    }
  return true;
}

const TILE_COLORS = {
  0: ["#1a1a2e", "#333"],
  2: ["#eee4da", "#776e65"],
  4: ["#ede0c8", "#776e65"],
  8: ["#f2b179", "#fff"],
  16: ["#f59563", "#fff"],
  32: ["#f67c5f", "#fff"],
  64: ["#f65e3b", "#fff"],
  128: ["#edcf72", "#fff"],
  256: ["#edcc61", "#fff"],
  512: ["#edc850", "#fff"],
  1024: ["#edc53f", "#fff"],
  2048: ["#edc22e", "#fff"],
};

export default function Game2048() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState(initGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => +localStorage.getItem("2048best") || 0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveScore = useCallback(async (finalScore) => {
    const token = localStorage.getItem("token");
    if (!token || saved) return;
    try {
      await axios.post(
        "http://localhost:8085/api/scores",
        { game: "GAME2048", score: finalScore },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
    } catch (e) { console.error("Score save failed", e); }
  }, [saved]);

  const handleMove = useCallback((dir) => {
    if (over || won) return;
    setGrid((prev) => {
      const { grid: moved, score: gained } = move(prev, dir);
      if (gridsEqual(prev, moved)) return prev;
      const next = addRandom(moved);
      setScore((s) => {
        const ns = s + gained;
        setBest((b) => { const nb = Math.max(b, ns); localStorage.setItem("2048best", nb); return nb; });
        if (isGameOver(next)) { setOver(true); saveScore(ns); }
        return ns;
      });
      if (next.some((r) => r.some((v) => v === 2048))) setWon(true);
      return next;
    });
  }, [over, won, saveScore]);

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowLeft:"left", ArrowRight:"right", ArrowUp:"up", ArrowDown:"down" };
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  // Touch swipe support
  useEffect(() => {
    let sx, sy;
    const ts = (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const te = (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? "right" : "left");
      else handleMove(dy > 0 ? "down" : "up");
    };
    window.addEventListener("touchstart", ts);
    window.addEventListener("touchend", te);
    return () => { window.removeEventListener("touchstart", ts); window.removeEventListener("touchend", te); };
  }, [handleMove]);

  const reset = () => {
    setGrid(initGrid());
    setScore(0);
    setOver(false);
    setWon(false);
    setSaved(false);
  };

  return (
    <div className="g2048-wrap">
      <div className="g2048-top">
        <h1 className="g2048-title">2048</h1>
        <div className="g2048-scores">
          <div className="g2048-score-box">
            <span className="g2048-score-label">SCORE</span>
            <span className="g2048-score-val">{score}</span>
          </div>
          <div className="g2048-score-box">
            <span className="g2048-score-label">BEST</span>
            <span className="g2048-score-val">{best}</span>
          </div>
        </div>
        <button className="g2048-btn" onClick={reset}>New Game</button>
      </div>

      <p className="g2048-hint">Use arrow keys or swipe to play</p>

      <div className="g2048-board">
        {(over || won) && (
          <div className={`g2048-overlay ${won ? "won" : "over"}`}>
            <p>{won ? "🎉 You reached 2048!" : "💀 Game Over!"}</p>
            <span>Score: {score}</span>
            <button onClick={reset}>Play Again</button>
          </div>
        )}
        {grid.map((row, i) =>
          row.map((val, j) => {
            const [bg, fg] = TILE_COLORS[val] || ["#3c3a32", "#fff"];
            return (
              <div
                key={`${i}-${j}`}
                className={`g2048-tile ${val ? "has-val" : ""}`}
                style={{ background: bg, color: fg, fontSize: val >= 1024 ? "1.4rem" : "1.8rem" }}
              >
                {val || ""}
              </div>
            );
          })
        )}
      </div>

      <div className="g2048-arrows">
        <div></div>
        <button onClick={() => handleMove("up")}>▲</button>
        <div></div>
        <button onClick={() => handleMove("left")}>◀</button>
        <button onClick={() => handleMove("down")}>▼</button>
        <button onClick={() => handleMove("right")}>▶</button>
      </div>
    </div>
  );
}