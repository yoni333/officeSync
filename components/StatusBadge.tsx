import React from 'react';
import { LocationType } from '../types';
import { LOCATION_COLORS, LOCATION_LABELS, LOCATION_ICONS } from '../constants';

interface StatusBadgeProps {
  status: LocationType;
  onClick?: () => void;
  className?: string;
  large?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick, className = '', large = false }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg border transition-all duration-200";
  const sizeClasses = large ? "px-4 py-3 text-lg font-medium shadow-sm" : "px-2 py-1 text-sm font-medium";
  const cursorClass = onClick ? "cursor-pointer hover:opacity-80 active:scale-95" : "";
  const colorClass = LOCATION_COLORS[status];

  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${colorClass} ${cursorClass} ${className}`}
    >
      <span className={large ? "ml-2" : "ml-1"}>{LOCATION_ICONS[status]}</span>
      <span>{LOCATION_LABELS[status]}</span>
    </div>
  );
};