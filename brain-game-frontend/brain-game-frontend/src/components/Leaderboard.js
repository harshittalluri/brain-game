import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Leaderboard() {

  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios.get(
      "http://localhost:8085/api/scores/MATH",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => setScores(res.data))
    .catch(() => alert("Error loading leaderboard"));

  }, [navigate]);

  return (
    <div className="container">
      <h2>Leaderboard 🏆</h2>

      {scores.map((item, index) => (
        <div key={index} className="leader-item">
          <strong>{item[0]}</strong> - {item[1]}
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
