import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        // Save JWT token + email
        localStorage.setItem("token", res.data);
        localStorage.setItem("email", user.email);

        alert("Login Successful");

        // 🔥 FIXED — redirect to Welcome page
        navigate("/welcome");
      } else {
        alert("Invalid Credentials");
      }

    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="container">
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

      <button onClick={loginUser}>Login</button>

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
  );
}

export default Login;
