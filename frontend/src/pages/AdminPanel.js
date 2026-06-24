import React, { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  const fetchGigs = async () => {
    try {
      const res = await api.get('/admin/gigs');
      setGigs(res.data.gigs);
    } catch (err) {
      toast.error('Failed to load gigs');
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

  const banUser = async (userId, reason) => {
    try {
      await api.put(`/admin/users/${userId}/ban`, { reason });
      toast.success('User banned');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to ban');
    }
  };

  const disableGig = async (gigId, reason) => {
    try {
      await api.put(`/admin/gigs/${gigId}/disable`, { reason });
      toast.success('Gig disabled');
      fetchGigs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disable');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'gigs' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          onClick={() => setActiveTab('gigs')}
        >
          Gigs
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">{user.isActive ? 'Active' : 'Banned'}</td>
                      <td className="px-6 py-4">
                        {user.isActive && user.role !== 'admin' && (
                          <button
                            onClick={() => banUser(user._id, prompt('Reason for ban:'))}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'gigs' && (
            <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {gigs.map(gig => (
                    <tr key={gig._id}>
                      <td className="px-6 py-4">{gig.title}</td>
                      <td className="px-6 py-4">{gig.seller?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">${gig.price}</td>
                      <td className="px-6 py-4">{gig.isActive ? 'Active' : 'Disabled'}</td>
                      <td className="px-6 py-4">
                        {gig.isActive && (
                          <button
                            onClick={() => disableGig(gig._id, prompt('Reason for disabling:'))}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                          >
                            Disable
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;