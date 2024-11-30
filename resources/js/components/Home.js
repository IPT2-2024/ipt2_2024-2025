import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import Login from "./Login"; 

export default function Home() {
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
            {isLoading ? <Loader /> : <Login />}
        </div>
    );
}
