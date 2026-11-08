import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-[#E2DDD3] rounded-2xl bg-[#FAF8F5]/50 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] border border-[#E2DDD3] flex items-center justify-center text-[#C27847] mb-4 shadow-subtle">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[#1F1D1A] mb-1">{title}</h3>
      <p className="text-sm text-[#68645D] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
