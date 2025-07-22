import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClickableGrievanceTitle = ({ title, grievanceId, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/grievances/${grievanceId}`);
  };

  return (
    <h3 
      className={`cursor-pointer hover:text-blue-600 hover:underline transition-colors ${className}`}
      onClick={handleClick}
    >
      {title}
    </h3>
  );
};

export default ClickableGrievanceTitle; 