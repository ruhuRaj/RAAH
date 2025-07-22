import React from "react";

function Loader({ size = 'md', className = '' }){
    let spinnerSize = '';
    switch(size){
        case 'sm':
      spinnerSize = 'w-6 h-6';
      break;
    case 'md':
      spinnerSize = 'w-8 h-8';
      break;
    case 'lg':
      spinnerSize = 'w-12 h-12';
      break;
    default:
      spinnerSize = 'w-8 h-8';
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-blue-500 border-t-transparent ${spinnerSize}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;