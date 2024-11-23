import React, { useState, useEffect } from "react";
import HeaderNav from "./headernav";
import ProfileDropdown from "./headerprofiledropdown";

const HeaderBody = () => {
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        // Fetch header data from an API
        const fetchHeaderData = async () => {
            try {
                const response = await fetch("/api/header-data");
                if (!response.ok) {
                    throw new Error("Failed to fetch header data");
                }
                const data = await response.json();

                setNotifications(data.notifications || []);
                setUser(data.user || {});
            } catch (error) {
                console.error("Error fetching header data:", error);

                // Fallback data
                setNotifications([]);
                setUser({
                    name: "Default User",
                    avatar: "https://via.placeholder.com/40",
                });
            }
        };

        fetchHeaderData();
    }, []);

    return (
        <header className="w-100">
            {/* Header Content */}
            <div
                className="navbar navbar-expand-lg py-2 border-bottom"
                style={{ background: "linear-gradient(to bottom, #f5f7ff, #ffffff)" }}
            >
                <div className="container-fluid d-flex align-items-center justify-content-between">
                    {/* Search Bar */}
                    <form className="d-flex flex-grow-1 me-3">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-0">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 shadow-none"
                                placeholder="Search"
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "0.5rem",
                                }}
                            />
                        </div>
                    </form>

                    {/* Notification, Message Icons */}
                    <HeaderNav notifications={notifications} />

                    {/* Profile Dropdown */}
                    <ProfileDropdown user={user} />
                </div>
            </div>

            {/* Blue Line */}
            <div className="bg-primary" style={{ height: "4px" }}></div>
        </header>
    );
};

export default HeaderBody;
