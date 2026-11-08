import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E2DDD3] shadow-subtle p-5 md:p-6 transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-card hover:border-[#D5CEBF] cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
