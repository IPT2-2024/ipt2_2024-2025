import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

const HeadNavList = ({ userRole, navigate, logout }) => {
  const [role, setRole] = useState(null); // Local state to hold the userRole
  const [loading, setLoading] = useState(true); // To track if role is still being loaded

  useEffect(() => {
    if (userRole) {
      setRole(userRole); // If userRole is provided, use it
      setLoading(false); // Mark loading as false
    } else {
      // If no userRole, set a default fallback role
      const savedRole = localStorage.getItem('user_role') || 'guest'; // Fetch from localStorage or fallback to 'admin'
      setRole(savedRole);
      setLoading(false);
    }
  }, [userRole]); // Trigger this effect when userRole changes

  // Show loading indicator or return nothing until the role is available
  if (loading) {
    return <div>Loading...</div>; // Or a spinner if you prefer
  }

  // Dynamically set the "Manage Account" link based on user role
  const manageAccountLink = `/${role}/manage-account`;

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to={manageAccountLink} className="nav-link">
          Manage Account
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => logout(navigate)}>Logout</Menu.Item> {/* Pass navigate to logout */}
    </Menu>
  );

  return menu;
};

export default HeadNavList;
