import React, {useState, useEffect, Fragment, useRef  } from 'react';
import './style.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {student_url, api_url, local_url} from './configuration';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import AddIcon from '@mui/icons-material/Add';


const Tree = ({ userName, role, setId, setClassId }) => {

    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(false);
    const [selectedClass, setSelectedClass] = useState(false);
    const [selectedSection, setSelectedSection] = useState(false);
    const [selectedSubjects, setSelectedSubject] = useState(false);
    const [classData, setClassData] = useState([]);
    const [courseData, setCourseData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const[name, setName] = useState('');
    const [heading, setHeading] = useState('');
    const[className, setClassName] = useState('');
    const[session, setSession] = useState('');
    const [courseId, setCourseId] = useState('');
    const [classIdForTree, setClassIdForTree] = useState('');
    const[SectionName, setSectionName] = useState('');
    const[EditSectionName, setEditSectionName] = useState('');
    const[EditSectionId, setEditSectionId] = useState('');
    const [SubjectName, setSubjectName] = useState('');
    const [SubjectCode, setSubjectCode] = useState('');
    const [TotalLectures, setTotalLectures] = useState('');
    const[EditSubjectName, setEditSubjectName] = useState('');
    const[EditTotalLectures, setEditTotalLectures] = useState('');
    const[EditSubjectId, setEditSubjectId] = useState('');

    const navigate = useNavigate();
    const modalRef = useRef();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const handleCloseForm = () => {
        setName('');
        setShowForm(false);
        document.body.classList.remove('modal-open');
    };
    const handleForm = () => setShowForm(true);

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        document.body.classList.remove('modal-open');
    }

    const onGridReady = (params) => {
        console.log("Grid Ready");
        setGridApi(params.api);
    };

    useEffect(() => {
        getCourses();
        const handleDocumentClick = (event) => {
            const modalContainer = modalRef.current;
            if (modalContainer && !modalContainer.contains(event.target)) {
                handleCloseForm();
                //handleClose();
            }
        };
   
        document.addEventListener('mousedown', handleDocumentClick);
   
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
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
        } 
        else if (role.includes('User')) {
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


    const getCourses = async() =>{
        try{
        const result = await authorizedFetch(`${api_url}/courses`);
        console.log("response:", result);
        const data = await result.json();
        setCourseData(data);
        setCourses(data);
        }
        catch(error){
            console.log(error)
        }
    }

    const getClassByCourse = async(id) =>{
        console.log(id);
        try{
        const result = await axios.get(`${api_url}/class/bycourse/${id}`);
        console.log("response:", result);
        const data = await result.data;
        setClasses(data);
        setClassData(data);
        }
        catch(error){
            console.log(error);
            setClassData([]);
        }
    }

    const getSubjectsByClass = async(id) =>{
        console.log(id);
        try{
            const result = await axios.get(`${api_url}/subject/byclass/${id}`);
            console.log(result.data.subCode);
            const data = await result.data;
            setSubjects(data);
            setSubjectData(data);
        }
        catch(error){
            console.log(error);
            setSubjectData([]);
        }
    }

    const getSectionsByClass = async(id) =>{
        console.log(id);
        try{
        const result = await axios.get(`${api_url}/section/byclass/${id}`);
        console.log("response:", result);
        const data = await result.data;
        setSectionData(data);
        setSections(data);
        }
        catch(error){
            console.log(error.message);
            setSectionData([]);
        }
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

    const handleSubmitSection = async(e) =>{
        try{
            e.preventDefault();      
            const currentDate = new Date().toISOString();
            const url = `${api_url}/section`;
            const data = {
                "classId":classIdForTree,
                "name": SectionName,
                "isActive": 1,
                "createdBy": 1, 
                "createdOn": currentDate, 
                "modifiedBy": 1,  
                "modifiedOn": currentDate,
            } 
            const result = await axios.post(url, data);
            getSectionsByClass(classIdForTree);
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
               "classId": classIdForTree,
               "name": EditSectionName,
               "isActive": 1,
               "createdBy": 0,
               "createdOn": currentDate,
               "modifiedBy": 0,
               "modifiedOn": currentDate,
           }
           const result = await axios.put(url, data);
            setEditSectionName('');
            handleClose();
            getSectionsByClass(classIdForTree)
            toast.success('Class has been updated');
           }catch(error){
                toast.error(error.message);
            }
    }

    const handleEdit = async(id) =>{
        try {
            console.log(id);
            setCourseId(id);
            setId(id);
            navigate('/courseEdit');
        }
        catch(error){
            console.error('Error editing student:', error);
            toast.error(error);
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

    const handleCourseClick = () => {
        setSelectedClass(false);
        setSelectedSection(false);
        setSelectedSubject(false);
        setSelectedCourse(true);
        setHeading("Course");
    };

    const handleClassClick = (id) => {
        setCourseId(id);
        setSelectedCourse(false);
        setSelectedSection(false);
        setSelectedSubject(false);
        setSelectedClass(true);
        setHeading("Class");
    };

    const handleSectionClick = (id) => {
        setClassIdForTree(id);
        setSelectedCourse(false);
        setSelectedClass(false);
        setSelectedSubject(false);
        setSelectedSection(true);
        setHeading("Section");
    };

    const handleSubjectClick = (id) => {
        setClassIdForTree(id);
        setSelectedCourse(false);
        setSelectedClass(false);
        setSelectedSection(false);
        setSelectedSubject(true);
        setHeading("Subject");
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
        { headerName: "S.No.", valueGetter: "node.rowIndex + 1", width: 90 },
        { headerName: "Course Name", field: "name" },
        { headerName: "Actions", cellRenderer: actionsCellRenderer },
    ]);

    const handleAddButtonClick=() =>{
        handleForm(); 
        document.body.classList.add('modal-open');
   }

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
        getCourses();
        const response = result.data;
        console.log(response.id);
        clear();
        handleCloseForm();
        toast.success('Course has been added');
        getCourses();
        }catch(error){
            toast.error(error);
        }
    };

    const clear = () =>{
        setName('');
    }

    const handleEditClass = (id) =>{
        console.log(id);
        setClassId(id);
        navigate('/section');

    }

    const actionsCellRenderer2 = (params) => {
        return (
            <>
            <button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>{handleEditClass(params.data.id)}}>Edit</button>
            </>
        );
    };

    const [colDefs2, setColDefs2] = useState([   
        { headerCheckboxSelection: true, checkboxSelection: true, onSelectionChanged: () => {
            const selectedRows = gridApi.api.getSelectedRows();
            console.log("rows"+selectedRows)
            const selectedIds = selectedRows.map(row => row.id);
            console.log("ids"+selectedIds)
            handleCheckboxChange(selectedIds);
        }, width: 60 },
        { headerName: "S.No.", valueGetter: "node.rowIndex + 1", width: 80 },
        { headerName: "Class Name", field: "name" },
        { headerName: "Session", field: "session" },
        { headerName: "Actions", cellRenderer: actionsCellRenderer2 },
    ]);

    const handleSubmitClass = async(e) =>{
        try{
            e.preventDefault();      
            const currentDate = new Date().toISOString();
            const url = `${api_url}/classes`;
            const data = {
                "courseId":courseId,
                "name": className,
                "session": session,
                "isActive": 1,
                "createdBy": 1, 
                "createdOn": currentDate, 
                "modifiedBy": 1,  
                "modifiedOn": currentDate,
            } 
            const result = await axios.post(url, data);
            getClassByCourse(courseId);
            const response = await result.data;
            clear();
            handleCloseForm();
            toast.success('Class has been added');
            }catch(error){
                toast.error('A record with the same email or mobile number already exists.');
                
            }
    }

    const actionsCellRenderer3 = (params) => {
        return (
            <>
            <button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>{handleEditSection(params.data.id)}}>Edit</button>
            </>
        );
    };
    
    const [colDefs3, setColDefs3] = useState([   
        { headerCheckboxSelection: true, checkboxSelection: true, onSelectionChanged: () => {
            const selectedRows = gridApi.api.getSelectedRows();
            console.log("rows"+selectedRows)
            const selectedIds = selectedRows.map(row => row.id);
            console.log("ids"+selectedIds)
            handleCheckboxChange(selectedIds);
        }, width: 70 },
        { headerName: "S.No.", valueGetter: "node.rowIndex + 1", width: 80 },
        { headerName: "Section Name", field: "name" },
        { headerName: "Actions", cellRenderer: actionsCellRenderer3 },
    ]);

    const actionsCellRenderer4 = (params) => {
        return (
            <>
            <button className='custom-btn custom-btn-primary' id='edit-btn' onClick={() =>{handleEditSubject(params.data.id)}}>Edit</button>
            </>
        );
    };

    const [colDefs4, setColDefs4] = useState([   
        { headerCheckboxSelection: true, checkboxSelection: true, onSelectionChanged: () => {
            const selectedRows = gridApi.api.getSelectedRows();
            console.log("rows"+selectedRows)
            const selectedIds = selectedRows.map(row => row.id);
            console.log("ids"+selectedIds)
            handleCheckboxChange(selectedIds);
        }, width: 70 },
        { headerName: "S.No.", valueGetter: "node.rowIndex + 1", width: 80 },
        { headerName: "Subject Code", field: "subCode" },
        { headerName: "Subject Name", field: "name" },
        { headerName: "Total Lectures", field: "totalLectures" },
        { headerName: "Actions", cellRenderer: actionsCellRenderer4 },
    ]);

    const handleSubmitSubject = async(e) =>{
        try{
            e.preventDefault();      
            const currentDate = new Date().toISOString();
            const url = `${api_url}/subject`;
            const data = {
                "classId":classIdForTree,
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
            getSubjectsByClass(classIdForTree);
            const response = await result.data;
            clearSubjects();
            handleCloseForm();
            toast.success('Class has been added');
            }catch(error){
                toast.error('A record with the same email or mobile number already exists.');
                
            }
    }

    const clearSubjects = ()=>{
        setSubjectCode('');
        setEditSubjectName('');
        setTotalLectures('');
    }

    const handleEditSubject = async(id) =>{
        handleShow(); 
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
               "classId": classIdForTree,
               "subCode": SubjectCode,
               "name": EditSubjectName,
               "totalLectures":EditTotalLectures,
               "isActive": 1,
               "createdBy": 0,
               "createdOn": currentDate,
               "modifiedBy": 0,
               "modifiedOn": currentDate,
           }
           const result = await axios.put(url, data);
            setEditSubjectName('');
            handleClose();
            getSubjectsByClass(classIdForTree)
            toast.success('Class has been updated');
           }catch(error){
                toast.error(error.message);
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
            <Tooltip title='List View'><span><button type="button" className="custom-btn custom-btn-primary" id='tree-btn' onClick={()=>{navigate("/course")}}>
            List View
            </button></span></Tooltip>
            {/* <div className='viewingAs'><h4>Viewing as Admin</h4></div> */}
        </div>
        {/* <h2>Tree View</h2> */}
        <div className='tree-grid'>
        <SimpleTreeView 
            aria-label="file system navigator"
            sx={{ height: 800, flexGrow: 1, maxWidth: 300, overflowY: 'auto' }}
            >
                <TreeItem itemId='courses' label="Courses" style={{ background: 'rgb(240,240,240)' ,color: 'black' }} onClick={() => handleCourseClick()}>
                {Array.isArray(courses) && courses.map(course => (
                    <TreeItem key={course.id} itemId={`course-${course.id}`} label={course.name} style={{ background: 'rgb(240,240,240)' ,color: 'rgb(120,0,0)' }}>
                        <TreeItem itemId={`classes-${course.id}`} label="Classes" style={{ color: 'black' }} onClick={() => {getClassByCourse(course.id); handleClassClick(course.id)}}>
                            {Array.isArray(classes) && classes.filter(classs => classs.courseId === course.id).map(classs => (
                                <TreeItem key={classs.id} itemId={`course-${course.id}-class-${classs.id}`} label={classs.name} style={{ color: 'rgb(120,0,0)' }}>
                                    <TreeItem itemId={`sections-${classs.id}`} label="Sections" style={{ color: 'black' }} onClick={() => {getSectionsByClass(classs.id); handleSectionClick(classs.id)}}>
                                        {Array.isArray(sections) && sections.filter(section => section.classId === classs.id).map(section => (
                                            <TreeItem key={section.id} itemId={`class-${classs.id}-section-${section.id}`} label={section.name} style={{ color:'rgb(85,107,47)' }}>
                                            </TreeItem>
                                        ))}
                                    </TreeItem>
                                    <TreeItem itemId={`subjects-${classs.id}`} label="Subjects" style={{ color: 'black' }} onClick={() => {getSubjectsByClass(classs.id); handleSubjectClick(classs.id)}}>
                                        {Array.isArray(subjects) && subjects.filter(subject => subject.classId === classs.id).map(subject => (
                                                <TreeItem key={subject.id} itemId={`class-${classs.id}-subject-${subject.id}`} label={subject.name} style={{ color: 'rgb(85,107,47)' }}>
                                                </TreeItem>
                                        ))}
                                    </TreeItem>
                                </TreeItem>
                            ))}
                    </TreeItem>
                </TreeItem>
                ))}
            </TreeItem>
        </SimpleTreeView>
        {selectedCourse && (
        <>
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
            <div className="ag-theme-quartz" style={{ height: 300, width: 600, marginLeft:300}}>
            <h2>{heading} Details</h2>
            <div className='tree-add'>
            <Tooltip title='Add Student'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
            <AddIcon />
            </button></span></Tooltip>
            </div>
            <AgGridReact
            columnDefs={colDefs}
            rowData={courseData}
            rowSelection="multiple"
            rowHeight={30}
            headerHeight={40}
            pagination={true}
            paginationPageSize={2}
            paginationPageSizeSelector={[2, 5, 10, 20, 50, 100]}
            defaultColDef={{
                sortable: true,
                width: 200,
                filter:true,
            }}
            onGridReady={onGridReady}
            domLayout="autoHeight"
            onSelectionChanged={handleSelectionChanged}
            />
            </div>
        </>
        )}
        {selectedClass && (
        <>
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
                        <input type='text' className='form-control' placeholder='Enter Class Name' value={className}
                        onChange = {(e)=> setClassName(e.target.value)} />
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
                        <button className='custom-btn custom-btn-primary' onClick={handleSubmitClass}>
                            Save
                        </button>
                    </div>
                </div>
                </>
            )}
            </div>
            <div className="ag-theme-quartz" style={{ height: 300, width: 600, marginLeft:300}}>
            <h2>{heading} Details</h2>
            <div className='tree-add'>
            <Tooltip title='Add Student'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
            <AddIcon />
            </button></span></Tooltip>
            </div>
            <AgGridReact
                columnDefs={colDefs2}
                rowData={classData}
                rowSelection="multiple"
                rowHeight={30}
                headerHeight={40}
                pagination={true}
                paginationPageSize={2}
                paginationPageSizeSelector={[2, 5, 10, 20, 50, 100]}
                defaultColDef={{
                    sortable: true,
                    width: 150,
                    filter:true,
                }}
                onGridReady={onGridReady}
                domLayout="autoHeight"
                onSelectionChanged={handleSelectionChanged}
            />
            </div>
        </>
        )}
        {selectedSection && (
        <>
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
                        <button className='custom-btn custom-btn-primary' onClick={handleSubmitSection}>
                            Save
                        </button>
                    </div>
                    </div>
                    </>
                )}
                </div>
                <div className="ag-theme-quartz" style={{ height: 300, width: 600, marginLeft:300 }}>
                <h2>{heading} Details</h2>
                <div className='tree-add'>
                <Tooltip title='Add Sections'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
                <AddIcon />
                </button></span></Tooltip>
                </div>
                <AgGridReact
                columnDefs={colDefs3}
                rowData={sectionData}
                rowSelection="multiple"
                rowHeight={30}
                headerHeight={40}
                pagination={true}
                paginationPageSize={2}
                paginationPageSizeSelector={[2, 5, 10, 20, 50, 100]}
                defaultColDef={{
                    sortable: true,
                    width: 200,
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
        </>
        )}
        {selectedSubjects && (
        <>
        <div>
        {showForm && (
                    <>
                    <div className='modal-container' ref={modalRef} >
                    <div className='modal-header'>
                    <span class="close-btn" onClick = {handleCloseForm}>&times;</span>
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
                        <button className='custom-btn custom-btn-secondary-close' onClick={handleCloseForm}>
                            Close
                        </button>
                        <button className='custom-btn custom-btn-primary' onClick={handleSubmitSubject}>
                            Save
                        </button>
                    </div>
                    </div>
                    </>
                )}
            </div>
                <div className="ag-theme-quartz" style={{ height: 300, width: 600, marginLeft:300 }}>
                <h2>{heading} Details</h2>
                <div className='tree-add'>
                <Tooltip title='Add Subjects'><span><button type="button" className="custom-btn custom-btn-primary" onClick={handleAddButtonClick}>
                <AddIcon />
                </button></span></Tooltip>
                </div>
                <AgGridReact
                columnDefs={colDefs4}
                rowData={subjectData}
                rowSelection="multiple"
                rowHeight={30}
                headerHeight={40}
                pagination={true}
                paginationPageSize={2}
                paginationPageSizeSelector={[2, 5, 10, 20, 50, 100]}
                defaultColDef={{
                    sortable: true,
                    width: 150,
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
                <button  className='custom-btn custom-btn-secondary-close' onClick={handleClose}>
                    Close
                </button>
                <button className='custom-btn custom-btn-primary' onClick={handleUpdateSubject}>
                    Save
                </button>
                </div>
        </div>
        )}
        </div>
        </>
        )}
        </div>
        </div>
        <div>
            <Footer></Footer>
        </div>
    </Fragment>
    );

}

export default Tree;