import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Data Governance
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Last updated: August 9, 2026 • Your data protection rights
        </p>
      </div>

      {/* Main Document */}
      <div className="card p-8 md:p-12 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            We collect information you provide directly, including your name, email address, password hash, avatar image, bio, and role preferences. Payment details are processed directly by Stripe and are never stored on our servers.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p>
            Your information is used to facilitate order processing, enable real-time buyer-seller chat messaging, process payouts, send transactional notifications, and ensure platform security.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Cookies & Analytics</h2>
          <p>
            We use local storage and essential session tokens to persist your authentication state and dark mode preference. No third-party tracking cookies are sold to advertisers.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Data Sharing & Escrow</h2>
          <p>
            Public profile information (name, avatar, seller ratings) is visible to other platform users. Transaction data is shared strictly with payment processors (Stripe) to execute destination payouts.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Your Data Rights</h2>
          <p>
            You have the right to access, update, or request deletion of your personal account data at any time via your Profile Settings or by contacting support@fiverrclone.dev.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
