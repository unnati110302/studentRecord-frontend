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
import UtilityFunctions from './UtilityFunctions';


const Teacher = ({ userName, role, setTId }) => {

    const [selectedRows, setSelectedRows] = useState([]);

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);;

    const [data, setData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getData();
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
        const result = await authorizedFetch(`${api_url}/teachers`);
        console.log("response:", result);
        const data = await result.json();
        setData(data)
        }
        catch(error){
            console.log(error)
        }
    }

    const handleEdit = async(id) =>{
        setTId(id);

        try {
            navigate('/teacherSubject-edit');
        }
        catch(error){
            console.error('Error editing teacher:', error);
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
            
        const url = `${api_url}/delete-teachers`;
    
        axios
            .delete(url, { data: selectedRows })
            .then((result) => {
            toast.success('Selected teachers have been deleted');
            const updatedData = data.filter((item) => !selectedRows.includes(item.id));
            setData(updatedData);
            setSelectedRows([]); 
            })
            .catch((error) => {
            console.error('Error deleting teachers:', error);
            toast.error('Error deleting teachers');
        })
        .finally(() => {
            setIsConfirmationDialogOpen(false);
        });
    };

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };


    const renderViewAsOptions = () => {
        if (role.includes('Admin') && role.includes('User')) {
            return (
                <>
                    <button className='render' onClick={()=>{navigate('/user')}}>View as user</button>
                    <button className='render' onClick={()=>{navigate('/course')}}>Courses</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student Records</button>
                </>
            );
        // } else if (role.includes('Admin')) {
        //     return <a href="#">View as Admin</a>;
        } else if (role.includes('User')) {
            return <button className='render' onClick={()=>{navigate('/user')}}>View as User</button>;
        } else {
            return null; 
        }
    };

    const handleAddButtonClick=() =>{
        navigate('/teacherSubject');
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
        <div className="navbar-heading">Teacher Record</div>
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
                <th>Mobile</th>
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
                                    <td>{item.mobile}</td>
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
export default Teacher;