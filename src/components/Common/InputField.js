import React from "react";

function InputField({label, type= 'text', name, value, onChange, placeholder, className = '', ...props}) {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-gray-700 text-sm fontbold mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
                {...props}
            />
        </div>
    );
}

export default InputField;