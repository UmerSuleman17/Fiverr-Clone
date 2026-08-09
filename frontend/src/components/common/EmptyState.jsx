import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, description, actionText, actionLink, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 my-4 shadow-soft-sm">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 text-2xl">
          <Icon />
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed mb-6">
        {description}
      </p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn-primary">
            {actionText}
          </Link>
        ) : (
          <button onClick={onAction} className="btn-primary">
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
