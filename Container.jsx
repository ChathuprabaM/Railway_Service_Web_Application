// src/components/Container.jsx
import React from 'react';

const Container = ({ children, class1 }) => {
  return (
    <div className={`container ${class1}`}>
      {children}
    </div>
  );
};

export default Container;
