import React from 'react';

interface FaceWordmarkProps {
  className?: string;
}

export const FaceWordmark: React.FC<FaceWordmarkProps> = ({ className = '' }) => (
  <svg
    viewBox="0 0 350 160"
    role="img"
    aria-label="FACE"
    className={className}
  >
    <title>FACE</title>
    <g
      fontFamily="'Helvetica Neue', 'Noto Sans TC', Arial, sans-serif"
      fontSize="82"
      fontWeight="400"
      letterSpacing="0"
    >
      <text x="2" y="108" fill="#111111">F</text>
      <text x="76" y="108" fill="#111111">A</text>
      <text x="190" y="108" fill="#111111">C</text>
      <text x="276" y="108" fill="#111111">E</text>
    </g>

    <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <path
        d="M137 8 L173 25 L173 153 L138 137 M137 8 L137 32"
        stroke="#A7A7A7"
        strokeWidth="3.8"
      />
      <path
        d="M142 16 L166 28 L166 143 L142 132 M142 16 L142 31"
        stroke="#D0D0D0"
        strokeWidth="1.35"
      />
    </g>
  </svg>
);
