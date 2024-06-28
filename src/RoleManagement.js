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
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 

const Role = ({ userName, role}) =>{

    const [show, setShow] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);
    const modalRef = useRef();

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const handleClose = () => {
        setShow(false);
        document.body.classList.remove('modal-open');
    }
    const handleShow = () => setShow(true);
    const handleCloseForm = () => {
        setShowForm(false);
        clear();
        document.body.classList.remove('modal-open');
    };
    const handleForm = () => setShowForm(true);

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [RoleName, setRoleName] = useState([]);
    const[EditId, setEditId] = useState('');
    const[EditRoleName, setEditRoleName] = useState('');

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
        console.log("Grid Ready");
        setGridApi(params.api);
    };	

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

    const getData = async() =>{
        try{
        const result = await authorizedFetch(`${api_url}/roles`);
        console.log("response:", result);
        const data = await result.json();
        setData(data);
        }
        catch(error){
            console.log(error)
        }
    }

    const renderViewAsOptions = () => {
        if (role.includes('Admin') && role.includes('User')) {
            return (
                <>
                    <button className='render' onClick={()=>{navigate('/user')}}>View as user</button>
                    <button className='render' onClick={()=>{navigate('/teacher')}}>Teacher Records</button>
                    <button className='render' onClick={()=>{navigate('/course')}}>Courses</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student record</button>
                    <button className='render' onClick={()=>{navigate('/userManagement')}}>User records</button>
                </>
            );
        }
        else if(role.includes('Admin')){
            return(
                <>
                    <button className='render' onClick={()=>{navigate('/course')}}>Courses</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student record</button>
                    <button className='render' onClick={()=>{navigate('/teacher')}}>Teacher Records</button>
                    <button  className='render' onClick={()=>{navigate('/userManagement')}}>User Records</button>
                    <button className='render' onClick={()=>{navigate('/schedule2')}}>Scheduler</button>
                </>
            )
        } else if (role.includes('User')) {
            return <button className='render' onClick={()=>{navigate('/user')}}>View as User</button>;
        } else {
            return null; 
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
        axios.delete(`${api_url}/delete-role`, { data: ids })
            .then(response => {
                console.log('Selected roles have been deleted.');
                const updatedData = data.filter((item)=>!selectedRows.includes(item.id));
                setData(updatedData);
                setSelectedRows([]);
                getData();
            })
            .catch(error => {
                console.error('Error deleting roles:', error);
            })
            .finally(() => {
                setIsConfirmationDialogOpen(false);
            });
    };

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };

    const handleEdit = async(id) =>{
        handleShow(); 
        document.body.classList.add('modal-open');
        try {
            const result = await authorizedFetch(`${api_url}/getRole/${id}`)
            console.log("response:", result);
            const data = await result.json();
            setEditRoleName(data.roleName);
            setEditId(id);
        }
        catch(error){
            console.error('Error editing role:', error);
            toast.error(error);
        }
    }

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
        { headerName: "Role", field: "roleName" },
        { headerName: "Actions", cellRenderer: actionsCellRenderer },
    ]);

    const clear = ()=>{
        setRoleName('');
    }

    const handleSubmit = async(e) => {
        try{
        e.preventDefault();      
        const url = `${api_url}/role`;
        const data = {
            "roleName": RoleName,
        } 
        const token = await getToken();
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const result = await axios.post(url, data, config);
        const response = await result.data;
        getData();
        clear();
        handleCloseForm();
        toast.success('Role has been added');
        }catch(error){
            toast.error(error);
        }
    };


    const handleUpdate = async() =>{
        try{
           const url = `${api_url}/modifyRole/${EditId}`
           const data = {
               "id": EditId,
               "roleName": EditRoleName,
           }
           const token = await getToken();
           const config = {
               headers: {
                   'Authorization': `Bearer ${token}`
               }
           };
           const result = await axios.put(url, data, config);
               getData();
               clear();
               handleClose();
               toast.success('Role has been updated');
           }catch(error){
                toast.error(error);
           }
       }

    return (
        <Fragment>
          <ToastContainer />
          <div>
              <Header></Header>
          </div>
  
          <div className='mid-body'>
          <div className='ad'>
          <div className="navbar">
          <div className="navbar-heading">Role Management</div>
          <div className="dropdown-container">
              <div className="dropdown">
                  <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                  <div className="dropdown-content">
                      <button className='render' onClick={()=>{navigate('/')}}>Logout</button>
                      {renderViewAsOptions()}
                  </div>
              </div>
          </div>
          </div>
          </div>
        <div className="navbar-buttons">
            <Tooltip title='Add Student'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleForm}>
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
                        <h2>Add Role</h2>
                    </div>
                    <div className='modal-body'>
                        <div className="custom-col">
                        <label>Role Name : </label>
                        <input type='text' className='form-control' placeholder='Enter Role Name' value={RoleName}
                        onChange = {(e)=> setRoleName(e.target.value)} />
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
            <div className="ag-theme-quartz" style={{ height: 300, width:530 }}>
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
                    width: 140,
                    filter:true,
                }}
                onGridReady={onGridReady}
                domLayout="autoHeight"
                onSelectionChanged={handleSelectionChanged}
                />
        </div>
        <div>
        {show && (
            <div className='modal-container' ref={modalRef} >
            <div className='modal-header'>
                <span class="close-btn" onClick = {handleClose}>&times;</span>
                <h2>Edit Role</h2>
            </div>
            <div className='modal-body'>
                <div className="custom-col">
                <label>Role: </label>
                <input type='text' className='form-control' placeholder='Enter Role' value={EditRoleName}
                onChange={(e) => {
                    setEditRoleName(e.target.value);
                }}
                />
                </div>
           </div>
            <div className='modal-footer'>
                <button  className='custom-btn custom-btn-secondary-close' onClick={handleClose}>
                    Close
                </button>
                <button className='custom-btn custom-btn-primary' onClick={handleUpdate}>
                    Save
                </button>
                </div>
        </div>
        )}
        </div>
        </div>
        </Fragment>
    )

}

export default Role;
