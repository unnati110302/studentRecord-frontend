import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Header from './Header';
import Footer from './Footer';
 
const User = ({userName}) => {
  return (
    <>
    <div>
        <Header></Header>
    </div>
    <div className="dropdown-container">
            <div className="dropdown">
                <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                <div className="dropdown-content">
                    <a href="http://localhost:3000/">Logout</a>
                </div>
            </div>
    </div>
    <div>
      <h2>Under Progress</h2>
    </div>
    <div>
        <Footer></Footer>
    </div>
    </>
  )
}
 
export default User