import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    class="lucide lucide-move-left preview-icon"
    onClick = {() => navigate(-1)}
    className="cursor-pointer text-white hover:text-brand hover:drop-shadow-[0_0_8px_currentColor] transition-all duration-200"
    >
      <path d="M6 8L2 12L6 16" />
      <path d="M2 12H22" />
    </svg>     
    
  );
};

export default BackButton;
