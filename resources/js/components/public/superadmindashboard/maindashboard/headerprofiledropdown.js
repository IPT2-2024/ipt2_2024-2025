import React from "react";

const ProfileDropdown = ({ user }) => {
    return (
        <div className="dropdown d-flex align-items-center ms-3">
            <a
                href="#"
                className="text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <img
                    src={user.avatar || "https://via.placeholder.com/40"}
                    alt="User Avatar"
                    className="rounded-circle border"
                    width="40"
                    height="40"
                />
            </a>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li className="dropdown-item">
                    <strong>{user.name || "User"}</strong>
                </li>
                <hr className="dropdown-divider" />
                <li>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-person"></i> Profile
                    </a>
                </li>
                <li>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-gear"></i> Settings
                    </a>
                </li>
                <hr className="dropdown-divider" />
                <li>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-box-arrow-right"></i> Logout
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default ProfileDropdown;
