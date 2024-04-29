import axios from 'axios';
import { api_url } from './configuration';

const authService = () => {
  const signOutExternal = () => {
    localStorage.removeItem('token');
    console.log('token deleted');
  };

  const loginWithGoogle = async (credentials) => {
    const headers = { 'Content-Type': 'application/json' };
    try {
      const response = await axios.post(`${api_url}/authenticate/validate-google-token`, JSON.stringify(credentials), { headers });
      return response.data;
    } catch (error) {
      console.error('Error logging in with Google', error);
    }
  };

  return { signOutExternal, loginWithGoogle };
};

export default authService;
