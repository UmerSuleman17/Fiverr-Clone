import React, { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { FaShieldAlt, FaUsers, FaLayerGroup, FaBan, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error('Failed to load user records');
    }
  };

  const fetchGigs = async () => {
    try {
      const res = await api.get('/admin/gigs');
      setGigs(res.data.gigs || []);
    } catch (err) {
      toast.error('Failed to load gig records');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchGigs()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const banUser = async (userId) => {
    const reason = window.prompt('Reason for account ban:');
    if (!reason) return;
    try {
      await api.put(`/admin/users/${userId}/ban`, { reason });
      toast.success('User account banned');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to ban user');
    }
  };

  const disableGig = async (gigId) => {
    const reason = window.prompt('Reason for disabling gig:');
    if (!reason) return;
    try {
      await api.put(`/admin/gigs/${gigId}/disable`, { reason });
      toast.success('Gig disabled successfully');
      fetchGigs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disable gig');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl">
          <FaShieldAlt />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin Moderation Panel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Platform governance, user account management, and gig moderation
          </p>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
            <FaUsers className="text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{users.length}</div>
        </div>

        <div className="card p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Marketplace Gigs</span>
            <FaLayerGroup className="text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{gigs.length}</div>
        </div>

        <div className="card p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Status</span>
            <FaCheckCircle className="text-purple-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">Active & Secure</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <FaUsers /> User Accounts ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('gigs')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'gigs'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <FaLayerGroup /> Gig Services ({gigs.length})
        </button>
      </div>

      {/* Users Table Tab */}
      {activeTab === 'users' && (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4"><Badge type={u.role} /></td>
                  <td className="px-6 py-4">
                    {u.isActive ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">Banned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.isActive && u.role !== 'admin' && (
                      <button
                        onClick={() => banUser(u._id)}
                        className="btn-danger py-1.5 px-3 text-xs"
                      >
                        <FaBan className="text-xs" /> Ban User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gigs Table Tab */}
      {activeTab === 'gigs' && (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Gig Title</th>
                <th className="px-6 py-4">Seller</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {gigs.map((g) => (
                <tr key={g._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xs">{g.title}</td>
                  <td className="px-6 py-4 text-slate-500">{g.seller?.name || 'Unknown Seller'}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">${g.price}</td>
                  <td className="px-6 py-4">
                    {g.isActive ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">Disabled</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {g.isActive && (
                      <button
                        onClick={() => disableGig(g._id)}
                        className="btn-outline py-1.5 px-3 text-xs text-amber-600 hover:bg-amber-50"
                      >
                        <FaExclamationTriangle className="text-xs" /> Disable Gig
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;