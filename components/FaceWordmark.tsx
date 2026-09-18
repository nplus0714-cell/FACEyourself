import React from 'react';

interface FaceWordmarkProps {
  className?: string;
}

export const FaceWordmark: React.FC<FaceWordmarkProps> = ({ className = '' }) => (
  <span className={`block overflow-hidden ${className}`}>
    <img
      src="/images/brand/face-trader-logo-master-2026-09-04.png"
      alt="FACE TRADER"
      className="h-full w-full object-cover object-center"
    />
  </span>
);
