import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import DifficultySelect from "./components/DifficultySelect";
import MathGame from "./components/MathGame";
import Sudoku from "./components/Sudoku";
import Leaderboard from "./components/Leaderboard";

// Existing new components
import GameSelect from "./components/GameSelect";
import MemoryGame from "./components/MemoryGame";
import WordScramble from "./components/WordScramble";
import TypingTest from "./components/TypingTest";

// New games
import Game2048 from "./components/Game2048";
import SnakeGame from "./components/SnakeGame";
import TicTacToe from "./components/TicTacToe";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Default route – Registration */}
        <Route path="/" element={<Register />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* After login welcome page */}
        <Route path="/welcome" element={<Welcome />} />

        {/* Game Hub - shows all games */}
        <Route path="/game" element={<GameSelect />} />

        {/* Math Game */}
        <Route path="/math-levels" element={<DifficultySelect />} />
        <Route path="/math" element={<MathGame />} />

        {/* Sudoku Game */}
        <Route path="/sudoku" element={<Sudoku />} />

        {/* Existing New Games */}
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/word-scramble" element={<WordScramble />} />
        <Route path="/typing" element={<TypingTest />} />

        {/* New Games */}
        <Route path="/2048" element={<Game2048 />} />
        <Route path="/snake" element={<SnakeGame />} />
        <Route path="/tictactoe" element={<TicTacToe />} />

        {/* Leaderboard */}
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  );
}

export default App;