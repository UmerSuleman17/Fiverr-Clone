import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';

const GigCard = ({ gig, onFavoriteToggle, isFavorite = false }) => {
  if (!gig) return null;

  const defaultImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
  const imageUrl = (gig.images && gig.images.length > 0) ? gig.images[0] : defaultImage;
  const sellerAvatar = gig.seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

  return (
    <div className="card group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative">
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Link to={`/gig/${gig._id}`}>
            <img
              src={imageUrl}
              alt={gig.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          
          {/* Category Pill */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/70 text-white backdrop-blur-md">
            {gig.category || 'Freelance'}
          </span>

          {/* Favorite Button */}
          {onFavoriteToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle(gig._id);
              }}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-900/40 text-white hover:bg-rose-500 hover:text-white'
              }`}
              title="Save to Wishlist"
            >
              <FaHeart className="text-xs" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          {/* Seller Header */}
          <div className="flex items-center space-x-2.5">
            <img
              src={sellerAvatar}
              alt={gig.seller?.name || 'Seller'}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {gig.seller?.name || 'Top Rated Seller'}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Level 2 Seller</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/gig/${gig._id}`}>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {gig.title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Footer Meta: Rating & Price */}
      <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <FaStar className="text-amber-400 text-xs" />
          <span>{(gig.avgRating || 0).toFixed(1)}</span>
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-normal">
            ({gig.totalReviews || 0})
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block -mb-0.5">
            Starting at
          </span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            ${gig.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GigCard;