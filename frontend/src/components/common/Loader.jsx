import React from 'react';

const Loader = ({ type = 'spinner', count = 3, size = 'md' }) => {
  if (type === 'skeleton-card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-4 space-y-4 animate-pulse">
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              </div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[220px] p-6 space-y-3">
      <div className={`${sizeClasses[size] || sizeClasses.md} border-emerald-200 dark:border-emerald-950 border-t-emerald-600 rounded-full animate-spin`} />
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 animate-pulse">Loading content...</span>
    </div>
  );
};

export default Loader;