import React, { useState, useEffect, useRef} from 'react';
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
//import bcrypt from 'bcryptjs';
 
 
const UserManagement = ({userName}) => {

    const [selectedRows, setSelectedRows] = useState([]);
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const modalRef = useRef();
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [IsLocked, setIsLocked] = useState(0);
    const [SecurityQuestionId, setSecurityQuestionId] = useState(0);
    const [Answer, setAnswer] = useState('');
    const [AnswerId, setAnswerId] = useState(0);
    const [roleIds, setRoleIds] = useState([]);
    const [roleName, setRoleName] = useState([]);
    const [validationErrors, setValidationErrors] = useState({
      Name: '',
      Email: '',
    });

    const navigate = useNavigate();

    const [ansId, setAnsId] = useState(0);
    const [invalid, setInvalid] = useState(false);
    const handleForm = () => setShowForm(true);
    const handleCloseForm = () => {
      setValidationErrors({
        Name: '',
        Email: '',
      }
      )
      setName('');
      setEmail('');
      setPassword('');
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

    const handleSubmit = (e) => {
      e.preventDefault();      
      // const hashedPassword = bcrypt.hashSync(Password);

      const data = {
        "name" : Name,
        "email" : Email,
        "password" : Password,
        "isLocked" : IsLocked,
        "securityQuestionId" : SecurityQuestionId,
        "answerId" : AnswerId,
      } 
      axios.post(`${api_url}/users?Name=${Name}&Email=${Email}&Password=${Password}&IsLocked=${IsLocked}&SecurityQuestionId=${SecurityQuestionId}&AnswerId=${AnswerId}&RoleIds=${roleIds}`)
      //axios.post(`${api_url}/users`, data)
      .then((result) => {
          //handleGetRole(id);
          getData();
          clear();
          handleCloseForm();
          //toast.success('User has been added');
      }).catch((error) => {
          console.error('An error occurred during login:', error);
      })
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

      const getData = () =>{
        axios.get(`${api_url}/users`)
        .then((result)=>{
            setData(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })
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
            toast.success('Selected students have been deleted');
            const updatedData = data.filter((item) => !selectedRows.includes(item.id));
            setData(updatedData);
            setSelectedRows([]); 
            })
            .catch((error) => {
            console.error('Error deleting students:', error);
            //toast.error('Error deleting students');
      })
      .finally(() => {
          setIsConfirmationDialogOpen(false);
      });
    };

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };

    const handleGetRole = (id) =>{
      axios.get(`${local_url}/${id}`)
      .then((result)=>{
          setRoleName(result.data[0]);
      })
      .catch((error)=>{
          console.error('Error getting role:', error);
          //toast.error(error);
      })
  }

  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    setName(inputValue);
    validateName(inputValue);
  };

  const handleEmailChange = (e) => {
      const inputValue = e.target.value;
      setEmail(inputValue);
      validateEmail(inputValue);
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


  // const validateEditName = (value) => {
  //     if (value.trim() !== '') {
  //         if (/^[a-zA-Z\s]+$/.test(value)) {
  //             setValidationErrors((prevErrors) => ({
  //                 ...prevErrors,
  //                 editName: '',
  //             }));
  //             setInvalid((prevInvalid) => {
  //                 return false;  
  //             });
  //         } else {
  //             setValidationErrors((prevErrors) => ({
  //                 ...prevErrors,
  //                 editName: 'Name should contain only alphabets',
  //             }));
  //             setInvalid((prevInvalid) => {
  //                 return true;  
  //             });
  //         }
  //     } else {
  //         setValidationErrors((prevErrors) => ({
  //             ...prevErrors,
  //             editName: 'Name should not be blank',
  //         }));
  //         setInvalid((prevInvalid) => {
  //             return true;  
  //         });
  //     }
  // };

  // const validateEditEmail = (value) => {
  //     if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
  //         setValidationErrors((prevErrors) => ({
  //             ...prevErrors,
  //             editEmail: '',
  //         }));
  //         setInvalid((prevInvalid) => {
  //             return false;  
  //         });
  //     } else {
  //         setValidationErrors((prevErrors) => ({
  //             ...prevErrors,
  //             editEmail: 'Enter a valid email address',
  //         }));
  //         setInvalid((prevInvalid) => {
  //             return true;  
  //         });
  //     }
  // };

  // const validateEditPassword = (value) => {
  //     if ("?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$".test(value)) {
  //         setValidationErrors((prevErrors) => ({
  //             ...prevErrors,
  //             editPassword: '',
  //         }));
  //         setInvalid((prevInvalid) => {
  //             return false;  
  //         });
  //     } else {
  //         if (/^\d{10}$/.test(value)) {
  //             setValidationErrors((prevErrors) => ({
  //                 ...prevErrors,
  //                 editMobile: 'Mobile number should start from 6, 7, 8, or 9',
  //             }));
  //         } else if (/^\d+$/.test(value)) {
  //             setValidationErrors((prevErrors) => ({
  //                 ...prevErrors,
  //                 editMobile: 'Mobile number should be of 10 digits',
  //             }));
  //         } else {
  //             setValidationErrors((prevErrors) => ({
  //                 ...prevErrors,
  //                 editMobile: 'Mobile number should only contain digits',
  //             }));
  //         }
  //         setInvalid((prevInvalid) => {
  //             return true;  
  //         });
  //     }
  // };



    
  return (
    <>
    <div>
        <Header></Header>
    </div>
    <div className='mid-body'>
        <div className='ad'>
        <div className="navbar">
        <div className="navbar-heading">User Record</div>
        <div className="dropdown-container">
            <div className="dropdown">
                <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                <div className="dropdown-content">
                    <a href="http://localhost:3000/">Logout</a>
                </div>
            </div>
        </div>
        </div>
        </div>
        <div className="navbar-buttons">
            <Tooltip title='Add User'><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
            <AddIcon />
            </button></Tooltip>
            <Tooltip title='Delete'><button type="button" className="custom-btn custom-btn-danger"
             onClick={handleMultipleDelete} disabled={selectedRows.length === 0}>
            <DeleteIcon />
            </button></Tooltip>
            <ConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={closeConfirmationDialog}
                onConfirm={confirmDelete}
            />
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
          <div className="custom-col">
                <input type='text' className='form-control' placeholder='Enter Passord' value={Password}
                onChange = {(e)=> setPassword(e.target.value)} />
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
          <div className="custom-col roles">
            <label >Roles:</label>
            <label className='role-check'>
                <input type="checkbox" value="1" checked={roleIds.includes("1")} onChange={() => handleRoleChange("1")} />
                Admin
            </label>
            <label className='role-check'>
                <input type="checkbox" value="2" checked={roleIds.includes("2")} onChange={() => handleRoleChange("2")} />
                User
            </label>
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
                <th>Password</th> 
                {/* <th>IsLocked</th> */}
                {/* <th>Role</th> */}
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
                                    <td>{item.password}</td>
                                    {/* <td>{item.isLocked==0?"False":"True"}</td> */}
                                    {/* <td>{roleName}</td> */}
                                    <td>{item.securityQuestionId}</td>
                                    <td>{item.answerId}</td>
                                    <td colSpan={2}>
                                    <Tooltip title="Edit Details"><button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>  {handleEdit(item.id);}}><BorderColorIcon /></button> </Tooltip>&nbsp;
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
    </>
  )
}
 
export default UserManagement;