import React, { useState, useEffect } from 'react';
import './style.css';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import {local_url, student_url, api_url} from './configuration';
import { useNavigate } from 'react-router-dom';
 import login_img from './login_img.jpg';
 
 
const LoginForm = ({ setName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({
    email: '',
  });
 
  useEffect(() => {
    setValidationErrors({
      email: '',
    }
    )
    setEmail('');
    setPassword('');
  }, []);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api_url}/authenticate?Email=${email}&Password=${password}`);
 
      setName(response.data.userName);
     
      if (response.data.role[0] === "Admin") {
        //window.location.href = '/CRUD';
        navigate('/crud');
      }
      else if(response.data.role[0] === "User"){
        //window.location.href = '/User';
        navigate('/user');
      }else {
        alert('Authentication failed');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  const handleEmailChange = (e) => {
      const inputValue = e.target.value;
      setEmail(inputValue);
      validateEmail(inputValue);
  };

  const validateEmail = (value) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            email: '',
        }));
        setInvalid((prevInvalid) => {
            return false;  
        });
    } else {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            email: 'Enter a valid user name',
        }));
        setInvalid((prevInvalid) => {
            return true;  
        });
    }
  };


 
 
  return (
    <>
    <div>
        <Header></Header>
    </div>
    <img src={login_img} className='login-img' alt='login img' /> 
    <div className='modal-container cont'>
      <h2 className='modal-header heading'>Login</h2>
      <form onSubmit={handleLogin} className='login-form'>
        <div className='form-control2'>
        {validationErrors.email && (
              <div className='invalid-feedback'>{validationErrors.email}</div>
        )}
        <label className='label'>
          Username
          { ' ' }<input
            type="text"
            value={email}
            onChange={handleEmailChange} 
            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
            required
            placeholder="Username"
          />
        </label>
        </div>
        <div className='form-control2'>
        <label className='label'>
          Password
          { ' ' }<input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='login-input'
            required
            placeholder="Password"
          />
        </label>
        </div>
        <div className='modal-footer foot'>
        <button type="submit" className='custom-btn custom-btn-primary login-btn'>
          Login
        </button>
        </div>
      </form>
    </div>
    <div>
        <Footer></Footer>
    </div>
    </>
  );
};
 
export default LoginForm;