// src/components/CustomerInput.jsx
import React from 'react';

const CustomerInput = ({ type, name, placeholder, className }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`input-field ${className}`}
    />
  );
};

export default CustomerInput;
