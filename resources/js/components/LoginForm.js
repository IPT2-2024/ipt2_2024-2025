import React, { useState } from "react";
import axios from "axios";
import LoginBackground from "./LoginBackground";
import LoginLogo from "./LoginLogo";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                {
                    username,
                    password,
                }
            );

            // Store token and handle success
            localStorage.setItem("authToken", response.data.token);
            alert("Login successful!");
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    const sharedStyle = {
        height: "55px", // Matches the button height
        fontSize: "1.1rem",
    };

    return (
        <div className="login-page d-flex align-items-center justify-content-center vh-100">
            <div className="container z-2">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                        <div className="login-form">
                            <div className="d-flex flex-column align-items-center">
                                <LoginLogo />
                                <div className="wrapper w-100 p-3 p-md-4 card border rounded shadow">
                                    <form onSubmit={handleLogin}>
                                        <h1 className="text-center mb-4">
                                            Sign in
                                        </h1>
                                        {error && (
                                            <p className="text-center text-danger">
                                                {error}
                                            </p>
                                        )}
                                        <div className="input-box form-group position-relative mb-3">
                                            <i
                                                className="bx bxs-user position-absolute top-50 translate-middle-y text-muted bx-sm"
                                                style={{ left: "15px" }}
                                            ></i>
                                            <input
                                                type="text"
                                                className="form-control ps-5 rounded-pill"
                                                style={sharedStyle}
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="input-box form-group position-relative mb-3">
                                            <i
                                                className="bx bxs-lock-alt position-absolute top-50 translate-middle-y text-muted bx-sm"
                                                style={{ left: "15px" }}
                                            ></i>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control ps-5 pe-5 rounded-pill"
                                                style={sharedStyle}
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                required
                                            />
                                            <i
                                                className={`bx ${
                                                    showPassword
                                                        ? "bxs-show"
                                                        : "bxs-hide"
                                                } position-absolute top-50 translate-middle-y text-muted bx-sm`}
                                                style={{
                                                    right: "15px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            ></i>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 rounded-pill"
                                            style={sharedStyle}
                                        >
                                            Sign in
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoginBackground />
        </div>
    );
}
