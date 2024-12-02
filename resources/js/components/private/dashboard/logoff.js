// utils.js
export const logout = (navigate) => {
  // Remove the auth_token and user_role from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  
  // Optionally, clear other session data if needed
  // localStorage.removeItem('other_session_data');

  // Redirect to the login page
  navigate('/login', { replace: true }); // Use "replace" to prevent going back to the dashboard
  window.location.reload();
};
