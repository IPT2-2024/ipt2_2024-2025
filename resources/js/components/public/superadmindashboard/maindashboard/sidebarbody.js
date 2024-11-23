import React, { useEffect, useState } from "react";
import SidebarNav from "./sidebarnav"; // Import SidebarNav

const SidebarBody = () => {
  const [mainButtons, setMainButtons] = useState([]);
  const [systemButtons, setSystemButtons] = useState([]);

  useEffect(() => {
    // Fetch data from API (adjust the API URL as necessary)
    fetch("/api/sidebar-buttons")
      .then((response) => response.json())
      .then((data) => {
        const main = data.filter((button) => button.type === "main");
        const system = data.filter((button) => button.type === "system");
        setMainButtons(main);
        setSystemButtons(system);
      })
      .catch((error) => console.error("Error fetching sidebar data:", error));
  }, []);

  return (
    <div className="sidebar-body d-flex flex-column">
      {/* Main navigation section */}
      <div className="nav-section">
        <SidebarNav buttons={mainButtons} />
      </div>

      {/* System settings section */}
      <div className="system-settings mt-3 pt-3 border-top">
        <SidebarNav buttons={systemButtons} />
      </div>
    </div>
  );
};

export default SidebarBody;
