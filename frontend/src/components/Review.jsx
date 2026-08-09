import React from 'react';
import { FaStar } from 'react-icons/fa';

const Review = ({ review }) => {
  if (!review) return null;

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
  const buyerAvatar = review.buyer?.avatar || defaultAvatar;
  const buyerName = review.buyer?.name || 'Verified Buyer';

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-soft-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={buyerAvatar}
            alt={buyerName}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-slate-900 dark:text-white">{buyerName}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
            </span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
          <FaStar />
          <span>{review.rating}.0</span>
        </div>
      </div>

      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pt-1">
        "{review.comment}"
      </p>
    </div>
  );
};

export default Review;