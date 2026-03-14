import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import anime from "../assets/images/anime-bg-login.png";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const loginUser = async () => {
    try {

      const res = await axios.post(
        "http://localhost:8085/api/users/login",
        user
      );

      if (res.data) {

        localStorage.setItem("token", res.data);
        localStorage.setItem("email", user.email);

        alert("Login Successful");

        navigate("/welcome");

      } else {

        alert("Invalid Credentials");

      }

    } catch (error) {

      alert("Login Failed");

    }
  };

  return (

    <div className="login-page">

      {/* LEFT SIDE IMAGE */}
      <div className="login-image">
        <img src={anime} alt="anime kids" />
      </div>

      {/* RIGHT SIDE LOGIN FORM */}
      <div className="login-form">

        <div className="login-container">

          <h2>Login 🔐</h2>

          <input
            placeholder="Email"
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
          />

          <button onClick={loginUser}>
            Login
          </button>

          <p style={{ marginTop: "15px" }}>
            Don't have an account?
          </p>

          <button
            style={{ background: "#555" }}
            onClick={() => navigate("/")}
          >
            Sign Up
          </button>

        </div>

      </div>

    </div>

  );
}

export default Login;