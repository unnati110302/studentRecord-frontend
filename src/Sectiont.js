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
import Subject from './Subjects';
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 

const Section = ({ userName, role, classId}) =>{

    const[EditId, setEditId] = useState('');
    const[EditName, setEditName] = useState('');
    const[EditSession, setEditSession] = useState('');
    const [courseId, setCourseId] = useState('');
    const[EditCby, setEditCby] = useState(0);
    const[EditMby, setEditMby] = useState(0);

    const[SectionName, setSectionName] = useState('');
    const[EditSectionName, setEditSectionName] = useState('');
    const[EditSectionId, setEditSectionId] = useState('');


    const [data, setData] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]);

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const modalRef = useRef();

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        document.body.classList.remove('modal-open');
    }
    
    const [showForm, setShowForm] = useState(false);
    const handleForm = () => setShowForm(true);
    const handleCloseForm = () => {
        setSectionName('');
        setShowForm(false);
        document.body.classList.remove('modal-open');
    };
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
        console.log("Grid Ready");
        setGridApi(params.api);
    };


    const navigate = useNavigate();

    useEffect(() => {
        console.log(classId);
        getClassbyId(classId);  
        getSections(classId);
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

    const getClassbyId = ()=>{
        if (classId) {
            axios.get(`${api_url}/getClass/${classId}`)
                .then(response => {
                    setEditName(response.data.name); 
                    setEditSession(response.data.session);
                    setEditId(classId);
                    console.log(courseId);
                    setCourseId(response.data.courseId);
                })
                .catch(error => {
                    console.error('Error fetching course:', error.message);
                });
        }
    }

    const getSections = async(id) =>{
        console.log(id);
        try{
        const result = await axios.get(`${api_url}/section/byclass/${id}`);
        console.log("response:", result);
        const data = await result.data;
        setData(data);
        }
        catch(error){
            console.log(error.message)
        }
    }

    const handleUpdate = async() =>{
        try{
            console.log(EditId);
           const url = `${api_url}/updateClass/${EditId}`;
           const currentDate = new Date().toISOString();
           const data = {
               "id": EditId,
               "courseId": courseId,
               "name": EditName,
               "session":EditSession,
               "isActive": 1,
               "createdBy": EditCby,
               "createdOn": currentDate,
               "modifiedBy": EditMby,
               "modifiedOn": currentDate,
           }
           const result = await axios.put(url, data);
           navigate('/courseEdit');
            clear();
            toast.success('Class has been updated');
           }catch(error){
                toast.error(error.message);
            }
    }

    const clear = () =>{
        setEditName('');
        setEditSession('');
    }

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };

    const handleAddButtonClick=() =>{
        handleForm(); 
        document.body.classList.add('modal-open');
    }

    const handleEditSection = async(id) =>{
        handleShow(); 
        document.body.classList.add('modal-open');
        try {
            const result = await axios(`${api_url}/getSection/${id}`)
            console.log("response:", result);
            const data = await result.data;
            setEditSectionName(data.name);
            setEditSectionId(id);
        }
        catch(error){
            console.error('Error editing student:', error);
            toast.error(error.message);
        }
    }

    const handleSubmit = async(e) =>{
        try{
            e.preventDefault();      
            const currentDate = new Date().toISOString();
            const url = `${api_url}/section`;
            const data = {
                "classId":classId,
                "name": SectionName,
                "isActive": 1,
                "createdBy": 1, 
                "createdOn": currentDate, 
                "modifiedBy": 1,  
                "modifiedOn": currentDate,
            } 
            const result = await axios.post(url, data);
            getClassbyId(classId);
            getSections(classId);
            const response = await result.data;
            clear();
            handleCloseForm();
            toast.success('Section has been added');
            }catch(error){
                toast.error(error.messsage);
                
            }
    }

    const handleUpdateSection = async() =>{
        try{
            console.log(EditSectionId);
           const url = `${api_url}/updateSection/${EditSectionId}`;
           const currentDate = new Date().toISOString();
           const data = {
               "id": EditSectionId,
               "classId": classId,
               "name": EditSectionName,
               "isActive": 1,
               "createdBy": EditCby,
               "createdOn": currentDate,
               "modifiedBy": EditMby,
               "modifiedOn": currentDate,
           }
           const result = await axios.put(url, data);
            setEditSectionName('');
            handleClose();
            getSections(classId)
            toast.success('Class has been updated');
           }catch(error){
                toast.error(error.message);
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
        axios.delete(`${api_url}/delete-sections`, { data: ids })
            .then(response => {
                console.log('Selected sections have been deleted.');
                const updatedData = data.filter((item)=>!selectedRows.includes(item.id));
                setData(updatedData);
                setSelectedRows([]);
                getClassbyId(classId);
                getSections(classId);
            })
            .catch(error => {
                console.error('Error deleting sections:', error);
            })
            .finally(() => {
                setIsConfirmationDialogOpen(false);
            });
    };

    const actionsCellRenderer = (params) => {
    return (
        <>
        <button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>{handleEditSection(params.data.id)}}>Edit</button>
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
        }, width: 130 },
        { headerName: "S.No.", valueGetter: "node.rowIndex + 1", width: 170 },
        { headerName: "Section Name", field: "name" },
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
            <div className="navbar-heading">Edit Class</div>
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
            <div className='course-edit-section'>
                <div className="custom-col">
                    <label>Name : </label>
                    <input type='text' className='form-control' placeholder='Enter Class Name' value={EditName}
                    onChange={(e) => {
                        setEditName(e.target.value);
                    }}
                    />
                </div>
                <div className="custom-col">
                    <label>Session : </label>
                    <input type='text' className='form-control' placeholder='Enter session' value={EditSession}
                    onChange={(e) => {
                        setEditSession(e.target.value);
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
                    <h2>Sections</h2>
                </div>
                <div className="navbar-buttons">
                    <Tooltip title='Add Sections'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
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
                        <h2>Add Section</h2>
                    </div>
                    <div className='modal-body'>
                        <div className="custom-col">
                        <label>Section Name : </label>
                        <input type='text' className='form-control' placeholder='Enter Section' value={SectionName}
                        onChange = {(e)=> setSectionName(e.target.value)} />
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
                <div className="ag-theme-quartz" style={{ height: 300 }}>
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
                    width: 500,
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
                <h2>Edit Section</h2>
            </div>
            <div className='modal-body'>
                <div className="custom-col">
                <label>Section Name : </label>
                <input type='text' className='form-control' placeholder='Enter Section Name' value={EditSectionName}
                onChange={(e) => {
                    setEditSectionName(e.target.value);
                }}
                />
                </div>
           </div>
            <div className='modal-footer'>
                <button  className='custom-btn custom-btn-secondary-close' onClick={handleClose}>
                    Close
                </button>
                <button className='custom-btn custom-btn-primary' onClick={handleUpdateSection}>
                    Save
                </button>
                </div>
        </div>
        )}
        </div>
        </div>
        <Subject userName={userName} role={role} classId={classId}/>
        </div>
        <div>
            <Footer></Footer>
        </div>
        </Fragment>
    );
}

export default Section;