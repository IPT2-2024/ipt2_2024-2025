import React, { useState } from "react";
import axios from "axios";
import LoginBackground from "./LoginBackground";
import GraphicSVG from "./GraphicSVG"; // Update the path as needed

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form reload
        setError(""); // Reset error message

        try {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                {
                    username,
                    password,
                }
            );

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
            <div className="login-form">
                <div className="d-flex flex-column align-items-center justify-content-center align-self-center">
                    <div className="container d-flex justify-content-center pb-3">
                        <img
                            src={GraphicSVG.LoginFsuuLogo}
                            alt="Fsuuw 3d Logo"
                            className ="fsuuw-3d-logo"
                        />
                    </div>
                    <div className="wrapper">
                        <form onSubmit={handleLogin}>
                            <h1>Sign in</h1>
                            {error && <p className="error text-center">{error}</p>}
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                                <i className="bx bxs-user"></i>
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <i className="bx bxs-lock-alt"></i>
                            </div>
                            <div className="d-flex colum justify-content-between pb-3 align-items-center">
                                <div className="show-password-container">
                                    <label>
                                        <input type="checkbox" /> Remember me
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn">
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <LoginBackground />
        </div>
    );
}
