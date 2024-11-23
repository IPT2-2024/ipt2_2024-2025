import React, { useState, useEffect } from "react";

const SidebarBody = () => {
    const [mainButtons, setMainButtons] = useState([]);
    const [systemButtons, setSystemButtons] = useState([]);

    useEffect(() => {
        // Fetch sidebar button data from API
        const fetchSidebarData = async () => {
            try {
                const response = await fetch("/api/sidebar-buttons");
                if (!response.ok) {
                    throw new Error("Failed to fetch sidebar data");
                }
                const data = await response.json();

                // Assuming API response:
                // [{ label: "Dashboard", type: "main" }, { label: "System Settings", type: "system" }]
                const main = data.filter((button) => button.type === "main");
                const system = data.filter((button) => button.type === "system");

                setMainButtons(main);
                setSystemButtons(system);
            } catch (error) {
                console.error("Error fetching sidebar data:", error);

                // Fallback data
                setMainButtons([{ label: "Dashboard", type: "main" }]);
                setSystemButtons([{ label: "System Settings", type: "system" }]);
            }
        };

        fetchSidebarData();
    }, []);

    return (
        <div
            className="sidebar d-flex flex-column bg-light border-end vh-100"
            style={{ width: "250px" }}
        >
            {/* Main Navigation */}
            <div className="nav-section p-3">
                <h6 className="text-uppercase text-muted">Main Navigation</h6>
                <ul className="nav flex-column">
                    {mainButtons.map((button, index) => (
                        <li key={index} className="nav-item mb-2">
                            <a href={`/${button.label.toLowerCase().replace(/\s+/g, "-")}`} className="nav-link text-dark">
                                {button.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* System Settings */}
            <div className="system-settings p-3 mt-auto border-top">
                <h6 className="text-uppercase text-muted">System Settings</h6>
                <ul className="nav flex-column">
                    {systemButtons.map((button, index) => (
                        <li key={index} className="nav-item mb-2">
                            <a href={`/${button.label.toLowerCase().replace(/\s+/g, "-")}`} className="nav-link text-dark">
                                {button.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SidebarBody;
