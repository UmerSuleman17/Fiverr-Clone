import React from 'react';

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  paid: { label: 'Paid', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  'in-progress': { label: 'In Progress', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  delivered: { label: 'Delivered', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  completed: { label: 'Completed', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  buyer: { label: 'Buyer', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
  seller: { label: 'Pro Seller', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  admin: { label: 'Admin', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
};

const Badge = ({ type = 'pending', customLabel }) => {
  const config = statusConfig[type] || {
    label: customLabel || type,
    bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} transition-colors duration-150`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75 animate-pulse" />
      {customLabel || config.label}
    </span>
  );
};

export default Badge;
