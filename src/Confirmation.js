import React from 'react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`confirmation-dialog ${isOpen ? 'open' : 'closed'}`}>
      <div className="dialog-content">
        <p>Are you sure you want to delete this student?</p>
      <div className="button-container">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="cancel-button" onClick={onClose}>No</button>
        </div>
    </div>
    </div>
  );
};

export default ConfirmationDialog;
