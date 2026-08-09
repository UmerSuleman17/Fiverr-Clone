import React, { useState, useEffect } from 'react';
import api from '../api/api';
import GigCard from '../components/GigCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        setItems(res.data || []);
      } catch (err) {
        toast.error('Failed to load saved wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (gigId) => {
    try {
      await api.delete(`/wishlist/${gigId}`);
      setItems((prev) => prev.filter((item) => item.gig?._id !== gigId));
      toast.success('Removed from saved wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Loader type="skeleton-card" count={3} />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Saved Services
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bookmarks for your favorite freelance services and potential orders
          </p>
        </div>
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          icon={FaHeart}
          title="Your Wishlist is Empty"
          description="Browse gigs and click the heart icon on any service card to save it here for quick access later."
          actionText="Explore Gigs"
          actionLink="/"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            if (!item.gig) return null;
            return (
              <GigCard
                key={item._id}
                gig={item.gig}
                isFavorite={true}
                onFavoriteToggle={() => removeFromWishlist(item.gig._id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;