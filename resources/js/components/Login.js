import React, { useState } from "react";
import axios from "axios";
import '/css/login.css';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload
    setError(""); // Reset error message

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      // Store token in localStorage or cookies
      localStorage.setItem("authToken", response.data.token);

      // Redirect or handle successful login
      alert("Login successful!");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="vw-100 d-flex align-items-center justify-content-center z-2">
        <div className="d-flex flex-column align-items-center justify-content-center align-self-center">
          <div className="container d-flex justify-content-center pb-3">
            <img src="/assets/fsuuw 3d logo.svg" alt="Fsuuw 3d Logo" className="fsuuw-3d-logo" />
          </div>
          <div className="wrapper">
            <form onSubmit={handleLogin}>
              <h1>Sign in</h1>
              {error && <p className="error">{error}</p>}
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="btn">Sign in</button>

              <div className="register-link">
                <p>Don't have an account? <a href="#">Register</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <img src="assets/waves.svg" alt="Waves" className="waves" />
      <img src="assets/Dots sign in horizontal.svg" alt="Dots Sign In Horizontal" className="dots-sign-in-horizontal" />
      <img src="assets/Dots sign in left vertical.svg" alt="Dots Sign In Left Vertical" className="dots-sign-in-left-vertical" />

      <div className="liquid-container">
        <div className="blob blob1">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>

        <div className="blob blob2">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>

        <div className="blob blob3">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>
      </div>
    </div>
  );
}
