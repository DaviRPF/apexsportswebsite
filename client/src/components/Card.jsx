import React from 'react';
import './Card.css';

const Card = ({ children, title, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
