import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sidebarlogo from "./images/sidebarlogo";

export default function SidebarNav() {
    const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        // Simulating an API call to fetch navigation items
        const fetchNavItems = async () => {
            try {
                const response = await fetch("/api/navigation"); // Replace with your actual API endpoint
                const data = await response.json();
                setNavItems(data);
            } catch (error) {
                console.error("Error fetching navigation items:", error);
                // Fallback to static navigation items in case of API failure
                setNavItems([
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Users", path: "/users" },
                    { label: "Student (IS)", path: "/students" },
                    { label: "Teacher (IS)", path: "/teachers" },
                    { label: "Class Scheduling", path: "/class-scheduling" },
                    { label: "Academic Programs", path: "/academic-programs" },
                    { label: "Subject Enlistment", path: "/subject-enlistment" },
                    { label: "Student Enlistment", path: "/student-enlistment" },
                    { label: "Classroom Manager", path: "/classroom-manager" },
                ]);
            }
        };

        fetchNavItems();
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img
                        src={sidebarlogo}
                        alt="sidebarlogo.svg"
                        className="d-inline-block align-text-top"
                        style={{ width: "180px", height: "60px" }}
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidebarNav"
                    aria-controls="sidebarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="sidebarNav">
                    <ul className="navbar-nav flex-column">
                        {navItems.map((item, index) => (
                            <li key={index} className="nav-item mb-2">
                                <Link className="nav-link" to={item.path} style={{ color: "#ffffff" }}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
