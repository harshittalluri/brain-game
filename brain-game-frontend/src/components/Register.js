import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  const registerUser = async () => {
  try {
    await axios.post("http://localhost:8085/api/users/register", user);
    alert("Registered Successfully!");
    navigate("/login");  // 👈 go to login instead
  } catch (error) {
    alert("Registration Failed");
  }
};


  return (
  <div className="container">
    <h2>Register 🎮</h2>

    <input
      placeholder="Username"
      onChange={(e)=>setUser({...user, username:e.target.value})}
    />

    <input
      placeholder="Email"
      onChange={(e)=>setUser({...user, email:e.target.value})}
    />

    <input
      type="password"
      placeholder="Password"
      onChange={(e)=>setUser({...user, password:e.target.value})}
    />

    <button onClick={registerUser}>Create Account</button>

    <p style={{marginTop: "15px"}}>Already have an account?</p>

    <button
      style={{background: "#555"}}
      onClick={() => navigate("/login")}
    >
      Go to Login
    </button>
  </div>
);


}

export default Register;
