import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { 
  FaDollarSign, 
  FaShoppingBag, 
  FaClock, 
  FaCheckCircle, 
  FaPlusCircle, 
  FaCommentAlt, 
  FaChartLine,
  FaArrowRight 
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/orders?limit=100');
        const orders = res.data.orders || [];
        const userId = user.id || user._id;
        const sellerOrders = orders.filter(o => (o.seller?._id === userId || o.seller?.id === userId));
        
        const totalRevenue = sellerOrders.reduce((sum, o) => sum + (o.status === 'completed' ? o.price : 0), 0);
        const totalOrders = sellerOrders.length;
        const pendingOrders = sellerOrders.filter(o => o.status === 'pending' || o.status === 'paid' || o.status === 'in-progress').length;
        const completedOrders = sellerOrders.filter(o => o.status === 'completed').length;
        
        setStats({ totalRevenue, totalOrders, pendingOrders, completedOrders });
        setRecentOrders(sellerOrders.slice(0, 8));
      } catch (err) {
        console.error('Fetch dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Seller Hub
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overview of your performance, revenue, and active orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/create-gig" className="btn-primary py-2.5 text-xs font-bold shadow-md">
            <FaPlusCircle /> Create New Gig
          </Link>
          <Link to="/chat" className="btn-secondary py-2.5 text-xs font-bold">
            <FaCommentAlt /> Messages
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              <FaDollarSign />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Cleared Escrow Earnings</span>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
              <FaShoppingBag />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalOrders}</div>
          <span className="text-[11px] text-slate-400 font-semibold">All Time Volume</span>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Pending</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
              <FaClock />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.pendingOrders}</div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Awaiting Delivery</span>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg">
              <FaCheckCircle />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{stats.completedOrders}</div>
          <span className="text-[11px] text-slate-400 font-semibold">Successful Deliveries</span>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Seller Orders</h2>
          <Link to="/orders" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            View All Orders <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            icon={FaShoppingBag}
            title="No Orders Received Yet"
            description="Create or promote your gigs to start receiving orders from global buyers."
            actionText="Create a New Gig"
            actionLink="/create-gig"
          />
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="card p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-500/30 transition-all">
                <div className="space-y-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{order.gig?.title || 'Order Service'}</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Buyer: <strong className="text-slate-700 dark:text-slate-300">{order.buyer?.name}</strong> • Created: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">${order.price}</span>
                  <Badge type={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;