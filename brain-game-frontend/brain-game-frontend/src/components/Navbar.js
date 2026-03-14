import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on every route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3 className="logo">Brain Game 🎮</h3>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/game">Game</Link>
            <Link to="/leaderboard">Leaderboard</Link>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
