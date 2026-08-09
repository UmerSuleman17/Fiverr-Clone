import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEnvelope, FaHeadphones, FaHandshake, FaQuestionCircle, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Simulate frontend form submission / feedback
    setTimeout(() => {
      setLoading(false);
      toast.success('Thank you! Your message has been sent to our support team.');
      setFormData({ name: '', email: '', subject: '', category: 'General', message: '' });
    }, 1000);
  };

  const contactChannels = [
    { icon: FaHeadphones, title: 'Customer Support', desc: 'Get help with your orders or account', contact: 'support@fiverrclone.dev' },
    { icon: FaHandshake, title: 'Business & Sales', desc: 'Enterprise hiring & strategic partners', contact: 'sales@fiverrclone.dev' },
    { icon: FaQuestionCircle, title: 'Help Center & FAQ', desc: 'Instant answers to common questions', contact: 'Visit FAQ Section' },
  ];

  return (
    <div className="space-y-12 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Get In Touch
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How Can We Help You?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Have a question about an order, payment, or freelancing on our platform? Send us a message and our support team will respond within 24 hours.
        </p>
      </div>

      {/* Support Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactChannels.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="card p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-xl">
                <Icon />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{c.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{c.desc}</p>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block pt-1">{c.contact}</span>
            </div>
          );
        })}
      </div>

      {/* Main Contact Form */}
      <div className="card p-8 md:p-10 max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FaEnvelope className="text-emerald-600 dark:text-emerald-400" /> Send Us a Message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="General">General Inquiry</option>
                <option value="Orders">Order & Payment Support</option>
                <option value="Seller">Seller Verification</option>
                <option value="Bug">Report a Technical Bug</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Brief summary of inquiry"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              className="input-field resize-none"
              placeholder="Provide details about your question or issue..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto px-8"
          >
            {loading ? 'Sending Message...' : (
              <>
                <FaPaperPlane className="text-sm" /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
