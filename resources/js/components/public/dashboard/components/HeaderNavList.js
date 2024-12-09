import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import Logoff from './../../../private/dashboard/logoff'; // Import the Logoff component

const HeadNavList = ({ userRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize the Logoff functionality
  const logoff = Logoff();

  useEffect(() => {
    if (userRole) {
      setRole(userRole);
      setLoading(false);
    } else {
      const savedRole = localStorage.getItem('user_role') || 'guest';
      setRole(savedRole);
      setLoading(false);
    }
  }, [userRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const manageAccountLink = `/${role}/manage-account`;

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to={manageAccountLink} className="nav-link">
          Manage Account
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" onClick={logoff.showLogoutConfirm}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return menu;
};

export default HeadNavList;
