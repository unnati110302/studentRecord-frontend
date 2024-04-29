import React, { useState, Fragment,useEffect, useRef} from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import {local_url, student_url, api_url} from './configuration';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from './Confirmation';
import Tooltip from '@mui/material/Tooltip';
import * as forge from 'node-forge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { encodeBase64 } from 'bcryptjs';
import {replacePlusWithEncoded} from './UtilityFunctions';
//import bcrypt from 'bcryptjs';
 
 
const UserManagement = ({ userName, role }) => {

    const [selectedRows, setSelectedRows] = useState([]);
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const modalRef = useRef();
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [IsLocked, setIsLocked] = useState(0);
    const [SecurityQuestionId, setSecurityQuestionId] = useState(0);
    const [Answer, setAnswer] = useState('');
    const [AnswerId, setAnswerId] = useState(0);
    const [roleIds, setRoleIds] = useState([]);
    const [roles, setRole] = useState('');
    const [validationErrors, setValidationErrors] = useState({
      Name: '',
      Email: '',
      Password: '',
      ConfirmPassword: '',
    });

    const navigate = useNavigate();

    const [ansId, setAnsId] = useState(0);
    const [invalid, setInvalid] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleForm = () => setShowForm(true);
    const handleCloseForm = () => {
      setValidationErrors({
        Name: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
      }
      )
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsLocked(0);
      setSecurityQuestionId(0);
      setAnswerId(0);
      setRoleIds('');
      setShowForm(false);
      document.body.classList.remove('modal-open');
  };
    
    useEffect(() => {
        getData();
    }, []);

    const answerToIdMap = new Map();

    const handleSubmit = async(e) => {
      e.preventDefault();      
      const publicKey =`-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDE3/DkbE+9QX8UDShJD+DALJryS3L3shC/a8i0+O1H54sVcfdVQrwH3PpIZSORy7fkDzx2IXXXMkToq9rt6cZ5fiG1ortNIQEkg2wD2Sk8Go7I4fS9A+TpMBiV8cO4c51ROV2P6QdvWMC+LC2is7+a4ihMR8Wl621Iw90nWVkAZwIDAQAB-----END PUBLIC KEY-----`;
      var rsa = forge.pki.publicKeyFromPem(publicKey); 
      console.log(rsa);
      var encryptedPassword = window.btoa(rsa.encrypt(Password));
      console.log(Password);
      console.log(encryptedPassword);
      const encoded = replacePlusWithEncoded(encryptedPassword);
      try{
          const token = await getToken();
          const config = {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          };
          const result = await axios.post(`${api_url}/users?Name=${Name}&Email=${Email}&Password=${encoded}&IsLocked=${IsLocked}&SecurityQuestionId=${SecurityQuestionId}&AnswerId=${AnswerId}&role=${roleIds}`, {}, config);
          console.log("response:", result.data); 
          console.log(encoded);
          getData();
          clear();
          handleCloseForm();
          toast.success('User has been added');
      }catch(error){
          toast.error('An error occurred in adding the user', error);
      }
    };

    const getToken = async () => {
        const url = `${local_url}/login`;
        const data = {
            "email": "unnati@gmail.com",
            "password": "Unnati@1",
        };
     
        try {
            const result = await axios.post(url, data);
            const token = result.data.accessToken;
            //console.log(token);
            return token;
        } catch (error) {
            console.error('Error fetching token:', error);
            throw new Error('Failed to fetch token');
        }
    };

    const authorizedFetch = async (url, options = {}) => {
        try {
            const token = await getToken();
            if (!options.headers) {
                options.headers = {};
            }
            options.headers.Authorization = `Bearer ${token}`;
            const response = await fetch(url, options);
     
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
     
            return response;
        } catch (error) {
            console.error('Error in authorizedFetch:', error);
            throw error;
        }
    };

    const clear = () =>{
      setName('');
      setEmail('');
      setPassword('');
      setIsLocked(0);
      setSecurityQuestionId(0);
      setAnswerId('');
    }
      const handleCheckboxChange = (id) => {
        const updatedSelectedRows = [...selectedRows];
        if (updatedSelectedRows.includes(id)) {
          const index = updatedSelectedRows.indexOf(id);
          updatedSelectedRows.splice(index, 1);
        } else {
          updatedSelectedRows.push(id);
        }
        setSelectedRows(updatedSelectedRows);
      };

      const handleSelectAll = (event) => {
        const checked = event.target.checked;
        const selectedIds = checked ? data.map(item => item.id) : [];
    
        setSelectedRows(selectedIds);
      };

      const getData = async() =>{
        try{
        const result = await authorizedFetch(`${api_url}/users`);
        console.log("response:", result);
        const data = await result.json();
        setData(data)
        //axios.get(`${api_url}/users`)
        // .then((result)=>{
        //     setData(result.data)
        // })
        }
        catch(error){
            console.log(error)
        }
    }

    const handleAddButtonClick=() =>{
      handleForm(); 
      document.body.classList.add('modal-open');
    }

    const handleEdit = () =>{
      console.log("edit");
    }

    const handleRoleChange = (roleValue) =>{
        if(roleIds.includes(roleValue)){
            setRoleIds(roleIds.filter(role => role !== roleValue))
        }else{
            setRoleIds([...roleIds, roleValue])
        }
    }

    const handleQuestionChange = (event) => {
        setSecurityQuestionId(parseInt(event.target.value));
    }
    const generateUniqueId = () =>{
        // const timestamp = new Date().getTime();
        // return timestamp;
        return ansId + 1;
    }
    const handleUserInput = (userAnswer) =>{
        setAnswer(userAnswer);
        if(answerToIdMap.has(userAnswer)){
            setAnswerId(answerToIdMap.get(userAnswer))
        }
        else{
            const uniqueId = generateUniqueId();
            answerToIdMap.set(userAnswer, uniqueId);
            setAnsId(uniqueId);
            setAnswerId(uniqueId);
        }
    }

    const handleMultipleDelete = () => {
      if (selectedRows.length === 0) {
          alert('Please select rows to delete.');
      } else {
          setIsConfirmationDialogOpen(true);
      }
     
    };
 
    const confirmDelete = () => {
           
        const url = `${local_url}/delete-multiple`;
   
        axios
            .delete(url, { data: selectedRows })
            .then((result) => {
            toast.success('Selected users have been deleted');
            const updatedData = data.filter((item) => !selectedRows.includes(item.id));
            setData(updatedData);
            setSelectedRows([]);
            })
            .catch((error) => {
            console.error('Error deleting students:', error);
            toast.error('Error deleting users');
      })
      .finally(() => {
          setIsConfirmationDialogOpen(false);
      });
    };
 
    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };
 

  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    setName(inputValue);
    validateName(inputValue);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

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

  const validateName = (value) => {
      if (value.trim() !== '') {
          if (/^[a-zA-Z\s]+$/.test(value)) {
              setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  Name: '',
              }));
              setInvalid((prevInvalid) => {
                  return false;  
              });
          } else {
              setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  Name: 'Name should contain only alphabets',
              }));
              setInvalid((prevInvalid) => {
                  return true;  
              });
          }
      } else {
          setValidationErrors((prevErrors) => ({
              ...prevErrors,
              Name: 'Name should not be blank',
          }));
          setInvalid((prevInvalid) => {
              return true;  
          });
      }
    };

  const validateEmail = (value) => {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setValidationErrors((prevErrors) => ({
              ...prevErrors,
              Email: '',
          }));
          setInvalid((prevInvalid) => {
              return false;  
          });
      } else {
          setValidationErrors((prevErrors) => ({
              ...prevErrors,
              Email: 'Enter a valid email address',
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
            Password: 'Password should be at least 8 characters long',
          }));
          setInvalid(true);
        } else if (!/[A-Z]/.test(value)) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            Password: 'Password should contain at least one uppercase character',
          }));
          setInvalid(true);
        } 
        else {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            Password: '',
          }));
          setInvalid(false);
        }
    };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value !== Password) {
      setErrorMessage('Passwords do not match');
    } else {
      setErrorMessage('');
    }
  };

  const renderViewAsOptions = () => {
    if (role.includes('Admin') && role.includes('User')) {
        return (
            <>
                {/* <a href="#">View as admin</a> */}
                <button className='render' onClick={()=>{navigate('/user')}}>View as user</button>
            </>
        );
    // } else if (role.includes('Admin')) {
    //     return <a className='render' href="#">View as Admin</a>;
    } else if (role.includes('User')) {
        return <button className='render' onClick={()=>{navigate('/user')}}>View as User</button>;
    } else {
        return null; 
    }
};

    
  return (
    <Fragment>
        <ToastContainer />
    <div>
        <Header></Header>
    </div>
    <div>
        <div className='ad'>
        <div className="navbar">
        <div className="navbar-heading">User Record</div>
        <div className="dropdown-container">
            <div className="dropdown">
                <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                <div className="dropdown-content">
                    <button className='render' onClick={()=>{navigate('/')}}>Logout</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student record</button>
                    {renderViewAsOptions()}
                </div>
            </div>
        </div>
        </div>
        </div>
        <div className="navbar-buttons">
            <Tooltip title='Add User'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
            <AddIcon />
            </button></span></Tooltip>
            <Tooltip title='Delete'><span><button type="button" className="custom-btn custom-btn-danger"
             onClick={handleMultipleDelete} disabled={selectedRows.length === 0}>
            <DeleteIcon />
            </button></span></Tooltip>
            <ConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={closeConfirmationDialog}
                onConfirm={confirmDelete}
            />
            <div className='viewingAs'><h4>Viewing as Admin</h4></div>
        </div>
      </div>
    {/* <div className="dropdown-container user-navbar">
            <div className="dropdown">
                <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                <div className="dropdown-content">
                    <a href="http://localhost:3000/">Logout</a>
                </div>
            </div>
    </div> */}
    <div>
    {showForm && (
      <div className='modal-container cont2' ref={modalRef}>
        <div className='modal-header'>
            <span class="close-btn" onClick = {handleCloseForm}>&times;</span>
                <h2>Add New User</h2>
        </div>
        <div className='modal-body'>
          <div className="custom-col">
          {validationErrors.Name && (
              <div className='invalid-feedback'>{validationErrors.Name}</div>
          )}
          <input type='text' className={`form-control ${validationErrors.Name ? 'is-invalid' : ''}`} placeholder='Enter name' value={Name} 
          onChange={handleNameChange}/>
          </div>
          <div className="custom-col">
          {validationErrors.Email && (
              <div className='invalid-feedback'>{validationErrors.Email}</div>
          )}
          <input type='text' className={`form-control ${validationErrors.Email ? 'is-invalid' : ''}`} placeholder='Enter email' value={Email}
          onChange={handleEmailChange} />
          </div>
          <div className="custom-col" style={{ position: 'relative' }}>
            {validationErrors.Password && (
              <div className='invalid-feedback'>{validationErrors.Password}</div>
            )}
            <div id='pass' style={{ position: 'relative' }}> 
              <input
                type={passwordVisible ? 'text' : 'password'}
                className={`form-control ${validationErrors.Password ? 'is-invalid' : ''}`}
                placeholder='Enter password'
                value={Password}
                onChange={handlePasswordChange}
                style={{ paddingRight: '5px' }} 
              />
              <span 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </span>
            </div> 
          </div>
          <div className="custom-col">
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <input id='confirm-pass' type="password" value={ConfirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" />
          </div>
          {/* <div className="custom-col" id='isActive-checkbox'>
                <input className='check' type="checkbox" checked={IsLocked} onChange={(e)=> setIsLocked(e.target.checked)} />
                <label>IsLocked</label>
          </div> */}
          <div className="custom-col">
               <label htmlFor='questionSelect'>Security question </label>
               <select id='questionSelect' value={SecurityQuestionId} onChange={handleQuestionChange}>
                    <option value="0">- -</option>
                    <option value="1">What is the name of your first school?</option>
                    <option value="2">Who is your Favourite author?</option>
                    <option value="3">Where were you born?</option>
               </select>
          </div>
          <div className="custom-col">
                <input type='text' className='form-control' placeholder='Enter your answer' value={Answer}
                onChange = {(e)=> handleUserInput(e.target.value)} />
          </div>
          {/* <div className="custom-col">
          <select className="form-control" value={RoleIds} 
                onChange={(e) => setRoleIds(e.target.value)}>
                    <option value="">--Select City--</option>
                    <option value=""><input className='check' type="checkbox" checked={isActive === 1 ? true : false} onChange={(e)=> handleActiveChange(e)} value={isActive} /></option>
                    
                </select>
          </div> */}
          <div className="custom-col">
            <div className='roles'>
            <label >Roles:</label>
            <label className='role-check'>
                <input type="checkbox" value="1" checked={roleIds.includes("1")} onChange={() => handleRoleChange("1")} />
                &nbsp;Admin
            </label>
            <label className='role-check'>
                <input type="checkbox" value="2" checked={roleIds.includes("2")} onChange={() => handleRoleChange("2")} />
                &nbsp;User
            </label>
           </div>
        </div>
        </div>
        <div className='modal-footer'>
                <button className='custom-btn custom-btn-secondary-close' onClick={handleCloseForm}>
                    Close
                </button>
                <button className='custom-btn custom-btn-primary' onClick={handleSubmit}>
                    Save
                </button>
        </div>
      </div>
    )}
    </div>
    <div className="table-container">
        <table>
            <thead>
                <tr>
                <th id='select-header'>
                     <input
                        className='select-checkbox'
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedRows.length === data.length && data.length !== 0}
                    />
                </th>
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                {/* <th>Password</th>  */}
                {/* <th>IsLocked</th> */}
                <th>Role</th>
                <th>SecurityQuestionId</th>
                <th>AnswerId</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    data && data.length >0?
                        data.map((item, index)=>{
                             
                            return(
                                <tr key={index}>
                                    <td>
                                        <input
                                        className='select-checkbox'
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </td>
                                    <td>{index+1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    {/* <td>{item.password}</td> */}
                                    {/* <td>{item.isLocked==0?"False":"True"}</td> */}
                                    <td>{item.role}</td>
                                    <td>{item.securityQuestionId}</td>
                                    <td>{item.answerId}</td>
                                    <td colSpan={2}>
                                    <Tooltip title="Edit Details"><span><button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>  {handleEdit(item.id);}}><BorderColorIcon /></button></span></Tooltip>&nbsp;
                                    </td>
                                </tr>
                            )
                        })
                        :
                        'Loading..'
                }
            </tbody>
        </table>
        </div>
    <div>
        <Footer></Footer>
    </div>
    </Fragment>
  )
}
 
export default UserManagement;