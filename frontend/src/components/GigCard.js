import React from 'react';
import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
  return (
    <Link to={`/gig/${gig._id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        {gig.images && gig.images.length > 0 && (
          <img src={gig.images[0]} alt={gig.title} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{gig.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{gig.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-500">⭐ {gig.avgRating.toFixed(1)} ({gig.totalReviews})</span>
            <span className="text-green-600 font-bold">${gig.price}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">by {gig.seller?.name || 'Unknown'}</p>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;