import { useNavigate } from 'react-router-dom';
import authService from './authService';

const Logout = () => {
  const navigate = useNavigate();

  const logout = () => {
    authService.signOutExternal().then(() => {
      navigate('/');
      window.location.reload();
    });
  }
}
export default Logout;