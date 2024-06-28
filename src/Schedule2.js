import React, { useState,useEffect, Fragment } from 'react';
import './style.css';
import { Scheduler } from "@aldabil/react-scheduler";
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import { local_url,api_url } from './configuration';
import axios from 'axios';

const Schedule2 = ({ userName, role }) => {

    const[TeacherData, setTeacherData] = useState([]);
    const[otherFields, setOtherFields] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTeachers();
    }, []);

    useEffect(() => {
      console.log("Updated TeacherData:", TeacherData);
      
    }, [TeacherData]);

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


    const getTeachers = async () => {
        try {
          const result = await authorizedFetch(`${api_url}/teachers`);
          console.log("Raw response object:", result);
    
          const data = await result.json();
          console.log("Parsed JSON data:", data);
          console.log("Name"+data.map(t=>t.name));
    
          setTeacherData(data);
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
    };

    const getCourseByTeacherId = async(id) =>{
        console.log(id);
        try{
        const result = await authorizedFetch(`${api_url}/subjectBy/${id}`);
        console.log("response:", result);
        const data = await result.json();
        setOtherFields(data);
        }
        catch(error){
            console.log(error)
        }
    }

  const [events, setEvents] = useState([
    {
      event_id: 1,
      title: "Event 1",
      start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
      end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
      teacher: 'Esha Husain',
      // course : "btech",
      // class : "1st year",
      // section: "A",
      // subject : "Maths",
    },
  ]);

  const renderViewAsOptions = () => {
    if (role.includes('Admin') && role.includes('User')) {
        return (
            <>
                <button className='render' onClick={()=>{navigate('/user')}}>View as user</button>
                <button className='render' onClick={()=>{navigate('/crud')}}>Student record</button>
            </>
        );
    }
    else if(role.includes('Admin') || role.includes('Teacher')){
      return(
          <>
              <button className='render' onClick={()=>{navigate('/crud')}}>Student record</button>
          </>
      )
    } else if (role.includes('User')) {
        return <button className='render' onClick={()=>{navigate('/user')}}>View as User</button>;
    } else {
        return null; 
    }
  };

  const handleConfirm = (event, action) => {
    if (action === "create") {
      setEvents([...events, { ...event, event_id: events.length + 1 }]);
    } else if (action === "edit") {
      setEvents(events.map(ev => (ev.event_id === event.event_id ? event : ev)));
    }
  };

  return (
    <Fragment>
      <div>
        <Header />
      </div>
      <div className='ad'>
        <div className="navbar">
          <div className="navbar-heading">Schedule</div>
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
      <div className='schedule-container'>
        <Scheduler
          view="month"
          events={events}
          // month={
          //   cellRenderer: monthCellRenderer
          // }
          fields={[
            {
              name: "teacher",
              type: "select",
              options: TeacherData.map(t => ({ id: t.id, text: t.name, value: t.id })),
              config: { label: "Teacher", required: true, errMsg: "Please select a teacher" },
              default:"",
              className: "select-dropdown",
              onChange: (value) => {
                console.log("Selected teacher ID:", value); 
                getCourseByTeacherId(value);
            },
            // onFocus: () => {
            //     console.log("TeacherData on focus:", TeacherData); 
            // }

            },
            {
              name: "course",
              type: "select",
              options: otherFields.map(f => ({ id: f.courseId, text: f.courseName, value: f.courseId })),
              config: { label: "Course", required: true, errMsg: "Please select a course" }
            },
            {
                name: "class",
                type: "select",
                options: otherFields.map(f => ({ id: f.classId, text: f.className, value: f.classId })),
                config: { label: "Class", required: true, errMsg: "Please select a class" }
            },
            {
                name: "section",
                type: "select",
                options: otherFields.map(f => ({ id: f.sectionId, text: f.sectionName, value: f.sectionId })),
                config: { label: "Section", required: true, errMsg: "Please select a section" }
            },
            {
                name: "subject",
                type: "select",
                options: otherFields.map(f => ({ id: f.subjectId, text: f.subjectId, value: f.subjectId })),
                config: { label: "Subject", required: true, errMsg: "Please select a subject" }
            },
          ]}
          onConfirm={handleConfirm}
        />
      </div>
      <div>
        <Footer />
      </div>
    </Fragment>
  );
}

export default Schedule2;
