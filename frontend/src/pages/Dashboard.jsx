import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For simplicity, we'll fetch orders and compute stats
        const res = await api.get('/orders?limit=100');
        const orders = res.data.orders;
        const sellerOrders = orders.filter(o => o.seller?._id === user.id);
        const totalRevenue = sellerOrders.reduce((sum, o) => sum + (o.status === 'completed' ? o.price : 0), 0);
        const totalOrders = sellerOrders.length;
        const pendingOrders = sellerOrders.filter(o => o.status === 'pending' || o.status === 'paid').length;
        setStats({ totalRevenue, totalOrders, pendingOrders });
        setRecentOrders(sellerOrders.slice(0, 10));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Seller Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <h3 className="text-gray-600 dark:text-gray-400">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <h3 className="text-gray-600 dark:text-gray-400">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <h3 className="text-gray-600 dark:text-gray-400">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
      {recentOrders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-2">
          {recentOrders.map(order => (
            <div key={order._id} className="bg-white dark:bg-gray-800 p-3 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{order.gig?.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Buyer: {order.buyer?.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.price}</p>
                <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;