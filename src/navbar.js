import React from 'react';
import './style.css';
import {selectedRows} from './CRUD'

const Navbar = ({ handleAddButtonClick, handleMultipleDelete }) => {
  return (
    <div className="navbar">
      <div className="navbar-heading">Student Record</div>
      <div className="navbar-buttons">
      <button type="button" className="custom-btn custom-btn-primary"onClick={handleAddButtonClick}>
          Add
      </button>
      <button type="button" className="custom-btn custom-btn-danger" onClick={handleMultipleDelete} disabled={selectedRows.length === 0} >
          Delete
      </button>
      </div>
    </div>
  );
};

export default Navbar;
