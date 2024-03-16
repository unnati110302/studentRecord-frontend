import React, { useState, useEffect, useRef} from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import {student_url, api_url} from './configuration';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import bcrypt from 'bcryptjs';
 
 
const UserManagement = ({userName}) => {

    const [selectedRows, setSelectedRows] = useState([]);
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const modalRef = useRef();

    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [IsLocked, setIsLocked] = useState(0);
    const [SecurityQuestionId, setSecurityQuestionId] = useState(4);
    const [AnswerId, setAnswerId] = useState(4);
    const [RoleIds, setRoleIds] = useState('');
    const navigate = useNavigate();

    const handleForm = () => setShowForm(true);
    const handleCloseForm = () => {
      setName('');
      setEmail('');
      setPassword('');
      setIsLocked(0);
      setSecurityQuestionId(0);
      setAnswerId(0);
      setShowForm(false);
      document.body.classList.remove('modal-open');
  };
    
    useEffect(() => {
        getData();
    }, []);

    // const handleSubmit =  (e) => {
    //     e.preventDefault();
    //     const data = {
    //         "name" : name,
    //         "email" : email,
    //         "password" : password,
    //         "isLocked" : isLocked,
    //         "securityQuestionId" : sec_ques,
    //         "answerId" : sec_ans,
    //     }
    //     axios.post(`${api_url}/users`, data)
    //     .then((result) => {
    //         navigate('/crud');
    //         sec_ques++;
    //         sec_ans++;
    //     }).catch((error) => {
    //         console.error('An error occurred during login:', error);
    //     })
    //   };


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
      axios.post(`${api_url}/users?Name=${Name}&Email=${Email}&Password=${Password}&IsLocked=${IsLocked}&SecurityQuestionId=${SecurityQuestionId}&AnswerId=${AnswerId}&RoleIds=${RoleIds}`)
      //axios.post(`${api_url}/users`, data)
      .then((result) => {
          getData();
          clear();
          handleCloseForm();
          toast.success('User has been added');
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
      setAnswerId(0);
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
                <input type='text' className='form-control' placeholder='Enter Name' value={Name}
                onChange = {(e)=> setName(e.target.value)} />
          </div>
          <div className="custom-col">
                <input type='text' className='form-control' placeholder='Enter Email' value={Email}
                onChange = {(e)=> setEmail(e.target.value)} />
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
                <input type='text' className='form-control' placeholder='Enter QuestionId' value={SecurityQuestionId}
                onChange = {(e)=> setSecurityQuestionId(parseInt(e.target.value)|| 0)} />
          </div>
          <div className="custom-col">
                <input type='text' className='form-control' placeholder='Enter Name' value={AnswerId}
                onChange = {(e)=> setAnswerId(parseInt(e.target.value)|| 0)} />
          </div>
          {/* <div className="custom-col">
          <select className="form-control" value={RoleIds} 
                onChange={(e) => setRoleIds(e.target.value)}>
                    <option value="">--Select City--</option>
                    <option value=""><input className='check' type="checkbox" checked={isActive === 1 ? true : false} onChange={(e)=> handleActiveChange(e)} value={isActive} /></option>
                    
                </select>
          </div> */}
          <div className="custom-col">
                <input type='text' className='form-control' placeholder='Enter RoleId' value={RoleIds}
                onChange = {(e)=> setRoleIds(e.target.value)} />
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