import { useState, useEffect } from "react";
import { generateSudoku, solveSudoku } from "../games/sudokuGenerator";
import confetti from "canvas-confetti";
import "./Sudoku.css";

function Sudoku() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    resetPuzzle();
  }, []);

  const changeDifficulty = (e) => {
    setDifficulty(e.target.value);
    resetPuzzle(e.target.value);
  };

  const resetPuzzle = (level = difficulty) => {
    const puzzle = generateSudoku(level);
    const solved = solveSudoku(puzzle.map((r) => [...r]));

    setBoard(puzzle);
    setSolution(solved);
    setFixed(puzzle.map((row) => row.map((c) => c !== 0)));
    setMessage("");
  };

  const handleInput = (r, c, value) => {
    if (!/^[1-9]?$/.test(value)) return;

    if (fixed[r][c]) return;

    const newBoard = board.map((row) => [...row]);

    if (value === "") {
      newBoard[r][c] = 0;
      setBoard(newBoard);
      setMessage("");
      return;
    }

    if (parseInt(value) === solution[r][c]) {
      newBoard[r][c] = parseInt(value);
      setBoard(newBoard);
      setMessage("");

      const isSolved = newBoard.every((row, i) =>
        row.every((num, j) => num === solution[i][j])
      );

      if (isSolved) {
        setMessage("🎉 Sudoku Completed!");
        confetti();
      }
    } else {
      setMessage("❌ Wrong number!");
    }
  };

  return (
    <div className="sudoku-page">

      <div className="sudoku-top">
        <h1 className="sudoku-title">Sudoku 🧩</h1>

        <div className="top-controls">
          <select className="difficulty-select" value={difficulty} onChange={changeDifficulty}>
            <option value="easy">😊 Easy</option>
            <option value="medium">😎 Medium</option>
            <option value="hard">🔥 Hard</option>
          </select>

          <button className="reset-btn" onClick={resetPuzzle}>🔄 Reset</button>
        </div>

        <div className="message">{message}</div>
      </div>

      <div className="sudoku-board">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              className={`sudoku-cell ${fixed[i][j] ? "fixed" : "editable"}`}
              value={cell === 0 ? "" : cell}
              onChange={(e) => handleInput(i, j, e.target.value)}
            />
          ))
        )}
      </div>

    </div>
  );
}

export default Sudoku;