import React from 'react';
import './Loading.css';

const Loading = ({ size = 'md', fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div className="loading-fullscreen">
        <div className={`spinner spinner-${size}`}></div>
        <p className="loading-text">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`}></div>
    </div>
  );
};

export default Loading;
