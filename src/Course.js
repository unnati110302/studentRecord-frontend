import React, {useState, useEffect, Fragment, useRef  } from 'react';
import './style.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {student_url, api_url, local_url} from './configuration';
import Header from './Header';
import Footer from './Footer';
import ConfirmationDialog from './Confirmation';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const Course = ({ userName, role, setId }) => {

    const [show, setShow] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const modalRef = useRef();
    const [invalid, setInvalid] = useState(false);

    const [validationErrors, setValidationErrors] = useState({
        name: '',
        email: '',
        mobile: '',
    });

    const handleClose = () => {
        setValidationErrors({
            name: '',
            email: '',
            mobile: '',
        }
        )
        setShow(false);
        document.body.classList.remove('modal-open');
    }
    const handleShow = () => setShow(true);

    const handleCloseForm = () => {
        setValidationErrors({
            name: '',
            email: '',
            mobile: '',
        })
        setName('');
        setIsActive(0);
        setShowForm(false);
        document.body.classList.remove('modal-open');
    };
    const handleForm = () => setShowForm(true);

    const[name, setName] = useState('');
    const[isActive, setIsActive] = useState(0);
    const[createdBy, setCby] = useState(0);
    const[createdOn, setCon] = useState('');
    const[modifiedBy, setMby] = useState(0);
    const[modifiedOn, setMon] = useState('');

    const[EditName, setEditName] = useState('');
    const[EditIsActive, setEditIsActive] = useState(0);
    const[EditCby, setEditCby] = useState(0);
    const[EditCon, setEditCon] = useState('');
    const[EditMby, setEditMby] = useState(0);
    const[EditMon, setEditMon] = useState('');

    const [data, setData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getData();
   
        const handleDocumentClick = (event) => {
            const modalContainer = modalRef.current;
            if (modalContainer && !modalContainer.contains(event.target)) {
                handleCloseForm();
                handleClose();
            }
        };
   
        document.addEventListener('mousedown', handleDocumentClick);
   
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);

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


    const getData = async() =>{
        try{
        const result = await authorizedFetch(`${api_url}/courses`);
        console.log("response:", result);
        const data = await result.json();
        setData(data)
        }
        catch(error){
            console.log(error)
        }
    }

    const handleEdit = async(id) =>{
        try {
            console.log(id);
            setId(id);
            navigate('/courseEdit');
        }
        catch(error){
            console.error('Error editing student:', error);
            toast.error(error);
        }
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

    const handleMultipleDelete = () => {
        if (selectedRows.length === 0) {
            alert('Please select rows to delete.');
        } else {
            setIsConfirmationDialogOpen(true);
        }
        
    };
    const confirmDelete = () => {
            
        const url = `${api_url}/delete-courses`;
    
        axios
            .delete(url, { data: selectedRows })
            .then((result) => {
            toast.success('Selected courses have been deleted');
            const updatedData = data.filter((item) => !selectedRows.includes(item.id));
            setData(updatedData);
            setSelectedRows([]); 
            })
            .catch((error) => {
            console.error('Error deleting courses:', error);
            toast.error('Error deleting courses');
        })
        .finally(() => {
            setIsConfirmationDialogOpen(false);
        });
    };

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };

    const handleSubmit = async(e) => {
        try{
        e.preventDefault();      
        const currentDate = new Date().toISOString();
        const url = `${api_url}/courses`;
        const data = {
            "name": name,
            "isActive": 1,
            "createdBy": 1, 
            "createdOn": currentDate, 
            "modifiedBy": 1,  
            "modifiedOn": currentDate,
        } 
        const token = await getToken();
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const result = await axios.post(url, data, config);
        getData();
        const response = result.data;
        //setCourseId(response.id);
        console.log(response.id);
        clear();
        handleCloseForm();
        toast.success('Course has been added');
        getData();
        }catch(error){
            if(invalid==true){
                toast.error('Invalid details');
            }
            else{
                toast.error('A record with the same email or mobile number already exists.');
            }
        }
    };

    const clear = () =>{
        setName('');
        setIsActive('');
    }

    const renderViewAsOptions = () => {
        if (role.includes('Admin') && role.includes('User')) {
            return (
                <>
                    <button className='render' onClick={()=>{navigate('/user')}}>View as user</button>
                    <button className='render' onClick={()=>{navigate('/teacher')}}>Teacher Records</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student Records</button>
                </>
            );
        } else if (role.includes('User')) {
            return <button className='render' onClick={()=>{navigate('/user')}}>View as User</button>;
        } else {
            return null; 
        }
    };

    const handleAddButtonClick=() =>{
        handleForm(); 
        document.body.classList.add('modal-open');
   }
    const handleActiveChange = (e) =>{
        if(e.target.checked){
            setIsActive(1);
        }
        else{
            setIsActive(0);
        }
    }

    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        const selectedIds = checked ? data.map(item => item.id) : [];
    
        setSelectedRows(selectedIds);
    };
    
    return (
        <Fragment>
          <ToastContainer />
          <div>
              <Header></Header>
          </div>
        <div className='mid-body'>
        <div className='ad'>
        <div className="navbar">
        <div className="navbar-heading">Courses</div>
        <div className="dropdown-container">
            <div className="dropdown">
                <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                <div className="dropdown-content">
                    <button className='render' onClick={()=>{navigate('/')}}>Logout</button>
                    {renderViewAsOptions()}
                    <button  className='render' onClick={()=>{navigate('/userManagement')}}>User Records</button>
                </div>
            </div>
        </div>
        </div>
        </div>
        <div className="navbar-buttons">
            <Tooltip title='Add Student'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
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
        <div>
        {showForm && (
            <>
            <div className='modal-container' ref={modalRef} >
            <div className='modal-header'>
            <span class="close-btn" onClick = {handleCloseForm}>&times;</span>
                <h2>Add Course</h2>
            </div>
            <div className='modal-body'>
                <div className="custom-col">
                <label>Course Name : </label>
                <input type='text' className='form-control' placeholder='Enter Course Name' value={name}
                onChange = {(e)=> setName(e.target.value)} />
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
            </>
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
                <th>Course name</th>
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
        </div>
    <div>
        <Footer></Footer>
    </div>
    </Fragment>
    )
  

}

export default Course;