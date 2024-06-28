import React, { useState, Fragment  } from 'react';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import Footer from './Footer';
import Header from './Header';
import './style.css';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const MyCalendar = ({ userName, role })=> {
  const [value, setValue] = useState(new Date());
  const navigate = useNavigate();

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
    <div>
        <Header></Header>
    </div>
    <div className='ad'>
        <div className="navbar">
        <div className="navbar-heading">Calendar</div>
        <div className="dropdown-container">
            <div className="dropdown">
                <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                <div className="dropdown-content">
                    <button className='render' onClick={()=>{navigate('/')}}>Logout</button>
                    <button className='render' onClick={()=>{navigate('/crud')}}>Student record</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    <div className="calendar-container">
      <Calendar onChange={handleChange} value={value} />
    </div>
    <div>
        <Footer></Footer>
    </div>
    </Fragment>
  );
}

export default MyCalendar;

