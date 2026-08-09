import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FaShoppingBag, FaUserCheck, FaCalendarAlt, FaCheck, FaTruck } from 'react-icons/fa';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?page=${page}&limit=10`);
      setOrders(res.data.orders || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleComplete = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/complete`);
      toast.success('Order status updated!');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track and manage your client orders and deliverables
          </p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <EmptyState
          icon={FaShoppingBag}
          title="No Orders Yet"
          description="You haven't placed or received any orders. Explore available gigs to get started."
          actionText="Browse Marketplace"
          actionLink="/"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isSeller = user?.role === 'seller' && (order.seller?._id === user.id || order.seller?.id === user.id);
            const isBuyer = order.buyer?._id === user.id || order.buyer?.id === user.id;

            return (
              <div key={order._id} className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Left Order Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge type={order.status} />
                    <span className="text-[11px] text-slate-400 font-mono">ID: {order._id}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {order.gig?.title || 'Custom Service Order'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <FaUserCheck className="text-emerald-500" />
                      Buyer: <strong className="text-slate-700 dark:text-slate-300">{order.buyer?.name || 'Client'}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      Seller: <strong className="text-slate-700 dark:text-slate-300">{order.seller?.name || 'Freelancer'}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <FaCalendarAlt />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right Price & Actions */}
                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${order.price}</span>
                  </div>

                  {/* Actions based on role and order state */}
                  {user?.role === 'seller' && (order.status === 'paid' || order.status === 'pending') && (
                    <button
                      onClick={() => handleComplete(order._id)}
                      className="btn-primary py-2 text-xs font-bold"
                    >
                      <FaTruck /> Mark as Delivered
                    </button>
                  )}

                  {isBuyer && order.status === 'delivered' && (
                    <button
                      onClick={() => handleComplete(order._id)}
                      className="btn-primary py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700"
                    >
                      <FaCheck /> Accept & Complete
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                p === page
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;