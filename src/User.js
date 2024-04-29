import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
 
const User = ({userName, role } ) => {

    const navigate = useNavigate();

  const renderViewAsOptions = () => {
    if (role.includes('Admin') && role.includes('User')) {
        return (
            <>
                <a className='render' onClick={()=>{navigate('/crud')}}>View as admin</a>
                {/* <a onClick={()=>{navigate('/user')}}">View as user</a> */}
            </>
        );
    } else if (role.includes('Admin')) {
        return <a className='render' onClick={()=>{navigate('/crud')}}>View as Admin</a>;
    // } else if (role.includes('User')) {
    //     return <a href="http://localhost:3000/user">View as User</a>;
    // } else {
        return null; 
    }
  };
  return (
    <>
    <div>
        <Header></Header>
    </div>
    <div className="dropdown-container">
            <div className="dropdown">
                <button className="dropbtn u"><PersonIcon className='icon'/><h4>{userName}</h4></button>
                <div className="dropdown-content">
                    <a className='render' href="http://localhost:3000/">Logout</a>
                    {renderViewAsOptions()}
                </div>
            </div>
    </div>
    <div>
      <h2>Under Progress</h2>
      <h2>Welcome {userName}</h2>
      <div className='viewingAs'><h4>Viewing as User</h4></div>
    </div>
    <div>
        <Footer></Footer>
    </div>
    </>
  )
}
 
export default User