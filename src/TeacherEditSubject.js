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
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { authorizedFetch, getToken } from './UtilityFunctions2';
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 


const TeacherEditSubject = ({ userName, role, tId }) => {

    const [show, setShow] = useState(false);
    const [showForm, setShowForm] = useState(false);
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

    const handleForm = () => setShowForm(true);
    const handleCloseForm = () => {
        setCourseId('');
        setClassId('');
        setSubjectId('');
        setSectionId('');
        setSubjects([]);
        setShowForm(false);
        document.body.classList.remove('modal-open');
    };

    const [selectedRows, setSelectedRows] = useState([]);

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const modalRef = useRef();
    const [invalid, setInvalid] = useState(false);

    const [validationErrors, setValidationErrors] = useState({
        name: '',
        email: '',
        mobile: '',
    });
    const handleShow = () => setShow(true);

    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[mobile, setMob] = useState('');
    const[courseId, setCourseId] = useState('');
    const[classId, setClassId] = useState('');
    const[sectionId, setSectionId] = useState('');
    const[subjectId, setSubjectId] = useState([]);

    const[EditCourseId, setEditCourseId] = useState('');
    const[EditClassId, setEditClassId] = useState('');
    const[EditSectionId, setEditSectionId] = useState('');
    const[EditSubjectId, setEditSubjectId] = useState([]);
    const[EditName, setEditName] = useState([]);
    const[EditEmail, setEditEmail] = useState([]);
    const[EditMob, setEditMob] = useState([]);

    const [EditId, setEditId] = useState('');
    const [EditTId, setEditTId] = useState('');

    const [data, setData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);    
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
        console.log("Grid Ready");
        setGridApi(params.api);
    };


    const navigate = useNavigate();

    useEffect(() => {
        handleEditTeacher(tId);
        getSubjectByTeacherId(tId);
        getCourses();
   
        const handleDocumentClick = (event) => {
            const modalContainer = modalRef.current;
            if (modalContainer && !modalContainer.contains(event.target)) {
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


    const getSubjectByTeacherId = async(id) =>{
        console.log(id);
        try{
        const result = await authorizedFetch(`${api_url}/subjectBy/${id}`);
        console.log("response:", result);
        const data = await result.json();
        setData(data);
        }
        catch(error){
            console.log(error)
        }
    }

    const getCourses = async()=>{
        try {
            const response = await authorizedFetch(`${api_url}/courses`);
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                console.error('Failed to fetch courses:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching courses:', error);
          }
    }

    const getClassByCourse = async(id) =>{
        console.log(id);
        try{
        const result = await axios.get(`${api_url}/class/bycourse/${id}`);
        console.log("response:", result.data);
        setClasses(result.data);
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No classes found for the given course.");
                setClasses([]); 
                setSections([]);
                setSubjects([]);
            } else {
                console.log(error);
            }
        }
    }
 
    const getSections = async(id) =>{
        console.log(id);
        try{
        const result = await axios.get(`${api_url}/section/byclass/${id}`);
        console.log("response:", result);
        setSections(result.data);         
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No sections found for the given class.");
                setSections([]);
            } else {
                console.log(error);
            }
        }
    }

    const getSubjects = async(id) =>{
        console.log(id);
        try{
        const result = await axios.get(`${api_url}/subject/byclass/${id}`);
        setSubjects(result.data);
        }
        catch(error){
            if (error.response && error.response.status === 404) {
                console.log("No subjects found for the given class.");
                setSubjects([]);
            } else {
                console.log(error);
            }
        }
    }

    const closeConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
    };

    const handleAddButtonClick=() =>{
        handleForm(); 
        document.body.classList.add('modal-open');
   }

    const renderViewAsOptions = () => {
        if (role.includes('Admin') && role.includes('User')) {
            return (
                <>
                    <button className='render' onClick={()=>{navigate('/user')}}>View as user</button>
                    <button className='render' onClick={()=>{navigate('/course')}}>Courses</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student Records</button>
                </>
            );
        } else if (role.includes('User')) {
            return <button className='render' onClick={()=>{navigate('/user')}}>View as User</button>;
        } else {
            return null; 
        }
    };

    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        const selectedIds = checked ? data.map(item => item.id) : [];
    
        setSelectedRows(selectedIds);
    };

    const handleNameChange = (e) => {
        const inputValue = e.target.value;
        setEditName(inputValue);
        validateName(inputValue);
    };
    const handleEmailChange = (e) => {
        const inputValue = e.target.value;
        setEditEmail(inputValue);
        validateEmail(inputValue);
    };

    const handleMobileChange = (e) => {
        const inputValue = e.target.value;
        setEditMob(inputValue);
        validateMobile(inputValue);
    };

    const handleAddMore = async(e) =>{
        try{
            e.preventDefault();      
            const currentDate = new Date().toISOString();
            const url2 = `${api_url}/teacherSubjects`;
            const data2 = {
                "teacherId":tId,
                "courseId": courseId,
                "classId": classId,
                "sectionId": sectionId,
                "subjectId": subjectId.join(','),
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
            const result2 = await axios.post(url2, data2, config);
            clear();
            console.log(tId);
            getSubjectByTeacherId(tId);
            handleCloseForm();
            toast.success('Subject has been added');
            }catch(error){
                if(invalid==true){
                    toast.error('Invalid details');
                }
                else{
                    toast.error('A record with the same email or mobile number already exists.');
                }
            }

    }

    const clear = () =>{
        setCourseId(0);
        setClassId(0);
        setSectionId(0);
        setSubjectId([]);
        setSubjects([]);
    }

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
    }

    const handleSubjectChange = (subjectValue) => {
        setSubjectId(prevSubjectId => {
            const newSubjectId = prevSubjectId.includes(subjectValue) 
                ? prevSubjectId.filter(subject => subject !== subjectValue)
                : [...prevSubjectId, subjectValue];
            return newSubjectId;
        });
    };

    const handleEditSubjectChange = (subjectValue) => {
        setEditSubjectId(prevSubjectId => {
            const prevSubjectIdArray = Array.isArray(prevSubjectId) ? prevSubjectId : [];
            const newSubjectId = prevSubjectIdArray.includes(subjectValue) 
                ? prevSubjectIdArray.filter(subject => subject !== subjectValue)
                : [...prevSubjectIdArray, subjectValue];
            
            return newSubjectId;
        });
    };

    const handleEditTeacher = async(id)=>{
        try {
            const result = await authorizedFetch(`${api_url}/get/${id}`)
            console.log("response:", result);
            const data = await result.json();
            setEditName(data.name);
            setEditEmail(data.email);
            setEditMob(data.mobile);
            // setEditCourseId(0);
            // setEditClassId(0);
            // setEditSectionId(0);
            // setEditSubjectId('');
            // setEditIsActive(data.isActive);
            setEditTId(id);
            navigate("/teacherSubject-edit");
        }
        catch(error){
            console.error('Error editing teacher:', error);
            toast.error(error);
        }
    }

    const handleUpdateTeacher = async() =>{
        try{
           const url = `${api_url}/modify/${EditTId}`;
           const currentDate = new Date().toISOString();
           const data = {
               "id": EditTId,
               "name":EditName,
               "email": EditEmail,
               "mobile": EditMob,
               "courseId": EditCourseId,
               "classId": EditClassId,
               "sectionId": EditSectionId,
               "subjectId": EditSubjectId,
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
           const result = await axios.put(url, data, config);
            navigate('/teacher')
            toast.success('Teacher has been updated');
           }catch(error){
               if(invalid){
                   toast.error('Invalid details')
               }
               else{
                   toast.error('A record with the same email or mobile number already exists.');
               }
           }
       }
    

    const handleEdit = async(id)=>{
        handleShow(); 
        document.body.classList.add('modal-open');
        try {
            const result = await authorizedFetch(`${api_url}/getTeacherSubject/${id}`);
            console.log("response:", result);
            const data = await result.json();
            setEditId(data.id);
            setEditCourseId(data.courseId);
            setEditClassId(data.classId);
            setEditSectionId(data.sectionId);
            setEditSubjectId(data.subjectId);
            //getSubjects(data.classId);
            //console.log(data.subjectId);
        
        }
        catch(error){
            console.error('Error editing student:', error);
            toast.error(error);
        }
    }

    const handleUpdate = async () => {
        try {
            console.log(EditId);
            const url = `${api_url}/updateTeacherSubjects/${EditId}`;
            const currentDate = new Date().toISOString();
            const data = {
                "id": EditId,
                "teacherId": tId,
                "courseId": EditCourseId,
                "classId": EditClassId,
                "sectionId": EditSectionId,
                "subjectId": EditSubjectId.join(','),
                "isActive": 1,
                "createdBy": 1,
                "createdOn": currentDate,
                "modifiedBy": 1,
                "modifiedOn": currentDate,
            }
            console.log(JSON.stringify(data)); 
            const token = await getToken();
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const result = await axios.put(url, data, config);
            handleClose();
            getSubjectByTeacherId(tId);
            toast.success('Subject has been updated');
        } catch (error) {
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
        axios.delete(`${api_url}/delete-teacherSubjects`, { data: ids })
            .then(response => {
                console.log('Selected subjects have been deleted.');
                const updatedData = data.filter((item)=>!selectedRows.includes(item.id));
                setData(updatedData);
                setSelectedRows([]);
                getSubjectByTeacherId(tId);
            })
            .catch(error => {
                console.error('Error deleting subjects:', error);
            })
            .finally(() => {
                setIsConfirmationDialogOpen(false);
            });
    };


      const actionsCellRenderer = (params) => {
        return (
          <>
            <button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>{getClassByCourse(params.data.courseId); getSections(params.data.classId); getSubjects(params.data.classId); handleEdit(params.data.id)}}>Edit</button>
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
        { headerName: "Course", field: "courseName" },
        { headerName: "Class", field: "className" },
        { headerName: "Section", field: "sectionName" },
        { headerName: "Subject", field: "subjectId" },
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
            <div className="navbar-heading">Edit Teacher</div>
            <div className="dropdown-container">
                <div className="dropdown">
                    <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                    <div className="dropdown-content">
                        <button className='render' onClick={()=>{navigate('/')}}>Logout</button>
                        {renderViewAsOptions()}
                        <button className='render' onClick={()=>{navigate('/teacher')}}>Teacher Records</button>
                        <button  className='render' onClick={()=>{navigate('/userManagement')}}>User Records</button>
                    </div>
                </div>
            </div>
            </div>
            </div>
            <div className='course-edit-section'>
            <div className="custom-col">
                {validationErrors.name && (
                    <div className='invalid-feedback'>{validationErrors.name}</div>
                )}
                <label >Name</label>
                <input type='text' className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`} placeholder='Enter name' value={EditName} 
                 onChange={handleNameChange}  />
                </div>
                <div className="custom-col">
                {validationErrors.email && (
                    <div className='invalid-feedback'>{validationErrors.email}</div>
                )}
                <label >Email</label>
                <input type='text' className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`} placeholder='Enter email' value={EditEmail}
                onChange={handleEmailChange} />
                </div>
                <div className="custom-col">
                {validationErrors.mobile && (
                    <div className='invalid-feedback'>{validationErrors.mobile}</div>
                )}
                <label >Mobile No.</label>
                <input type='text' className={`form-control ${validationErrors.mobile ? 'is-invalid' : ''}`} placeholder='Enter mobile no.' value={EditMob}
                onChange={handleMobileChange} />
                </div>
            </div>
            <div className='edit-save'>
                <button className='custom-btn custom-btn-primary width' onClick={handleUpdateTeacher}>
                    Save
                </button>
            </div>
            <div>
                <div className='course-edit-section'>
                    <h2>Subjects</h2>
                </div>
                <div className="navbar-buttons">
                    <Tooltip title='Add Subject'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
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
                        <h2>Add Subject</h2>
                    </div>
                    <div className='modal-body'>
                        <div className="custom-col">
                            <label >Course</label>
                            <select className="form-control" data-dropup-auto="false" value={courseId} onChange={(e) => {
                                console.log(e.target.value);
                                setCourseId(e.target.value);
                                getClassByCourse(e.target.value);
                            }}>
                                <option value="">--Select Course--</option>
                                {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                                ))}
                            </select>
                            </div>
                            <div className="custom-col">
                            <label >Class</label>
                            <select className="form-control" value={classId} 
                            onChange={(e) => {
                            setClassId(e.target.value)
                            getSections(e.target.value);
                            getSubjects(e.target.value);
                            }}>
                                <option value="">--Select Class--</option>
                                {classes.map((clas) => (
                                <option key={clas.id} value={clas.id}>
                                    {clas.name}
                                </option>
                                ))}
                            </select>
                            </div>    
                            <div className="custom-col">
                            <label >Section</label>
                            <select className="form-control" value={sectionId} 
                            onChange={(e) => setSectionId(e.target.value)}>
                                <option value="">--Select Section--</option>
                                {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                                ))}
                            </select>
                            </div>
                            <div className="custom-col">
                            <div className='roles'>
                            <label >Subjects</label>
                                {subjects.map((subject) => (
                                    <div key={subject.id}>
                                        <label className='role-check' htmlFor={subject.id}>
                                            <input
                                                type="checkbox"
                                                id={subject.id}
                                                value={subject.id}
                                                checked={subjectId.includes(subject.id)}
                                                onChange={() => handleSubjectChange(subject.id)}
                                            />
                                            &nbsp;{subject.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button className='custom-btn custom-btn-secondary-close' onClick={handleCloseForm}>
                            Close
                        </button>
                        <button className='custom-btn custom-btn-primary' onClick={handleAddMore}>
                            Save
                        </button>
                    </div>
                    </div>
                    </>
                )}
                </div>
                <div className="ag-theme-quartz" style={{ width:'100%', height: 50 }}>
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
                    width: 230,
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
                        <h2>Edit Subjects</h2>
                    </div>
                    <div className='modal-body'>
                            <div className="custom-col">
                            <label >Course</label>
                            <select className="form-control" data-dropup-auto="false" value={EditCourseId} onChange={(e) => {
                                console.log(e.target.value);
                                setEditCourseId(e.target.value);
                                getClassByCourse(e.target.value);
                            }}>
                                <option value="">--Select Course--</option>
                                {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                                ))}
                            </select>
                            </div>
                            <div className="custom-col">
                            <label >Class</label>
                            <select className="form-control" value={EditClassId} 
                            onChange={(e) => {
                            setEditClassId(e.target.value)
                            getSections(e.target.value);
                            getSubjects(e.target.value);
                            }}>
                                <option value="">--Select Class--</option>
                                {classes.map((clas) => (
                                <option key={clas.id} value={clas.id}>
                                    {clas.name}
                                </option>
                                ))}
                            </select>
                            </div>    
                            <div className="custom-col">
                            <label >Section</label>
                            <select className="form-control" value={EditSectionId} 
                            onChange={(e) => setEditSectionId(e.target.value)}>
                                <option value="">--Select Section--</option>
                                {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                                ))}
                            </select>
                            </div>
                            <div className="custom-col">
                            <div className='roles'>
                            <label >Subjects</label>
                                {subjects.map((subject) => (
                                    <div key={subject.id}>
                                        <label className='role-check' htmlFor={subject.id}>
                                            <input
                                                type="checkbox"
                                                id={subject.id}
                                                value={subject.id}
                                                checked={EditSubjectId.includes(subject.id)}
                                                onChange={() => handleEditSubjectChange(subject.id)}
                                            />
                                            &nbsp;{subject.name}
                                        </label>
                                    </div>
                                 ))}
                                 </div>
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
        </div>
        <div>
            <Footer></Footer>
        </div>
    </Fragment>
    );
        
}

export default TeacherEditSubject;



