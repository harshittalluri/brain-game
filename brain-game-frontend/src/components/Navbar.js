import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <nav className="navbar">
      <div className="navbar-glow" />
      <Link to="/game" className="navbar-logo">
        <span className="logo-icon">🎮</span>
        <span className="logo-text">Brain Game</span>
      </Link>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/game" className={`nav-link ${location.pathname === "/game" ? "active" : ""}`}>
              Game
            </Link>
            <Link to="/leaderboard" className={`nav-link ${location.pathname === "/leaderboard" ? "active" : ""}`}>
              Leaderboard
            </Link>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}>
              Login
            </Link>
            <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;