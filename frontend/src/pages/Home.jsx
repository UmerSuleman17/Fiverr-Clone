import React, { useState, useEffect } from 'react';
import api from '../api/api';
import GigCard from '../components/GigCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaRedo, 
  FaCode, 
  FaPaintBrush, 
  FaBullhorn, 
  FaVideo, 
  FaPenNib, 
  FaRobot,
  FaShieldAlt,
  FaCheckCircle,
  FaRocket,
  FaStar
} from 'react-icons/fa';

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const categories = [
    { name: 'Programming & Tech', icon: FaCode, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { name: 'Graphics & Design', icon: FaPaintBrush, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { name: 'Digital Marketing', icon: FaBullhorn, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { name: 'Video & Animation', icon: FaVideo, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    { name: 'Writing & Translation', icon: FaPenNib, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { name: 'AI Services', icon: FaRobot, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  ];

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const cleanFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key]) cleanFilters[key] = filters[key];
      });
      const params = new URLSearchParams(cleanFilters);
      const res = await api.get(`/gigs?${params}`);
      setGigs(res.data.gigs || []);
      setPagination({
        total: res.data.total || 0,
        page: res.data.page || 1,
        pages: res.data.pages || 1,
      });
    } catch (err) {
      console.error('Fetch gigs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Keep internal filters synced if URL changes (e.g. from navbar search)
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchGigs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: '-createdAt',
    });
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Banner (Only when no category/search active) */}
      {!filters.category && !filters.search && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-8 sm:p-12 md:p-16 shadow-soft-lg">
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <FaShieldAlt className="text-emerald-400" /> Trusted Freelance Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Find the Perfect <span className="text-emerald-400">Freelance</span> Services for Your Business
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Work with top talent across web development, brand design, AI automation, and digital marketing with 100% escrow buyer protection.
            </p>

            {/* Quick Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Popular:</span>
              {['Web Development', 'AI Services', 'Graphics & Design'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-600 text-white border border-slate-700 hover:border-emerald-500 transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        </section>
      )}

      {/* Category Grid Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Explore Categories</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Browse services by specialized skill area</p>
          </div>
          {filters.category && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, category: '' }))}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Clear Category Selection
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = filters.category === cat.name;
            return (
              <button
                key={idx}
                onClick={() => setFilters((prev) => ({ ...prev, category: isSelected ? '' : cat.name }))}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-32 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 hover:shadow-soft-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isSelected ? 'bg-white/20 text-white' : cat.color}`}>
                  <Icon />
                </div>
                <span className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <section className="card p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm shrink-0">
            <FaFilter className="text-emerald-500 text-xs" />
            <span>Filter Gigs ({pagination.total})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search gigs..."
                value={filters.search}
                onChange={handleFilterChange}
                className="input-field py-2 text-xs pl-8"
              />
              <FaSearch className="absolute left-2.5 top-3 text-slate-400 text-xs" />
            </div>

            {/* Min Price */}
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price $"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="input-field py-2 text-xs"
            />

            {/* Max Price */}
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price $"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="input-field py-2 text-xs"
            />

            {/* Rating Filter */}
            <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="input-field py-2 text-xs"
            >
              <option value="">Any Rating</option>
              <option value="4">4.0+ Stars</option>
              <option value="3">3.0+ Stars</option>
            </select>

            {/* Sorting */}
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="input-field py-2 text-xs"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.rating) && (
            <button
              onClick={handleResetFilters}
              className="btn-secondary py-2 px-3 text-xs shrink-0"
              title="Reset Filters"
            >
              <FaRedo className="text-xs" /> Reset
            </button>
          )}
        </div>
      </section>

      {/* Main Gig Grid */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {filters.category ? `${filters.category} Services` : 'Available Gigs'}
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            Showing Page {pagination.page} of {pagination.pages || 1}
          </span>
        </div>

        {loading ? (
          <Loader type="skeleton-card" count={6} />
        ) : gigs.length === 0 ? (
          <EmptyState
            icon={FaSearch}
            title="No Gigs Found"
            description="We couldn't find any services matching your search or filters. Try adjusting your price range or category."
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                  p === pagination.page
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="card p-8 md:p-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Simple Workflow</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How It Works</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Getting work done or selling services takes just 4 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            { step: '01', title: 'Find a Service', desc: 'Browse verified gigs or search for custom development and design.' },
            { step: '02', title: 'Place Your Order', desc: 'Specify requirements and pay securely into protected escrow.' },
            { step: '03', title: 'Review Delivery', desc: 'Inspect delivered files and request revisions if needed.' },
            { step: '04', title: 'Approve & Rate', desc: 'Complete order to release funds and leave a review.' },
          ].map((s, idx) => (
            <div key={idx} className="space-y-3 relative z-10">
              <span className="text-4xl font-black text-emerald-500/20 dark:text-emerald-500/30 block">{s.step}</span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;