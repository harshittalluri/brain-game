// src/components/TicTacToe.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./TicTacToe.css";

function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a,b,c] };
  }
  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return null;
}

// Minimax AI
function minimax(board, isMax) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === "O") return  10;
    if (result.winner === "X") return -10;
    return 0;
  }
  if (isMax) {
    let best = -Infinity;
    board.forEach((v, i) => {
      if (!v) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    });
    return best;
  } else {
    let best = Infinity;
    board.forEach((v, i) => {
      if (!v) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    });
    return best;
  }
}

function bestMove(board) {
  let best = -Infinity, move = -1;
  board.forEach((v, i) => {
    if (!v) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;
      if (score > best) { best = score; move = i; }
    }
  });
  return move;
}

export default function TicTacToe() {
  const [board,   setBoard]   = useState(Array(9).fill(null));
  const [result,  setResult]  = useState(null);
  const [thinking,setThinking]= useState(false);
  const [scores,  setScores]  = useState({ W:0, L:0, D:0 });
  const [saved,   setSaved]   = useState(false);

  const saveScore = useCallback(async (pts) => {
    const token = localStorage.getItem("token");
    if (!token || saved || pts === 0) return;
    try {
      await axios.post(
        "http://localhost:8085/api/scores",
        { game: "TICTACTOE", score: pts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
    } catch (e) { console.error(e); }
  }, [saved]);

  // AI move
  useEffect(() => {
    if (result || thinking) return;
    const xCount = board.filter(v => v === "X").length;
    const oCount = board.filter(v => v === "O").length;
    if (xCount <= oCount) return; // Player's turn
    setThinking(true);
    const t = setTimeout(() => {
      const b = [...board];
      const move = bestMove(b);
      if (move === -1) { setThinking(false); return; }
      b[move] = "O";
      setBoard(b);
      const r = checkWinner(b);
      if (r) {
        setResult(r);
        if (r.winner === "O") { setScores(s => ({...s, L: s.L+1})); saveScore(0); }
        else if (r.winner === "draw") { setScores(s => ({...s, D: s.D+1})); saveScore(5); }
      }
      setThinking(false);
    }, 400);
    return () => clearTimeout(t);
  }, [board, result, thinking, saveScore]);

  const handleClick = (i) => {
    if (board[i] || result || thinking) return;
    const b = [...board];
    b[i] = "X";
    setBoard(b);
    const r = checkWinner(b);
    if (r) {
      setResult(r);
      if (r.winner === "X") { setScores(s => ({...s, W: s.W+1})); saveScore(10); }
      else if (r.winner === "draw") { setScores(s => ({...s, D: s.D+1})); saveScore(5); }
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setResult(null);
    setThinking(false);
    setSaved(false);
  };

  const winLine = result?.line || [];

  return (
    <div className="ttt-wrap">
      <h1 className="ttt-title">✖️ Tic Tac Toe</h1>
      <p className="ttt-sub">You are <strong>X</strong> · AI is <strong>O</strong></p>

      <div className="ttt-scoreboard">
        <div className="ttt-score win"><span>{scores.W}</span><label>Wins</label></div>
        <div className="ttt-score draw"><span>{scores.D}</span><label>Draws</label></div>
        <div className="ttt-score loss"><span>{scores.L}</span><label>Losses</label></div>
      </div>

      {thinking && <p className="ttt-thinking">🤖 AI is thinking…</p>}

      {result && (
        <div className={`ttt-result ${result.winner === "X" ? "win" : result.winner === "draw" ? "draw" : "loss"}`}>
          {result.winner === "X" ? "🎉 You Win!" : result.winner === "draw" ? "🤝 Draw!" : "🤖 AI Wins!"}
          <button onClick={reset}>Play Again</button>
        </div>
      )}

      <div className="ttt-board">
        {board.map((val, i) => (
          <button
            key={i}
            className={`ttt-cell ${val ? val.toLowerCase() : ""} ${winLine.includes(i) ? "win-cell" : ""}`}
            onClick={() => handleClick(i)}
            disabled={!!val || !!result || thinking}
          >
            {val}
          </button>
        ))}
      </div>

      <button className="ttt-reset-btn" onClick={reset}>New Game</button>
    </div>
  );
}