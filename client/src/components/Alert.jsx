import React from 'react';
import './Alert.css';

const Alert = ({ children, variant = 'info', onClose }) => {
  return (
    <div className={`alert alert-${variant} fade-in`}>
      <div className="alert-content">{children}</div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
