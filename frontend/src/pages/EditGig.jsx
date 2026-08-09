import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', category: '', price: '' });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        const { title, description, category, price } = res.data;
        setFormData({ title, description, category, price });
      } catch (err) {
        toast.error('Failed to load gig');
      }
    };
    fetchGig();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    for (let i = 0; i < images.length; i++) {
      data.append('images', images[i]);
    }

    try {
      await api.put(`/gigs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Gig updated!');
      navigate(`/gig/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Gig</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            rows="5"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">New Images (optional)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Gig'}
        </button>
      </form>
    </div>
  );
};

export default EditGig;