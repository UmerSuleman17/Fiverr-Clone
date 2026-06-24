import React, { useState, useEffect } from 'react';
import api from '../api/api';
import GigCard from '../components/GigCard';
import { useSearchParams } from 'react-router-dom';

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
    sort: searchParams.get('sort') || '',
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/gigs?${params}`);
      setGigs(res.data.gigs);
      setPagination({ total: res.data.total, page: res.data.page, pages: res.data.pages });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
    // Update URL
    const params = new URLSearchParams(filters);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search gigs..."
          value={filters.search}
          onChange={handleFilterChange}
          className="p-2 border rounded dark:bg-gray-700"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border rounded dark:bg-gray-700"
        />
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-1/2 p-2 border rounded dark:bg-gray-700"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-1/2 p-2 border rounded dark:bg-gray-700"
          />
        </div>
        <select name="rating" value={filters.rating} onChange={handleFilterChange} className="p-2 border rounded dark:bg-gray-700">
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
        <select name="sort" value={filters.sort} onChange={handleFilterChange} className="p-2 border rounded dark:bg-gray-700">
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="-createdAt">Newest</option>
        </select>
      </div>

      {/* Gig List */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map(gig => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
          {gigs.length === 0 && <p className="text-center py-10">No gigs found.</p>}
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1 border rounded ${p === pagination.page ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700'}`}
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

export default Home;