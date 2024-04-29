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
import Tooltip from '@mui/material/Tooltip';
import { useNavigate} from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const Subject = ({ userName, role, classId}) =>{
    const [SubjectName, setSubjectName] = useState('');
    const [SubjectCode, setSubjectCode] = useState('');
    const [TotalLectures, setTotalLectures] = useState('');

    const[EditSubjectName, setEditSubjectName] = useState('');
    const[EditTotalLectures, setEditTotalLectures] = useState('');
    const[EditSubjectId, setEditSubjectId] = useState('');
    const[EditCby, setEditCby] = useState(0);
    const[EditMby, setEditMby] = useState(0);

    const [data, setData] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]);

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const modalRef = useRef();

    const [SubjectAdd, setSubjectAdd] = useState(false);
    const handleSubjectAddOpen = () => setSubjectAdd(true);
    const handleSubjectAddClose = () =>{
        setSubjectAdd(false);
        setSubjectName('');
        setTotalLectures('');
        document.body.classList.remove('modal-open');
    }

    const [SubjectEdit, setSubjectEdit] = useState(false);
    const handleSubjectEditOpen = () => setSubjectEdit(true);
    const handleSubjectEditClose = () =>{
        setSubjectEdit(false);
        setSubjectName('');
        setTotalLectures('');
        document.body.classList.remove('modal-open');
    }

    const navigate = useNavigate();

    useEffect(() => {
        console.log(classId);
        getSubjects(classId);
    }, []);


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

    const handleMultipleDelete = () => {
        if (!selectedRows || selectedRows.length === 0) {
            alert('Please select rows to delete.');
        } else {
            setIsConfirmationDialogOpen(true);
        }
        
    };
    const confirmDelete = () => {
            
        const url = `${api_url}/delete-subjects`;
    
        axios
            .delete(url, { data: selectedRows })
            .then((result) => {
            toast.success('Selected subjects have been deleted');
            const updatedData = data.filter((item) => !selectedRows.includes(item.id));
            setData(updatedData);
            setSelectedRows(prevSelectedRows => prevSelectedRows.filter(id => !selectedRows.includes(id))); 
            })
            .catch((error) => {
            console.error('Error deleting students:', error.message);
            toast.error('Error deleting students');
        })
        .finally(() => {
            setIsConfirmationDialogOpen(false);
        });
    };

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };


    const handleAddSubjectClick=() =>{
        handleSubjectAddOpen(); 
        document.body.classList.add('modal-open');
    }

    const getSubjects = async(id) =>{
        console.log(id);
        try{
        const result = await axios.get(`${api_url}/subject/byclass/${id}`);
        console.log(result.data.subCode);
        const data = await result.data;
        setData(data);
        }
        catch(error){
            console.log(error.message);
        }
    }

    const handleSubmit = async(e) =>{
        try{
            e.preventDefault();      
            const currentDate = new Date().toISOString();
            const url = `${api_url}/subject`;
            const data = {
                "classId":classId,
                "subCode":"1",
                "name": SubjectName,
                "totalLectures":TotalLectures,
                "isActive": 1,
                "createdBy": 1, 
                "createdOn": currentDate, 
                "modifiedBy": 1,  
                "modifiedOn": currentDate,
            } 
            const result = await axios.post(url, data);
            setSubjectCode(result.data.subCode);
            getSubjects(classId);
            const response = await result.data;
            clear();
            handleSubjectAddClose();
            toast.success('Class has been added');
            }catch(error){
                toast.error('A record with the same email or mobile number already exists.');
                
            }
    }

    const clear = ()=>{
        setSubjectCode('');
        setEditSubjectName('');
        setTotalLectures('');
    }

    const handleEditSubject = async(id) =>{
        handleSubjectEditOpen(); 
        document.body.classList.add('modal-open');
        try {
            const result = await axios(`${api_url}/getSubject/${id}`)
            console.log("response:", result);
            const data = await result.data;
            setEditSubjectName(data.name);
            setEditTotalLectures(data.totalLectures);
            setSubjectCode(data.subCode);
            console.log(data.subCode);
            setEditSubjectId(id);
        }
        catch(error){
            console.error('Error editing student:', error.messgae);
            toast.error(error.message);
        }
    }
    
    const handleUpdateSubject = async() =>{
        try{
            console.log(EditSubjectId);
           const url = `${api_url}/updateSubject/${EditSubjectId}`;
           const currentDate = new Date().toISOString();
           const data = {
               "id": EditSubjectId,
               "classId": classId,
               "subCode": SubjectCode,
               "name": EditSubjectName,
               "totalLectures":EditTotalLectures,
               "isActive": 1,
               "createdBy": EditCby,
               "createdOn": currentDate,
               "modifiedBy": EditMby,
               "modifiedOn": currentDate,
           }
           const result = await axios.put(url, data);
            setEditSubjectName('');
            handleSubjectEditClose();
            getSubjects(classId)
            toast.success('Class has been updated');
           }catch(error){
                toast.error(error.message);
            }
    }
    

    return(
        <Fragment>
            <div className='mid-body'>
            <div className='course-edit-section'>
                    <h2>Subjects</h2>
                </div>
                <div className="navbar-buttons">
                    <Tooltip title='Add Subjects'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddSubjectClick}>
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
                </div>
                <div>
                {SubjectAdd && (
                    <>
                    <div className='modal-container' ref={modalRef} >
                    <div className='modal-header'>
                    <span class="close-btn" onClick = {handleSubjectAddClose}>&times;</span>
                        <h2>Add Subjects</h2>
                    </div>
                    <div className='modal-body'>
                        <div className="custom-col">
                        <label>Subject Name : </label>
                        <input type='text' className='form-control' placeholder='Enter Subject Name' value={SubjectName}
                        onChange = {(e)=> setSubjectName(e.target.value)} />
                        </div>
                        <div className="custom-col">
                        <label>Total Lectures : </label>
                        <input type='text' className='form-control' placeholder='Enter Total Lectures' value={TotalLectures}
                        onChange = {(e)=> setTotalLectures(e.target.value)} />
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button className='custom-btn custom-btn-secondary-close' onClick={handleSubjectAddClose}>
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
                        <th>Subject name</th>
                        <th>Subject code</th>
                        <th>Total Lectures</th>
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
                                            <td>{item.subCode}</td>
                                            <td>{item.totalLectures}</td>
                                            <td colSpan={2}>
                                            <Tooltip title="Edit Details"><span><button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>  {handleEditSubject(item.id);}}><BorderColorIcon /></button></span></Tooltip>&nbsp;
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
        {SubjectEdit && (
            <div className='modal-container' ref={modalRef} >
            <div className='modal-header'>
                <span class="close-btn" onClick = {handleSubjectEditClose}>&times;</span>
                <h2>Edit Subject</h2>
            </div>
            <div className='modal-body'>
                <div className="custom-col">
                <label>Subject Name : </label>
                <input type='text' className='form-control' placeholder='Enter Subject' value={EditSubjectName}
                onChange={(e) => {
                    setEditSubjectName(e.target.value);
                }}
                />
                </div>
                <div className="custom-col">
                <label>Total Lectures : </label>
                <input type='text' className='form-control' placeholder='Enter Total Lectures' value={EditTotalLectures}
                onChange={(e) => {
                    setEditTotalLectures(e.target.value);
                }}
                />
                </div>
           </div>
            <div className='modal-footer'>
                <button  className='custom-btn custom-btn-secondary-close' onClick={handleSubjectEditClose}>
                    Close
                </button>
                <button className='custom-btn custom-btn-primary' onClick={handleUpdateSubject}>
                    Save
                </button>
                </div>
        </div>
        )}
        </div>           
        </div>
        </Fragment>
    );
}

export default Subject;