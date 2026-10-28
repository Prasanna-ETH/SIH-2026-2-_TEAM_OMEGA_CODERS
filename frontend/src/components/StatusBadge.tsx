import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = (status || '').toUpperCase().trim();

  let bg = 'bg-slate-100 text-slate-700 border-slate-300';

  if (norm.includes('COMPLIANT') || norm === 'VERIFIED' || norm === 'RESOLVED' || norm === 'VALID') {
    bg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  } else if (norm.includes('REVIEW') || norm === 'UNDER_INVESTIGATION' || norm === 'UNDER_REVIEW' || norm === 'WARNING') {
    bg = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (norm.includes('ATTENTION') || norm === 'ERROR' || norm === 'CONFLICT' || norm === 'CAPACITY_BREACH' || norm === 'REJECTED') {
    bg = 'bg-rose-50 text-rose-800 border-rose-300';
  } else if (norm.includes('INFO') || norm === 'PROCESSED' || norm === 'ACTIVE') {
    bg = 'bg-blue-50 text-blue-800 border-blue-300';
  }

  const px = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold rounded border ${bg} ${px}`}>
      {status}
    </span>
  );
};
