import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarNav = ({ buttons = [] }) => {
    const navigate = useNavigate(); // React Router navigation hook

    return (
        <ul className="nav flex-column">
            {buttons.map((button, index) => (
                <li key={index} className="nav-item mb-2">
                    <button
                        className="btn btn-link text-start text-dark w-100 px-3"
                        onClick={() =>
                            navigate(`/${button.label.toLowerCase().replace(/\s+/g, "-")}`)
                        }
                        style={{ textDecoration: "none" }}
                    >
                        {button.icon && (
                            <i className={`me-2 ${button.icon}`}></i> // Add an icon if provided
                        )}
                        {button.label}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default SidebarNav;
