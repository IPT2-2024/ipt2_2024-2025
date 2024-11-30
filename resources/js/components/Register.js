import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '/css/login.css';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // state to toggle password visibility

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form reload
    setError(""); // Reset error message

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        name,
        email,
        password,
      });

      // Handle successful registration
      alert("Registration successful! You can now log in.");
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
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
            <form onSubmit={handleRegister}>
              <h1>Register</h1>
              {error && <p className="error">{error}</p>}

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="bx bxs-envelope"></i>
              </div>

              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"} // Toggle both password fields
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              {/* Show password checkbox */}
              <div className="show-password-container pb-3">
                <label>
                  <input 
                    type="checkbox" 
                    checked={showPassword} 
                    onChange={() => setShowPassword(!showPassword)} 
                  />
                  Show Password
                </label>
              </div>

              <button type="submit" className="btn ">Register</button>

              <div className="register-link">
                <p>Already have an account? <Link to="/login">Sign up</Link></p>
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
