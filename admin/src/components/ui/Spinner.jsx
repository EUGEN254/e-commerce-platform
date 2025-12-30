import React from 'react';

const Spinner = ({ size = 16, className = '' }) => {
  const px = size;
  return (
    <div className={`inline-block ${className}`} aria-hidden>
      <svg
        className="animate-spin"
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
        <path
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          fill="currentColor"
          className="opacity-75"
        />
      </svg>
    </div>
  );
};

export default Spinner;
