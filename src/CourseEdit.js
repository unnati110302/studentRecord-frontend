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
import PersonIcon from '@mui/icons-material/Person'
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 


const CourseEdit = ({ userName, role, id, setClassId}) => {

    const[EditId, setEditId] = useState('');
    const[EditName, setEditName] = useState('');
    const[EditIsActive, setEditIsActive] = useState(0);
    const[EditCby, setEditCby] = useState(0);
    const[EditMby, setEditMby] = useState(0);


    const [data, setData] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]);

    const[name, setName] = useState('');
    const[session, setSession] = useState('');
    const[isActive, setIsActive] = useState(0);

    const [showForm, setShowForm] = useState(false);

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const modalRef = useRef();

    const handleCloseForm = () => {
        setName('');
        setSession('');
        setIsActive(0);
        setShowForm(false);
        document.body.classList.remove('modal-open');
    };
    const handleForm = () => setShowForm(true);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
        console.log("Grid Ready");
        setGridApi(params.api);
    };	


    const navigate = useNavigate();

    useEffect(() => {
        console.log(id);
        getData(id);
        getCourse(id);  
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

    const getCourse = ()=>{
        if (id) {
            authorizedFetch(`${api_url}/get${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                        setEditName(data.name); 
                        setEditId(id);
                    } else {
                        console.error('Empty response received');
                    }
                })
                .catch(error => {
                    console.error('Error fetching course:', error);
                });
        }
    }

    const getData = async(id) =>{
        console.log(id);
        try{
        const result = await axios.get(`${api_url}/class/bycourse/${id}`);
        console.log("response:", result);
        const data = await result.data;
        setData(data);
        }
        catch(error){
            console.log(error)
        }
    }

    
    const clear = () =>{
        setEditName('');
        setEditIsActive('');
    }

    const renderViewAsOptions = () => {
        if (role.includes('Admin') && role.includes('User')) {
            return (
                <>
                    <button className='render' onClick={()=>{navigate('/user')}}>View as user</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student Records</button>
                </>
            );
        } else if (role.includes('User')) {
            return <button className='render' onClick={()=>{navigate('/user')}}>View as User</button>;
        } else {
            return null; 
        }
    };

    const handleUpdate = async() =>{
        try{
            console.log(EditId);
           const url = `${api_url}/update/${EditId}`;
           const currentDate = new Date().toISOString();
           const data = {
               "id": EditId,
               "name": EditName,
               "isActive": 1,
               "createdBy": EditCby,
               "createdOn": currentDate,
               "modifiedBy": EditMby,
               "modifiedOn": currentDate,
           }
           const token = await getToken();
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
           const result = await axios.put(url, data, config);
           navigate('/course');
            clear();
            toast.success('Course has been updated');
           }catch(error){
                toast.error(error);
            }
    }

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
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

    const handleEdit = (id) =>{
        console.log(id);
        setClassId(id);
        navigate('/section');

    }

    const handleSubmit = async(e) =>{
        try{
            e.preventDefault();      
            const currentDate = new Date().toISOString();
            const url = `${api_url}/classes`;
            const data = {
                "courseId":id,
                "name": name,
                "session": session,
                "isActive": 1,
                "createdBy": 1, 
                "createdOn": currentDate, 
                "modifiedBy": 1,  
                "modifiedOn": currentDate,
            } 
            const result = await axios.post(url, data);
            getData(id);
            getCourse(id);
            const response = await result.data;
            clear();
            handleCloseForm();
            toast.success('Class has been added');
            getData();
            }catch(error){
                toast.error('A record with the same email or mobile number already exists.');
                
            }
    }

    const handleCheckboxChange = (id) => {
        console.log("enter");
        const updatedSelectedRows = [...selectedRows];
        if (updatedSelectedRows.includes(id)) {
          const index = updatedSelectedRows.indexOf(id);
          updatedSelectedRows.splice(index, 1);
        } else {
          updatedSelectedRows.push(id);
        }
        setSelectedRows(updatedSelectedRows);
    };

    const handleSelectionChanged = (event) => {
       if(gridApi){
        const selectedNodes = gridApi.getSelectedNodes();
        console.log(selectedNodes);
        const selectedData = selectedNodes.map(node => node.data);
        console.log(selectedData);
        setSelectedRows(selectedData);
       }
    };

    const handleMultipleDelete = () => {
        console.log("open");
        setIsConfirmationDialogOpen(true);
        console.log("open");
    };

    const confirmDelete = () => {
        console.log(selectedRows);
        const ids = selectedRows.map(row => row.id); 
        console.log("ids"+ids);
        axios.delete(`${api_url}/delete-classes`, { data: ids })
            .then(response => {
                console.log('Selected students have been deleted.');
                const updatedData = data.filter((item)=>!selectedRows.includes(item.id));
                setData(updatedData);
                setSelectedRows([]);
                getData(id);
            })
            .catch(error => {
                console.error('Error deleting students:', error);
            })
            .finally(() => {
                setIsConfirmationDialogOpen(false);
            });
    };

    const actionsCellRenderer = (params) => {
    return (
        <>
        <button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>{handleEdit(params.data.id)}}>Edit</button>
        </>
    );
    };

    const [colDefs, setColDefs] = useState([   
        { headerCheckboxSelection: true, checkboxSelection: true, onSelectionChanged: () => {
            const selectedRows = gridApi.api.getSelectedRows();
            console.log("rows"+selectedRows)
            const selectedIds = selectedRows.map(row => row.id);
            console.log("ids"+selectedIds)
            handleCheckboxChange(selectedIds);
        }, width: 90 },
        { headerName: "S.No.", valueGetter: "node.rowIndex + 1", width: 140 },
        { headerName: "Class Name", field: "name" },
        { headerName: "Session", field: "session" },
        { headerName: "Actions", cellRenderer: actionsCellRenderer },
    ]);

    return(
        <Fragment>
           <ToastContainer />
           <div>
              <Header></Header>
           </div>
           <div className='mid-body'>
            <div className='ad'>
            <div className="navbar">
            <div className="navbar-heading">Edit Course</div>
            <div className="dropdown-container">
                <div className="dropdown">
                    <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                    <div className="dropdown-content">
                        <button className='render' onClick={()=>{navigate('/')}}>Logout</button>
                        {renderViewAsOptions()}
                        <button className='render' onClick={()=>{navigate('/course')}}>Courses</button>
                    </div>
                </div>
            </div>
            </div>
            </div>
            <div className='course-edit-section'>
            <div className="custom-col">
                <label>Name : </label>
                <input type='text' className='form-control' placeholder='Enter Course Name' value={EditName}
                onChange={(e) => {
                    setEditName(e.target.value);
                }}
                />
            </div>
            </div>
            <div className='edit-save'>
                <button className='custom-btn custom-btn-primary' onClick={handleUpdate}>
                    Save
                </button>
            </div>
            <div>
                <div className='course-edit-section'>
                    <h2>Classes</h2>
                </div>
                <div className="navbar-buttons">
                    <Tooltip title='Add Class'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
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
                {showForm && (
                    <>
                    <div className='modal-container' ref={modalRef} >
                    <div className='modal-header'>
                    <span class="close-btn" onClick = {handleCloseForm}>&times;</span>
                        <h2>Add Class</h2>
                    </div>
                    <div className='modal-body'>
                        <div className="custom-col">
                        <label>Enter Class Name : </label>
                        <input type='text' className='form-control' placeholder='Enter Class Name' value={name}
                        onChange = {(e)=> setName(e.target.value)} />
                        </div>
                        <div className="custom-col">
                        <label>Enter Session : </label>
                        <input type='text' className='form-control' placeholder='Enter Session' value={session}
                        onChange = {(e)=> setSession(e.target.value)} />
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
                <div className="ag-theme-quartz" style={{ height: 50 }}>
                <AgGridReact
                columnDefs={colDefs}
                rowData={data}
                rowSelection="multiple"
                rowHeight={30}
                headerHeight={40}
                pagination={true}
                paginationPageSize={2}
                paginationPageSizeSelector={[2, 5, 10, 20, 50, 100]}
                defaultColDef={{
                    sortable: true,
                    width: 350,
                    filter:true,
                }}
                onGridReady={onGridReady}
                domLayout="autoHeight"
                onSelectionChanged={handleSelectionChanged}
                />
                </div>
            </div>
            </div>
            <div>
                <Footer></Footer>
            </div>
        </Fragment>
    )
  


}

export default CourseEdit;