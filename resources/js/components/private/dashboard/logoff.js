import React from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const Logoff = () => {
  const navigate = useNavigate();

  // Function to show the logout confirmation modal
  const showLogoutConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      content: 'You will be logged out of your account.',
      onOk: handleLogout,
      onCancel: () => console.log('Logout cancelled'),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  // Logout function that removes items from localStorage and redirects
  const handleLogout = () => {
    // Remove auth token and user role from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');

    // Redirect to login page
    navigate('/login', { replace: true });
    window.location.reload(); // Optionally reload the page
  };

  // Return the function to trigger logout (used by HeadNavList)
  return {
    showLogoutConfirm,
  };
};

export default Logoff;
