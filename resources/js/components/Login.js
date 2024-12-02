import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import LoginForm from "./LoginForm"; 

export default function login() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading delay of 3 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        // Cleanup the timer to prevent memory leaks
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="home-container">
            {isLoading ? <Loader /> : <LoginForm />}
        </div>
    );
}
