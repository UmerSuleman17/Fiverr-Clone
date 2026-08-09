import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import Review from '../components/Review';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';
import { 
  FaStar, 
  FaHeart, 
  FaClock, 
  FaSync, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaCommentAlt, 
  FaPaperPlane,
  FaChevronRight,
  FaUserCheck
} from 'react-icons/fa';

const GigDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        setGig(res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        toast.error('Failed to load gig details');
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/orders', { gigId: id });
      const { sessionId, clientSecret, orderId } = res.data;
      
      if (sessionId) {
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId });
      } else {
        toast.success('Order placed successfully! Check your orders list.');
        navigate('/orders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate order');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) return navigate('/login');
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post('/wishlist', { gigId: id });
        setIsWishlisted(true);
        toast.success('Saved to wishlist');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wishlist update failed');
    }
  };

  const handleContactSeller = async () => {
    if (!user) return navigate('/login');
    if (!gig?.seller?._id && !gig?.seller?.id) return;
    const sellerId = gig.seller._id || gig.seller.id;
    try {
      await api.get(`/conversations/create?sellerId=${sellerId}`);
      navigate('/chat');
    } catch (err) {
      toast.error('Could not start conversation');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!reviewText.trim()) return;

    setSubmittingReview(true);
    try {
      await api.post(`/reviews/${id}`, { rating, comment: reviewText });
      toast.success('Thank you for your feedback!');
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
      setReviewText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!gig) return <EmptyState title="Gig Not Found" description="The service you are looking for does not exist or has been removed." actionText="Back to Home" actionLink="/" />;

  const images = (gig.images && gig.images.length > 0) ? gig.images : ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'];
  const sellerAvatar = gig.seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-emerald-600">Home</Link>
        <FaChevronRight className="text-[10px]" />
        <span>{gig.category || 'Gigs'}</span>
        <FaChevronRight className="text-[10px]" />
        <span className="text-slate-900 dark:text-white line-clamp-1">{gig.title}</span>
      </nav>

      {/* Main Grid: Left Details (2 Cols), Right Sidebar (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Title */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {gig.title}
            </h1>

            {/* Seller & Rating Header */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-2.5">
                <img src={sellerAvatar} alt={gig.seller?.name} className="w-8 h-8 rounded-full object-cover border" />
                <span className="font-bold text-slate-900 dark:text-white">{gig.seller?.name || 'Top Rated Seller'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  PRO SELLER
                </span>
              </div>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

              <div className="flex items-center space-x-1.5 font-bold">
                <FaStar className="text-amber-400 text-sm" />
                <span className="text-slate-900 dark:text-white">{gig.avgRating?.toFixed(1) || '5.0'}</span>
                <span className="text-slate-400 font-normal">({gig.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Main Gallery Viewer */}
          <div className="space-y-3">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-md">
              <img
                src={images[selectedImg] || images[0]}
                alt={gig.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImg === i ? 'border-emerald-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="card p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About This Service</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {gig.description}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Commercial Use Rights</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> High-Resolution Files</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Source File Included</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> 24/7 Seller Support</span>
              </div>
            </div>
          </div>

          {/* Seller Info Card */}
          <div className="card p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About The Seller</h2>
            <div className="flex items-start space-x-4">
              <img src={sellerAvatar} alt={gig.seller?.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{gig.seller?.name || 'Professional Specialist'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Digital Specialist & Fullstack Developer</p>
                <div className="flex items-center space-x-1 text-xs text-amber-400 pt-1 font-bold">
                  <FaStar /> <span>5.0 Rating</span>
                </div>
              </div>
            </div>
            
            <button onClick={handleContactSeller} className="btn-secondary w-full sm:w-auto text-xs font-semibold">
              <FaCommentAlt /> Contact Seller
            </button>
          </div>

          {/* Reviews Section */}
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Client Reviews</h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                ★ {gig.avgRating?.toFixed(1) || '5.0'} ({reviews.length} Total)
              </span>
            </div>

            {/* Write Review Form */}
            {user && (
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Leave Your Review</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Rating:</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="input-field py-1 text-xs w-28"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                    <option value={3}>⭐⭐⭐ (3)</option>
                    <option value={2}>⭐⭐ (2)</option>
                    <option value={1}>⭐ (1)</option>
                  </select>
                </div>

                <textarea
                  rows={3}
                  className="input-field text-xs resize-none"
                  placeholder="Share your experience working with this seller..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />

                <button type="submit" disabled={submittingReview} className="btn-primary py-2 text-xs">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Review Cards List */}
            <div className="space-y-4 pt-2">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No reviews submitted yet for this gig.</p>
              ) : (
                reviews.map((rev) => <Review key={rev._id} review={rev} />)
              )}
            </div>
          </div>

        </div>

        {/* Right Sticky Sidebar */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="card p-6 md:p-8 space-y-6 border-2 border-emerald-500/30 shadow-soft-lg">
            
            <div className="flex justify-between items-baseline border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Standard Package</span>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">${gig.price}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Complete professional service package including source files, revisions, and full commercial usage rights.
            </p>

            <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <FaClock className="text-emerald-500" /> <span>3 Days Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <FaSync className="text-emerald-500" /> <span>2 Revisions Included</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-emerald-500" /> <span>100% Escrow Protection</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleOrder}
                className="btn-primary w-full py-3 text-sm font-bold shadow-md hover:shadow-lg"
              >
                Continue to Order (${gig.price})
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isWishlisted
                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <FaHeart className={isWishlisted ? 'text-rose-500' : 'text-slate-400'} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GigDetail;