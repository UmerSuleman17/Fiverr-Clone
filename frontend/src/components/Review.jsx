import React from 'react';

const Review = ({ review }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3">
      <div className="flex items-center gap-2">
        <img src={review.buyer?.avatar || '/default-avatar.png'} alt={review.buyer?.name} className="w-8 h-8 rounded-full" />
        <span className="font-medium">{review.buyer?.name || 'User'}</span>
        <span className="text-yellow-500">⭐ {review.rating}</span>
        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="mt-1 text-gray-700 dark:text-gray-300">{review.comment}</p>
    </div>
  );
};

export default Review;