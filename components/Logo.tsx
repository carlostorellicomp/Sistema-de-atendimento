import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 240 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Sound Waves (Left) */}
      <path d="M10 40C6 35 6 25 10 20" stroke="#33d3b1" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 36C15 32 15 28 18 24" stroke="#33d3b1" strokeWidth="3" strokeLinecap="round" />

      {/* Headset Arc */}
      <path d="M60 15 C 60 5, 40 5, 40 15 C 40 25, 40 25, 40 25" stroke="#33d3b1" strokeWidth="4" strokeLinecap="round" />
      
      {/* Ear Cup */}
      <circle cx="60" cy="25" r="9" stroke="#33d3b1" strokeWidth="4" fill="transparent" />
      
      {/* Mic Boom */}
      <path d="M60 34 C 60 45, 35 45, 35 40" stroke="#33d3b1" strokeWidth="3" strokeLinecap="round" />
      <circle cx="35" cy="40" r="3" fill="#33d3b1" />

      {/* Text ATENDENTE */}
      <text 
        x="85" 
        y="40" 
        fill="#33d3b1" 
        fontFamily="sans-serif" 
        fontSize="28" 
        fontWeight="300"
        letterSpacing="3"
      >
        ATENDENTE
      </text>
    </svg>
  );
};