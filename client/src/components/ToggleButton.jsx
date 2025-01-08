import React, { useState } from "react";

const ToggleButton = ({ className, onClick, children }) => {
  return (
    <div>
      <button className={className} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default ToggleButton;
