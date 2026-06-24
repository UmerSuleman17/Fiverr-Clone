import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Review from '../components/Review';
import toast from 'react-hot-toast';

const GigDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        setGig(res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        toast.error('Failed to load gig');
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
      // Redirect to Stripe Checkout
      const { sessionId } = res.data;
      if (sessionId) {
        const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId });
      } else {
        // If using PaymentIntent
        const { clientSecret, orderId } = res.data;
        // Handle with Stripe Elements or redirect to payment page
        // For simplicity, we'll just show success message
        toast.success('Order placed! Please complete payment.');
        navigate(`/orders`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await api.post(`/reviews/${id}`, { rating, comment: reviewText });
      toast.success('Review added!');
      // Refresh reviews
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
      setReviewText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!gig) return <div className="text-center py-10">Gig not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold">{gig.title}</h1>
        <div className="flex items-center gap-4 my-2">
          <span className="text-yellow-500">⭐ {gig.avgRating.toFixed(1)}</span>
          <span>({gig.totalReviews} reviews)</span>
          <span className="text-gray-600 dark:text-gray-400">by {gig.seller?.name}</span>
        </div>
        <div className="flex flex-wrap gap-2 my-4">
          {gig.images?.map((img, i) => (
            <img key={i} src={img} alt={`gig-${i}`} className="w-32 h-32 object-cover rounded" />
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300 my-4">{gig.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">${gig.price}</span>
          <button
            onClick={handleOrder}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {user && user.role === 'buyer' && (
          <form onSubmit={handleReviewSubmit} className="mb-6">
            <div className="flex items-center gap-4">
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="p-2 border rounded dark:bg-gray-700">
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
              </select>
              <input
                type="text"
                placeholder="Write a review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="flex-1 p-2 border rounded dark:bg-gray-700"
                required
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Submit
              </button>
            </div>
          </form>
        )}
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map(review => <Review key={review._id} review={review} />)
        )}
      </div>
    </div>
  );
};

export default GigDetail;