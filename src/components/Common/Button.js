import React from 'react';

function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  let baseStyles = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200 ease-in-out';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50';
      break;
    case 'outline':
      variantStyles = 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
      break;
    case 'danger':
      variantStyles = 'bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50';
      break;
    default:
      variantStyles = 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
