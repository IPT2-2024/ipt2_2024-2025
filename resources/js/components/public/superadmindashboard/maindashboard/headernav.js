import React from "react";

const HeaderNav = ({ notifications }) => {
    return (
        <div className="d-flex align-items-center">
            {/* Notification Icon */}
            <div className="dropdown me-3">
                <a
                    href="#"
                    className="text-decoration-none"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i className="bi bi-bell fs-5"></i>
                </a>
                <ul
                    className="dropdown-menu dropdown-menu-end shadow-sm"
                    style={{ width: "300px" }}
                >
                    {notifications.length === 0 ? (
                        <li className="dropdown-item text-muted text-center">
                            No new notifications
                        </li>
                    ) : (
                        notifications.map((notification, index) => (
                            <li key={index} className="dropdown-item">
                                <strong>{notification.title}</strong>
                                <p className="small text-muted mb-0">
                                    {notification.message}
                                </p>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Message Icon */}
            <div className="dropdown me-3">
                <a
                    href="#"
                    className="text-decoration-none"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i className="bi bi-send fs-5"></i>
                </a>
                <ul
                    className="dropdown-menu dropdown-menu-end shadow-sm"
                    style={{ width: "300px" }}
                >
                    <li className="dropdown-item text-muted text-center">
                        No new messages
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default HeaderNav;
