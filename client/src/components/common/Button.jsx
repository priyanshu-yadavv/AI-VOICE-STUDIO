import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  ...props
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-5 py-3 text-base gap-2.5",
    icon: "p-2 text-sm",
  };

  const variants = {
    primary: "bg-[#C27847] hover:bg-[#AA6536] text-white shadow-sm focus:ring-[#C27847]/40 active:translate-y-[0.5px]",
    secondary: "bg-[#2A2724] hover:bg-[#1A1816] text-[#FAF8F5] shadow-sm focus:ring-[#2A2724]/40 active:translate-y-[0.5px]",
    subtle: "bg-[#F4F1EA] hover:bg-[#EAE6DE] text-[#1F1D1A] border border-[#E2DDD3] focus:ring-[#C27847]/30",
    outline: "bg-transparent hover:bg-[#F4F1EA] text-[#1F1D1A] border border-[#E2DDD3] hover:border-[#D5CEBF] focus:ring-[#C27847]/30",
    ghost: "bg-transparent hover:bg-[#F4F1EA] text-[#68645D] hover:text-[#1F1D1A] focus:ring-[#C27847]/30",
    danger: "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 focus:ring-rose-400/40",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${sizeStyles[size]} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-0.5 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
