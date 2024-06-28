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
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 



const Teacher = ({ userName, role, setTId }) => {

    const [selectedRows, setSelectedRows] = useState([]);

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);;

    const [data, setData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
        console.log("Grid Ready");
        setGridApi(params.api);
    };

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
        }
        else if(role.includes('Admin')){
            return(
                <>
                    <button className='render' onClick={()=>{navigate('/course')}}>Courses</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student record</button>
                    <button className='render' onClick={()=>{navigate('/role')}}>Role Management</button>
                    <button  className='render' onClick={()=>{navigate('/userManagement')}}>User Records</button>
                    <button className='render' onClick={()=>{navigate('/schedule2')}}>Schedule</button>
                </>
            )
        }
         else if (role.includes('User')) {
            return <button className='render' onClick={()=>{navigate('/user')}}>View as User</button>;
        } else {
            return null; 
        }
    };

    const handleAddButtonClick=() =>{
        navigate('/teacherSubject');
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
        axios.delete(`${api_url}/delete-teachers`, { data: ids })
            .then(response => {
                console.log('Selected teachers have been deleted.');
                const updatedData = data.filter((item)=>!selectedRows.includes(item.id));
                setData(updatedData);
                setSelectedRows([]);
                getData();
            })
            .catch(error => {
                console.error('Error deleting teachers:', error);
            })
            .finally(() => {
                setIsConfirmationDialogOpen(false);
            });
    };

    const actionsCellRenderer = (params) => {
    return (
        <>
        <button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>{ handleEdit(params.data.id)}}>Edit</button>
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
        }, width: 55 },
        { headerName: "S.No.", valueGetter: "node.rowIndex + 1", width: 80 },
        { headerName: "Name", field: "name" },
        { headerName: "Email", field: "email" },
        { headerName: "Mobile.", field: "mobile"},
        { headerName: "Actions", cellRenderer: actionsCellRenderer },
      ]);

    
    
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
        <div className="ag-theme-quartz" style={{ width: '100%', height: 300 }}>
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
            width: 287,
            filter:true,
        }}
        onGridReady={onGridReady}
        domLayout="autoHeight"
        onSelectionChanged={handleSelectionChanged}
        />
        </div>
        </div>
    <div>
        <Footer></Footer>
    </div>
    </Fragment>
    )
  

}
export default Teacher;