import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import { FaEdit, FaCloudUploadAlt, FaTag, FaLayerGroup, FaArrowLeft } from 'react-icons/fa';

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Programming & Tech', price: '' });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const categories = [
    'Programming & Tech',
    'Graphics & Design',
    'Digital Marketing',
    'Video & Animation',
    'Writing & Translation',
    'AI Services',
  ];

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        const { title, description, category, price } = res.data;
        setFormData({ title, description, category: category || 'Programming & Tech', price });
      } catch (err) {
        toast.error('Failed to load gig for editing');
      } finally {
        setFetching(false);
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
      toast.success('Gig updated successfully!');
      navigate(`/gig/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update gig');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <button onClick={() => navigate(-1)} className="text-xs font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1.5 mb-2">
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Edit Service Gig
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update your pricing, category, description, or media files
          </p>
        </div>
      </div>

      {/* Main Card Form */}
      <div className="card p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Overview */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <FaLayerGroup /> 1. Gig Overview
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Gig Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Price ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 text-xs font-bold">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field pl-8"
                    min="5"
                    step="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <FaTag /> 2. Description
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Service Description
              </label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="input-field resize-none text-xs leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section 3: Media Upload */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <FaCloudUploadAlt /> 3. Update Gallery Images (Optional)
            </h3>

            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
              <FaCloudUploadAlt className="text-3xl text-emerald-500 mx-auto" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-600 hover:file:bg-emerald-500/20"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs px-6"
            >
              {loading ? 'Updating...' : <><FaEdit /> Update Gig</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditGig;