
import React, {useState, useEffect, Fragment, useRef} from 'react';
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
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import SearchBar from './SearchBar';
import * as XLSX from 'xlsx';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const CRUD = ( {userName}) => {

    const [show, setShow] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState(''); 
    const [sortAttribute, setSortAttribute] = useState('');
 

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
        setEmail('');
        setMob('');
        setAdd1('');
        setAdd2('');
        setState(0);
        setCity(0);
        setGender(2);
        setStatus(4);
        setIsActive(0);
        setShowForm(false);
        document.body.classList.remove('modal-open');
    };
    const handleForm = () => setShowForm(true);

    const[code, setCode] = useState('');
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[mobile, setMob] = useState('');
    const[address1, setAdd1] = useState('');
    const[address2, setAdd2] = useState('');
    const[state, setState] = useState('');
    const[city, setCity] = useState('');
    const[gender, setGender] = useState('');
    const[status, setStatus] = useState(4);
    const[isActive, setIsActive] = useState(0);
    const[createdBy, setCby] = useState(0);
    const[createdOn, setCon] = useState('');
    const[modifiedBy, setMby] = useState(0);
    const[modifiedOn, setMon] = useState('');

    const[EditId, setEditId] = useState('');
    const[EditCode, setEditCode] = useState('');
    const[EditName, setEditName] = useState('');
    const[EditEmail, setEditEmail] = useState('');
    const[EditMob, setEditMob] = useState('');
    const[EditAdd1, setEditAdd1] = useState('');
    const[EditAdd2, setEditAdd2] = useState('');
    const[EditState, setEditState] = useState('');
    const[EditCity, setEditCity] = useState('');
    const[EditGender, setEditGender] = useState(0);
    const[EditStatus, setEditStatus] = useState(0);
    const[EditIsActive, setEditIsActive] = useState(0);
    const[EditCby, setEditCby] = useState(0);
    const[EditCon, setEditCon] = useState('');
    const[EditMby, setEditMby] = useState(0);
    const[EditMon, setEditMon] = useState('');

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [data, setData] = useState([]);
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');
    const modalRef = useRef();
    const [invalid, setInvalid] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getStates();
        getData(pageNumber, pageSize, searchTerm, sortAttribute, sortOrder);
    
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
    }, [pageNumber, pageSize, searchTerm, sortAttribute, sortOrder]);

    const getStates = async () => {
        try {
          const response = await axios.get(`${api_url}/State`);
          setStates(response.data);
        } catch (error) {
          console.error('Error fetching states:', error);
        }
    };

    const getCitiesByState = async (stateId) => {
        try {
          const response = await axios.get(`${api_url}/cities/${stateId}`);
          setCities(response.data);
        } catch (error) {
          console.error(`Error fetching cities for state ${stateId}:`, error);
        }
    };

    const getData = (pageNumber, pageSize, search = '', sortAttribute = '', sortOrder= '' ,shouldExport = false) =>{
        axios.get(`${student_url}?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${searchTerm}&sortAttribute=${sortAttribute}&sortOrder=${sortOrder}`)
        .then((result)=>{
            setData(result.data.data)
            setCode(result.data.data[0]?.code);    
            setTotalPages(result.data.totalPages);
        
        // if (shouldExport) {
        //     exportToExcel(result.data.data, 'Student_Record');
        // }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleSorting = (attribute) =>{
        // if(sortAttribute === attribute){
        //     setSortOrder(sortOrder==='' ? 'asc' : (sortOrder === 'asc' ? 'desc' : 'asc'));
      
        let newSortOrder;
        if (sortAttribute === attribute) {
            newSortOrder = sortOrder === '' ? 'asc' : (sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            newSortOrder = '';
        }
        getData(pageNumber, pageSize, searchTerm, attribute, newSortOrder);

        setSortAttribute(attribute);
        setSortOrder(newSortOrder);

    }

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        setPageNumber(1); 
        getData(1, pageSize, searchTerm, sortAttribute, sortOrder);
    };

    const handleExportClick = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${local_url}/excel`, {
            responseType: 'blob' // Specify the response type as blob
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Students.xlsx');
          document.body.appendChild(link);
          link.click();
          setIsLoading(false);
        } catch (error) {
          console.error('Error exporting to Excel:', error);
          setIsLoading(false);
        }
      };

    const handlePrevious = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };
    
    const handleNext = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handleItemsPerPageChange = (value) => {
        setPageSize(value);
        setPageNumber(1);
        getData(1, value);
    };
    
      const renderDropdownOptions = () => {
        const options = [5, 10, 20, 50, 100];
        return options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ));
      };

    const handleEdit = (id) =>{
        handleShow(); 
        document.body.classList.add('modal-open');
        axios.get(`${student_url}/${id}`)
        .then((result)=>{
            setEditCode(result.data.code);
            setEditName(result.data.name);
            setEditEmail(result.data.email);
            setEditMob(result.data.mobile);
            setEditAdd1(result.data.address1);
            setEditAdd2(result.data.address2);
            setEditState(result.data.state);
            setEditCity(result.data.city);
            setEditGender(result.data.gender);
            setEditStatus(result.data.status);
            setEditIsActive(result.data.isActive);
            setEditCby(result.data.createdBy);
            setEditCon(result.data.createdOn);
            setEditMby(result.data.modifiedBy);
            setEditMon(result.data.modifiedOn);
            setEditId(id);
        })
        .catch((error)=>{
            console.error('Error editing student:', error);
            toast.error(error);
        })
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
            
        const url = `${student_url}/delete-multiple`;
    
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
            toast.error('Error deleting students');
        })
        .finally(() => {
            setIsConfirmationDialogOpen(false);
        });
    };

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };

    const handleUpdate = () =>{
        const url = `${student_url}/${EditId}`
        const data = {
            "id": EditId,
            "code": EditCode,
            "name": EditName,
            "email": EditEmail,
            "mobile": EditMob,
            "address1": EditAdd1,
            "address2": EditAdd2,
            "state": EditState,
            "city": EditCity,
            "gender": EditGender,
            "status":  EditStatus,
            "isActive": EditIsActive,
            "createdBy": EditCby,
            "createdOn": EditCon,
            "modifiedBy": EditMby,
            "modifiedOn": EditMon,
        }
        axios.put(url, data)
        .then((result) => {
            getData(pageNumber, pageSize, searchTerm, sortAttribute, sortOrder);
            clear();
            handleClose();
            toast.success('Student has been updated');
        }).catch((error)=>{
            if(invalid){
                toast.error('Invalid details')
            }
            else{
                toast.error('A record with the same email or mobile number already exists.');
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();      
        const currentDate = new Date().toISOString();
        const url = student_url;
        const data = {
            "code": code,
            "name": name,
            "email": email,
            "mobile": mobile,
            "address1": address1,
            "address2": address2,
            "state": state,
            "city": city,
            "gender": gender,
            "status":  status,
            "isActive": isActive,
            "createdBy": 1, 
            "createdOn": currentDate, 
            "modifiedBy": 1,  
            "modifiedOn": currentDate,
        } 
        axios.post(url, data)
        .then((result) => {
            const generatedCode = result.data.code;
            setCode(generatedCode);
            getData(pageNumber, pageSize, searchTerm, sortAttribute, sortOrder);
            clear();
            handleCloseForm();
            toast.success('Student has been added');
        }).catch((error) => {
            if(invalid==true){
                toast.error('Invalid details');
            }
            else{
                toast.error('A record with the same email or mobile number already exists.');
            }
        })
    };

    const clear = () =>{
        setCode('');
        setName('');
        setEmail('');
        setMob('');
        setAdd1('');
        setAdd2('');
        setState(0);
        setCity(0);
        setGender(2);
        setStatus(4);
        setIsActive(0);
        setCby(0);
        setCon('');
        setMby(0);
        setMon('');
        setEditId(0);
        setEditCode('');
        setEditName('');
        setEditEmail('');
        setEditMob('');
        setEditAdd1('');
        setEditAdd2('')
        setEditState(0);
        setEditCity(0);
        setEditGender(0);
        setEditStatus(0);
        setEditIsActive(0);
        setEditCby(0);
        setEditCon('');
        setEditMby(0);
        setEditMon('');
    }

    const handleAddButtonClick=() =>{
         handleForm(); 
         document.body.classList.add('modal-open');
    }

    const mapStatusValueToLabel = (value) => {
        switch (value) {
            case 0:
                return 'Single';
            case 1:
                return 'Married';
            case 2:
                return 'Separated';
            default:
                return '';
        }
    };

    const handleActiveChange = (e) =>{
        if(e.target.checked){
            setIsActive(1);
        }
        else{
            setIsActive(0);
        }
    }

    const handleEditActiveChange = (e) =>{
        if(e.target.checked){
            setEditIsActive(1);
        }
        else{
            setEditIsActive(0);
        }
    }

    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        const selectedIds = checked ? data.map(item => item.id) : [];
    
        setSelectedRows(selectedIds);
    };
    

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

    const handleMobileChange = (e) => {
        const inputValue = e.target.value;
        setMob(inputValue);
        validateMobile(inputValue);
    };

    const validateName = (value) => {
        if (value.trim() !== '') {
            if (/^[a-zA-Z\s]+$/.test(value)) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    name: '',
                }));
                setInvalid((prevInvalid) => {
                    return false;  
                });
            } else {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    name: 'Name should contain only alphabets',
                }));
                setInvalid((prevInvalid) => {
                    return true;  
                });
            }
        } else {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Name should not be blank',
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
                email: '',
            }));
            setInvalid((prevInvalid) => {
                return false;  
            });
        } else {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Enter a valid email address',
            }));
            setInvalid((prevInvalid) => {
                return true;  
            });
        }
    };

    const validateMobile = (value) => {
        if (/^[6-9]\d{9}$/.test(value)) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                mobile: '',
            }));
            setInvalid((prevInvalid) => {
                return false;  
            });
        } else {
            if (/^\d{10}$/.test(value)) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    mobile: 'Mobile number should start from 6, 7, 8, or 9',
                }));
            } else if (/^\d+$/.test(value)) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    mobile: 'Mobile number should be of 10 digits',
                }));
            } else {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    mobile: 'Mobile number should only contain digits',
                }));
            }
            setInvalid((prevInvalid) => {
                return true;  
            });
        }
    };

    const validateEditName = (value) => {
        if (value.trim() !== '') {
            if (/^[a-zA-Z\s]+$/.test(value)) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    editName: '',
                }));
                setInvalid((prevInvalid) => {
                    return false;  
                });
            } else {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    editName: 'Name should contain only alphabets',
                }));
                setInvalid((prevInvalid) => {
                    return true;  
                });
            }
        } else {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                editName: 'Name should not be blank',
            }));
            setInvalid((prevInvalid) => {
                return true;  
            });
        }
    };
    
    const validateEditEmail = (value) => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                editEmail: '',
            }));
            setInvalid((prevInvalid) => {
                return false;  
            });
        } else {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                editEmail: 'Enter a valid email address',
            }));
            setInvalid((prevInvalid) => {
                return true;  
            });
        }
    };
    
    const validateEditMobile = (value) => {
        if (/^[6-9]\d{9}$/.test(value)) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                editMobile: '',
            }));
            setInvalid((prevInvalid) => {
                return false;  
            });
        } else {
            if (/^\d{10}$/.test(value)) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    editMobile: 'Mobile number should start from 6, 7, 8, or 9',
                }));
            } else if (/^\d+$/.test(value)) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    editMobile: 'Mobile number should be of 10 digits',
                }));
            } else {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    editMobile: 'Mobile number should only contain digits',
                }));
            }
            setInvalid((prevInvalid) => {
                return true;  
            });
        }
    };
    
    const startIndex = (pageNumber - 1) * pageSize;

  return (
      <Fragment>
        <ToastContainer />
        <div>
            <Header></Header>
        </div>

        <div className='mid-body'>
        <div className='ad'>
        <div className="navbar">
        <div className="navbar-heading">Student Record</div>
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
            <Tooltip title='Add Student'><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
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
            <div className="dropdown-container">
            <div className="dropdown">
                <button className="dropbtn a" onClick={()=>{navigate('/userManagement')}}>Add User</button>
                {/* <div className="dropdown-content">
                    <a href="http://localhost:3000/">Logout</a>
                </div> */}
            </div>
        </div>
        <SearchBar handleSearch={handleSearch} />
        <button className='custom-btn custom-btn-primary' onClick={handleExportClick}><SaveIcon /></button>
        </div>
        <div>
        {showForm && (
            <div className='modal-container' ref={modalRef} >
            <div className='modal-header'>
            <span class="close-btn" onClick = {handleCloseForm}>&times;</span>
                <h2>Add New Student</h2>
            </div>
            <div className='modal-body'>
                {/* <Col>
                <input type='text' className='form-control' placeholder='Student code' value={code}
                readOnly />
                </Col> */}
                <div className="custom-col">
                {validationErrors.name && (
                    <div className='invalid-feedback'>{validationErrors.name}</div>
                )}
                <input type='text' className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`} placeholder='Enter name' value={name} 
                 onChange={handleNameChange}/>
                </div>
                <div className="custom-col">
                {validationErrors.email && (
                    <div className='invalid-feedback'>{validationErrors.email}</div>
                )}
                <input type='text' className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`} placeholder='Enter email' value={email}
                onChange={handleEmailChange} />
                </div>
                <div className="custom-col">
                {validationErrors.mobile && (
                    <div className='invalid-feedback'>{validationErrors.mobile}</div>
                )}
                <input type='text' className={`form-control ${validationErrors.mobile ? 'is-invalid' : ''}`} placeholder='Enter mobile no.' value={mobile}
                onChange={handleMobileChange} />
                </div>
                <div className="custom-col">
                <input type='text' className='form-control' placeholder='Enter address 1' value={address1}
                onChange = {(e)=> setAdd1(e.target.value)} />
                </div>
                <div className="custom-col">
                <input type='text' className='form-control' placeholder='Enter address 2' value={address2}
                onChange = {(e)=> setAdd2(e.target.value)} />
                </div>
                <div className="custom-col">
                <select className="form-control" data-dropup-auto="false" value={state} onChange={(e) => {
                    setState(e.target.value);
                    getCitiesByState(e.target.value);
                }}>
                    <option value="">--Select State--</option>
                    {states.map((state) => (
                    <option key={state.sId} value={state.sId}>
                        {state.name}
                    </option>
                    ))}
                </select>
                </div>
                <div className="custom-col">
                <select className="form-control" value={city} 
                onChange={(e) => setCity(e.target.value)}>
                    <option value="">--Select City--</option>
                    {cities.map((city) => (
                    <option key={city.cId} value={city.cId}>
                        {city.name}
                    </option>
                    ))}
                </select>
                </div>
                <div className="custom-col">
                <label id='gen'>Gender:</label>
                <input type="radio" name="gender" value="0" checked={gender === 0} 
                onChange={(e) => {setGender(parseInt(e.target.value));}} /> Male &nbsp;
                <input type="radio" name="gender" value="1" checked={gender === 1} 
                onChange={(e) => {setGender(parseInt(e.target.value));}} /> Female
                </div>
                <div className="custom-col">
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value={4}>Marital Status</option>
                    <option value={0}>Single</option>
                    <option value={1}>Married</option>
                    <option value={2}>Separated</option>
                </select>
                </div>
                <div className="custom-col" id='isActive-checkbox'>
                <input className='check' type="checkbox" checked={isActive === 1 ? true : false} onChange={(e)=> handleActiveChange(e)} value={isActive} />
                <label>Is Active</label>
                </div>
                {/* <Col>
                <input type='number' className='form-control' placeholder='Created by' value={createdBy} 
                onChange={ (e) => setCby(e.target.value)}  />
                </Col>
            </Row><Row>
                <Col>
                <input type='datetime-local' className='form-control' placeholder='Created on' value={createdOn}
                onChange={ (e) => setCon(e.target.value)}/>
                </Col>
                <Col>
                <input type='number' className='form-control' placeholder='Modified by' value={modifiedBy} 
                onChange={ (e) => setMby(e.target.value)}/>
                </Col>
                <Col>
                <input type='datetime-local' className='form-control' placeholder='Modified on' value={modifiedOn} 
                onChange={ (e) => setMon(e.target.value)}/>
                </Col> */}
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
                <th onClick={() => handleSorting('code')} className="sortable-header">
                    <span className="header-text">Student Code</span>
                    <span className='aero'>
                        {sortAttribute !== 'code'?<SwapVertIcon />:(sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </span>
                </th>
                <th onClick={() => handleSorting('name')} className="sortable-header">
                    <span className="header-text">Name</span>
                    <span className='aero'>
                        {sortAttribute !== 'name'?<SwapVertIcon />:(sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </span>
                </th>
                <th onClick={() => handleSorting('email')} className="sortable-header">
                    <span className="header-text">Email</span>
                    <span className='aero'>
                        {sortAttribute !== 'email'?<SwapVertIcon />:(sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </span>
                </th>
                <th>Mobile</th>
                <th onClick={() => handleSorting('address1')} className="sortable-header">
                    <span className="header-text">Address1</span>
                    <span className='aero'>
                        {sortAttribute !== 'address1'?<SwapVertIcon />:(sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </span>
                </th>
                <th onClick={() => handleSorting('address2')} className="sortable-header">
                    <span className="header-text">Address2</span>
                    <span className='aero'>
                        {sortAttribute !== 'address2'?<SwapVertIcon />:(sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </span>
                </th>
                <th onClick={() => handleSorting('stateName')} className="sortable-header">
                    <span className="header-text">State</span>
                    <span className='aero'>
                    {sortAttribute !== 'stateName'?<SwapVertIcon />:(sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </span>
                </th>
                <th onClick={() => handleSorting('city')} className="sortable-header">
                    <span className="header-text">City</span>
                    <span className='aero'>
                        {sortAttribute !== 'city'?<SwapVertIcon />:(sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </span>
                </th>
                <th>Gender</th>
                <th>Marital Status</th>
                {/* <th>IsActive</th> */}
                {/* <th>Created By</th>
                <th>Created On</th>
                <th>Modified By</th>
                <th>Modified On</th> */}
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    data && data.length >0?
                        data.map((item, index)=>{
                            const serialNumber = startIndex + index + 1;
                             
                            return(
                                <tr key={serialNumber}>
                                    <td>
                                        <input
                                        className='select-checkbox'
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </td>
                                    <td>{serialNumber}</td>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.mobile}</td>
                                    <td>{item.address1}</td>
                                    <td>{item.address2}</td>
                                    <td>{item.stateName}</td>
                                    <td>{item.cityName}</td>
                                    <td>{item.gender === 0 ? "Male" : "Female"}</td>
                                    <td>{mapStatusValueToLabel(item.status)}</td>
                                    {/* <td>{item.isActive}</td> */}
                                    {/* <td>{item.createdBy}</td>
                                    <td>{item.createdOn}</td>
                                    <td>{item.modifiedBy}</td>
                                    <td>{item.modifiedOn}</td> */}
                                    <td colSpan={2}>
                                    <Tooltip title="Edit Details"><button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() => {getCitiesByState(item.state); handleEdit(item.id);}}><BorderColorIcon /></button> </Tooltip>&nbsp;
                                        {/* <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button> */}
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
        <div className='page'>
        <div className='page-buttons'>
            <Tooltip title='Previous Page'>
            <button className='custom-btn page-btn' onClick={handlePrevious} disabled={pageNumber === 1}><KeyboardDoubleArrowLeftIcon /></button>
            </Tooltip>
            <span className='paging-title'>{`Page ${pageNumber} of ${totalPages}`}</span>
            <Tooltip title='Next Page'>
            <button className='custom-btn page-btn' onClick={handleNext} disabled={pageNumber === totalPages}><KeyboardDoubleArrowRightIcon /></button>
            </Tooltip>
        </div>
        <div className='itemsPerPage'>
            <label>Items per page : </label>
            <select className='page-select' value={pageSize} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}>
            {renderDropdownOptions()}
            </select>
        </div>
        </div>
        
        <div>
        {show && (
            <div className='modal-container' ref={modalRef} >
            <div className='modal-header'>
                <span class="close-btn" onClick = {handleClose}>&times;</span>
                <h2>Edit Student</h2>
            </div>
            <div className='modal-body'>
                <div className="custom-col">
                <label htmlFor='code'>Code : </label>
                <input id='std-code' type='text' className='form-control' value={EditCode}
                readOnly />
                </div>
                <div className="custom-col">
                {validationErrors.editName && (
                    <div className='invalid-feedback'>{validationErrors.editName}</div>
                )}
                <label>Name : </label>
                <input type='text' className={`form-control ${validationErrors.editName ? 'is-invalid' : ''}`} placeholder='Enter name' value={EditName}
                onChange={(e) => {
                    setEditName(e.target.value);
                    validateEditName(e.target.value);
                }}
                />
                </div>
                <div className="custom-col">
                {validationErrors.editEmail && (
                    <div className='invalid-feedback'>{validationErrors.editEmail}</div>
                )}
                <label htmlFor='email'>Email : </label>
                <input type='text' className={`form-control ${validationErrors.editEmail ? 'is-invalid' : ''}`} placeholder='Enter email' value={EditEmail} 
                onChange={(e) => {
                    setEditEmail(e.target.value);
                    validateEditEmail(e.target.value);
                }} />
                </div>
                <div className="custom-col">
                {validationErrors.editMobile && (
                    <div className='invalid-feedback'>{validationErrors.editMobile}</div>
                )}
                <label>Mobile: </label><input type='text' className={`form-control ${validationErrors.editMobile ? 'is-invalid' : ''}`} placeholder='Enter mobile number' value={EditMob}
                onChange={(e) => {
                setEditMob(e.target.value);
                validateEditMobile(e.target.value);
                }} />
                </div>
                <div className="custom-col">
                <label htmlFor='address1'>Address 1 : </label>
                <input type='text' className='form-control' placeholder='Enter address 1' value={EditAdd1}
                onChange={ (e) => setEditAdd1(e.target.value)} />
                </div>
                <div className="custom-col">
                <label htmlFor='address2'>Address 2 : </label>
                <input type='text' className='form-control' placeholder='Enter address 2' value={EditAdd2}
                onChange={ (e) => setEditAdd2(e.target.value)} />
                </div>
                <div className="custom-col">
                <label>State : </label>
                <select className="form-control" value={EditState} onChange={(e) => {
                    setEditState(e.target.value);
                    getCitiesByState(e.target.value);   
                }}>
                    <option value="">--Select State--</option>
                    {states.map((state) => (
                    <option key={state.sId} value={state.sId}>
                        {state.name}
                    </option>
                    ))}
                </select>
                </div>
                <div className="custom-col">
                <label>City : </label>
                <select className="form-control" value={EditCity} 
                onChange={(e) => setEditCity(e.target.value)}>
                    <option value="">--Select City--</option>
                    {cities.map((city) => (
                    <option key={city.cId} value={city.cId}>
                        {city.name}
                    </option>
                    ))}
                </select>
                </div>
                <div className="custom-col">
                <label>Gender: </label>
                <input type="radio" name="gender" value="0" checked={EditGender === 0} 
                onChange={(e) => {setEditGender(parseInt(e.target.value));}} /> Male &nbsp;
                <input type="radio" name="gender" value="1" checked={EditGender === 1} 
                onChange={(e) => {setEditGender(parseInt(e.target.value));}} /> Female
                </div>
                <br></br>
                <div className="custom-col" id='m-status'>
                <label>Marital: <br></br>Status</label><select
                    id="status"
                    value={EditStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                >
                    <option value={4}>Marital Status</option>
                    <option value={0}>Single</option>
                    <option value={1}>Married</option>
                    <option value={2}>Separated</option>
                </select>
                </div>
                {/* <Col>
                <input className='check' type='checkbox'  checked={isActive === 1 ? true : false}
                onChange={(e) => {handleEditActiveChange(e)}} value={EditIsActive}/>
                <label>Is Active</label>
                </Col> */}
                {/* <Col> */}
                {/* Created By<input type='number' className='form-control' placeholder='Created by' value={EditCby}
                onChange={ (e) => setEditCby(e.target.value)} readOnly/>
                </Col>
            </Row><Row>
                <Col>
                Created On<input type='datetime-local' className='form-control' placeholder='Created on' value={EditCon}
                onChange={ (e) => setEditCon(e.target.value)} readOnly/>
                </Col>
                <Col>
                Modified By<input type='number' className='form-control' placeholder='Modified by' value={EditMby}
                onChange={ (e) => setEditMby(e.target.value)} readOnly/>
                </Col>
                <Col>
                Modified On<input type='datetime-local' className='form-control' placeholder='Modified on' value={EditMon}
                onChange={ (e) => setEditMon(e.target.value)} readOnly/>
                </Col> */}
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
        <div>
            <Footer></Footer>
        </div>
      </Fragment>
  )
}

export default CRUD;


