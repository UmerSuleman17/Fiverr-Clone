import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUser } from 'react-icons/fa';

const GigCard = ({ gig }) => {
  return (
    <Link to={`/gig/${gig._id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        {/* Image */}
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
          {gig.images && gig.images.length > 0 ? (
            <img 
              src={gig.images[0]} 
              alt={gig.title} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{gig.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{gig.description}</p>
          
          {/* Rating & Seller */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-400" />
              <span className="font-medium">{gig.avgRating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({gig.totalReviews})</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <FaUser className="text-xs" />
              <span>{gig.seller?.name || 'Unknown'}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-sm text-gray-500">Starting at</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">${gig.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;