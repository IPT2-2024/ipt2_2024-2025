import React from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

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

  // Logout function that calls the backend, removes items from localStorage, and redirects
  const handleLogout = async () => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('auth_token');

      if (token) {
        // Make an API call to the backend logout endpoint
        await axios.post(
          '/api/logout', // Ensure this is the correct URL to your logout endpoint
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Remove auth token and user role from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');

      // Redirect to login page
      navigate('/login', { replace: true });
      window.location.reload(); // Optionally reload the page
    } catch (error) {
      console.error('Logout failed:', error);
      Modal.error({
        title: 'Logout Failed',
        content: 'There was an issue logging out. Please try again.',
      });
    }
  };

  // Return the function to trigger logout (used by HeadNavList or wherever you invoke it)
  return {
    showLogoutConfirm,
  };
};

export default Logoff;
