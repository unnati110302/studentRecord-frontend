import React, { useState, useEffect} from 'react';
import './style.css';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import {local_url, student_url, api_url} from './configuration';
import { useNavigate } from 'react-router-dom';
import login_img from './login_img.jpg';
import * as forge from 'node-forge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {replacePlusWithEncoded} from './UtilityFunctions';
import Login from './googleLogin';
import Logout from './logout';
import MicroLogin from './microLogin';
import MLogin from './microsoftLogin';

const clientId = "828933434197-t0osoieson8ir7290n65i74smdnfnj05.apps.googleusercontent.com";

const LoginForm = ({ setUserName, setRole}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });
  
 
  useEffect(() => {
    setValidationErrors({
      email: '',
      password: '',
    }
    )
    setEmail('');
    setPassword('');
    
  }, []);
 
  //var accessToken = gapi.auth.getToken().access_token; 

  const handleLogin = (e) => {
    e.preventDefault();
    const publicKey = `-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDE3/DkbE+9QX8UDShJD+DALJryS3L3shC/a8i0+O1H54sVcfdVQrwH3PpIZSORy7fkDzx2IXXXMkToq9rt6cZ5fiG1ortNIQEkg2wD2Sk8Go7I4fS9A+TpMBiV8cO4c51ROV2P6QdvWMC+LC2is7+a4ihMR8Wl621Iw90nWVkAZwIDAQAB-----END PUBLIC KEY-----`;

    var rsa = forge.pki.publicKeyFromPem(publicKey); 
    var encryptedPassword = window.btoa(rsa.encrypt(password));
    console.log(encryptedPassword);
    const encoded = replacePlusWithEncoded(encryptedPassword);
    axios.post(`${api_url}/authenticate?Email=${email}&Password=${encoded}`)
    .then((result) => {
      
      setUserName(result.data.userName);
      console.log(result.data.userName);
      setRole(result.data.role);
      console.log(result.data.role);
     
      if (result.data.role[0] === "Admin") {
        //window.location.href = '/CRUD';
        navigate('/crud');
      }
      else if(result.data.role[0] === "User"){
        //window.location.href = '/User';
        navigate('/user');
      }else {
        alert('Authentication failed');
      }
    }) .catch ((error) =>{
      console.error('An error occurred during login:', error);
    })
  }

  const handleEmailChange = (e) => {
      const inputValue = e.target.value;
      setEmail(inputValue);
      validateEmail(inputValue);
  };

  const handlePasswordChange = (e) => {
    const inputValue = e.target.value;
    setPassword(inputValue);
    validatePassword(inputValue);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (value) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            email: '',
            password: '',
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
  const validatePassword = (value) => {
    if (value.length < 8) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Password should be at least 8 characters long',
      }));
      setInvalid(true);
    } else if (!/[A-Z]/.test(value)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Password should contain at least one uppercase character',
      }));
      setInvalid(true);
    } 
    else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        password: '',
      }));
      setInvalid(false);
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
        <div className='form-control2' style={{ position: 'relative' }}>
        <div style={{ position: 'relative' }}> 
        <label className='label'>
          Password
          { ' ' }<input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
            required
            placeholder="Password"
            style={{ paddingRight: '10px' }}
          />
        </label>
        <span 
                className="login-password-toggle" 
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </span>
        </div>
        <button type="submit" className='custom-btn custom-btn-primary login-btn'>
          Login
        </button>
        <div className='login-txt'>Or Login using</div>
        </div>
        <div className='modal-footer foot'>
        </div>
      </form>
      <div className='google-login'>
        <div className='goggle-btn' ><Login setUserName={setUserName} setRole={setRole} /></div>
        <div className='micro-btn' ><MLogin setUserName={setUserName} setRole={setRole} /></div>
      </div>
    </div>
    <div>
        <Footer></Footer>
    </div>
    </>
  );
};
 
export default LoginForm;