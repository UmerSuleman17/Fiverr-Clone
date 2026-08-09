import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaShieldAlt, FaUsers, FaAward, FaCheckCircle, FaGlobe, FaHandshake } from 'react-icons/fa';

const About = () => {
  const stats = [
    { number: '100K+', label: 'Gigs Completed', icon: FaRocket },
    { number: '50K+', label: 'Verified Sellers', icon: FaUsers },
    { number: '99.8%', label: 'Satisfaction Rate', icon: FaAward },
    { number: '120+', label: 'Countries Served', icon: FaGlobe },
  ];

  const values = [
    {
      icon: FaShieldAlt,
      title: 'Trust & Protection',
      description: 'Your payments are protected in escrow until you approve the delivered work. No risk, full guarantee.',
    },
    {
      icon: FaHandshake,
      title: 'Global Collaboration',
      description: 'Connect with top freelance talent across programming, design, writing, marketing, and AI services worldwide.',
    },
    {
      icon: FaCheckCircle,
      title: 'Quality Standards',
      description: 'We continuously vet freelancers and monitor order ratings to ensure consistent high-quality execution.',
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-8 md:p-16 shadow-soft-lg">
        <div className="max-w-3xl space-y-6 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block">
            About Our Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Empowering Freelancers & Businesses Worldwide
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            We build the bridge between visionary entrepreneurs and top-tier digital specialists. Whether you need a fullstack web application, brand design, or AI automation, our marketplace makes hiring fast, secure, and seamless.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link to="/" className="btn-primary">
              Explore Services
            </Link>
            <Link to="/register" className="btn-outline text-white border-slate-700 hover:bg-slate-800">
              Become a Seller
            </Link>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Stats Counter */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card p-6 text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-xl mb-3">
                <Icon />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{stat.number}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
            </div>
          );
        })}
      </section>

      {/* Mission & Values */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Core Values</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Built on transparency, speed, and uncompromising quality standards.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="card p-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
                  <Icon />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="card p-8 md:p-12 text-center bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-none shadow-soft-lg space-y-6">
        <h2 className="text-3xl font-extrabold">Ready to start your next project?</h2>
        <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Join thousands of satisfied clients and skilled freelancers making great work happen every day.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link to="/" className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold px-6 py-3 rounded-xl shadow transition-all">
            Find Gigs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
