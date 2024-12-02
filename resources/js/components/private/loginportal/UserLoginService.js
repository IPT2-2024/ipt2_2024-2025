import axios from 'axios';
import { handleLoginError } from './components/LoginErrorHandling'; // Import the error handling logic

export const handleLogin = async (values) => {
  try {
    const response = await axios.post('/api/login', values, { timeout: 10000 }); // 10 seconds timeout
    
    if (response.status === 200) {
      return response; // Return the successful response
    } else {
      throw new Error('Login failed. Please check your Username and Password credentials.');
    }
  } catch (error) {
    // Delegate error handling to the external error handler
    throw handleLoginError(error);
  }
};
