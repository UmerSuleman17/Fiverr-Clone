import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

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
      setOrders(res.data.orders);
      setPages(res.data.pages);
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
      toast.success('Order marked as completed');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-200 text-yellow-800',
      paid: 'bg-blue-200 text-blue-800',
      'in-progress': 'bg-purple-200 text-purple-800',
      delivered: 'bg-indigo-200 text-indigo-800',
      completed: 'bg-green-200 text-green-800',
      cancelled: 'bg-red-200 text-red-800',
    };
    return <span className={`px-2 py-1 rounded text-sm ${colors[status] || 'bg-gray-200'}`}>{status}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h3 className="font-bold">{order.gig?.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Buyer: {order.buyer?.name} | Seller: {order.seller?.name}
                    </p>
                    <p className="text-sm">Price: ${order.price}</p>
                    <p className="text-sm">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    {user?.role === 'seller' && order.status === 'paid' && (
                      <button
                        onClick={() => handleComplete(order._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {user?.role === 'buyer' && order.status === 'delivered' && (
                      <button
                        onClick={() => handleComplete(order._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Accept & Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;