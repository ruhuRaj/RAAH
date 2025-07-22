import React, { useState, useEffect } from 'react';

function Message({ type, message, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!isVisible || !message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 p-3 rounded-md text-white shadow-lg ${bgColor} z-50`}>
      {message}
    </div>
  );
}

export default Message;
