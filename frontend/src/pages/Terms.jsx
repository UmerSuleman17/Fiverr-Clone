import React from 'react';

const Terms = () => {
  const sections = [
    { id: 'intro', title: '1. Introduction' },
    { id: 'account', title: '2. User Accounts & Verification' },
    { id: 'buyer-seller', title: '3. Buyer & Seller Responsibilities' },
    { id: 'orders-payments', title: '4. Orders & Escrow Payments' },
    { id: 'reviews-ratings', title: '5. Reviews & Platform Standards' },
    { id: 'prohibited', title: '6. Prohibited Activities' },
    { id: 'liability', title: '7. Limitation of Liability' },
    { id: 'contact', title: '8. Contact Information' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Legal Agreement
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Last updated: August 9, 2026 • Effective immediately
        </p>
      </div>

      {/* Main Content */}
      <div className="card p-8 md:p-12 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section id="intro" className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Introduction</h2>
          <p>
            Welcome to Fiverr Clone. By accessing or using our freelance marketplace platform, you agree to be bound by these Terms & Conditions. If you do not agree to all terms, you may not access or use our services.
          </p>
        </section>

        <section id="account" className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. User Accounts & Verification</h2>
          <p>
            Users must register an account as a Buyer, Seller, or both. You are responsible for maintaining the security of your password and credentials. You agree to provide accurate, current, and complete registration info at all times.
          </p>
        </section>

        <section id="buyer-seller" className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Buyer & Seller Responsibilities</h2>
          <p>
            <strong>Sellers:</strong> Sellers agree to deliver original, high-quality services matching gig descriptions within specified delivery timelines.
          </p>
          <p>
            <strong>Buyers:</strong> Buyers agree to provide clear specifications and pay agreed amounts upon placing orders.
          </p>
        </section>

        <section id="orders-payments" className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Orders & Escrow Payments</h2>
          <p>
            All order payments are processed securely via Stripe. Funds are held in escrow until the seller completes delivery and the buyer accepts the order. Platform service fees are deducted upon order completion.
          </p>
        </section>

        <section id="reviews-ratings" className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Reviews & Platform Standards</h2>
          <p>
            Reviews must reflect genuine experiences. Fraudulent or manipulative reviews, threats, or harassment will result in account suspension.
          </p>
        </section>

        <section id="prohibited" className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Prohibited Activities</h2>
          <p>
            Users may not exchange external payment details to bypass platform fees, upload malicious code, engage in spamming, or infringe intellectual property rights.
          </p>
        </section>

        <section id="liability" className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. Limitation of Liability</h2>
          <p>
            The platform is provided "as is". We are not liable for direct, indirect, or consequential damages resulting from user interactions or service interruptions.
          </p>
        </section>

        <section id="contact" className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. Contact Information</h2>
          <p>
            If you have questions regarding these terms, please contact legal@fiverrclone.dev or visit our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
