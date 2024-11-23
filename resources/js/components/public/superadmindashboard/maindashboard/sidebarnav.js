import React from "react";

const SidebarNav = ({ buttons = [] }) => {
  return (
    <ul className="nav flex-column text-white">
      {buttons.map((button, index) => (
        <li key={index} className="nav-item mb-2">
          <button
            className="btn btn-link text-white text-start w-100"
            onClick={() => console.log(`Clicked: ${button.label}`)}
          >
            {button.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNav;
