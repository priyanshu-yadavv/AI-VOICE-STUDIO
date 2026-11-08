import React from 'react';

export default function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  const base = "inline-flex items-center font-medium rounded-md transition-colors";
  
  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  const variants = {
    neutral: "bg-[#F4F1EA] text-[#68645D] border border-[#E2DDD3]",
    accent: "bg-[#FBF3ED] text-[#C27847] border border-[#F3D5C0]",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    dark: "bg-[#2A2724] text-[#FAF8F5]",
  };

  return (
    <span className={`${base} ${sizeStyles[size]} ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
}
