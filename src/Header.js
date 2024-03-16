import React from 'react';
import './style.css'; 

const Header = () => {
    return (
        <div className="header">
            <div className='header-contents'>
                <div className="logo-container">
                    <img src={process.env.PUBLIC_URL + '/alletec.webp'} alt="Logo" className="logo" />
                </div>
                <div className="dropdown-container">
                    <div className="dropdown">
                        <button className="dropbtn">Students</button>
                        <div className="dropdown-content">
                            <a href="http://localhost:3000/">Student Records</a>
                            <a href="http://localhost:3000/">About us</a>
                        </div>
                    </div>
                    <div className="dropdown">
                        <button className="dropbtn">Contact</button>
                        <div className="dropdown-content">
                            <a href="#">Contact Information</a>
                            <a href="#">Write to us</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
