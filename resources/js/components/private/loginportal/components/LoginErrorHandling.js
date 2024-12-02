export const handleLoginError = (error) => {
    if (error.response) {
      // Server responded with a status other than 200
      return new Error('Login failed. Please check your Username and Password credentials.');
    } else if (error.request) {
      // No response from the server
      return new Error('Server is not responding. Please try again later.');
    } else {
      // General error
      return new Error('An error occurred. Please try again later.');
    }
  };
  