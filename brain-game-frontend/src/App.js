import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import DifficultySelect from "./components/DifficultySelect";
import MathGame from "./components/MathGame";
import Sudoku from "./components/Sudoku";
import Leaderboard from "./components/Leaderboard";

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

        {/* Math Game */}
        <Route path="/math-levels" element={<DifficultySelect />} />
        <Route path="/math" element={<MathGame />} />

        {/* Sudoku Game */}
        <Route path="/sudoku" element={<Sudoku />} />

        {/* Leaderboard */}
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  );
}

export default App;
