import React, { useState } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = ['All', 'General', 'Buyers', 'Sellers', 'Payments', 'Security'];

  const faqs = [
    {
      category: 'General',
      question: 'How does the Fiverr Clone marketplace work?',
      answer: 'Buyers browse and search for freelance services (gigs) offered by skilled sellers. Once an order is placed, funds are held securely in escrow until the seller delivers the work and the buyer approves it.',
    },
    {
      category: 'Buyers',
      question: 'How do I place an order for a gig?',
      answer: 'Browse gigs by category or use search. Click on any gig to inspect package details, ratings, and reviews. Click "Order Now" to initiate a checkout session and complete your payment securely.',
    },
    {
      category: 'Buyers',
      question: 'What if I am not satisfied with the delivered work?',
      answer: 'You can request revisions directly from the seller before marking the order as completed. If issues persist, our support team can review the delivery to assist with refunds or resolution.',
    },
    {
      category: 'Sellers',
      question: 'How do I become a seller and create a gig?',
      answer: 'Register an account and select "Seller" as your role. Go to your Dashboard or click "Create Gig" in the header to post your service with title, pricing, description, and images.',
    },
    {
      category: 'Sellers',
      question: 'When and how do I get paid for completed work?',
      answer: 'When a buyer marks your delivered order as complete, earnings are credited to your account and automatically paid out to your connected Stripe account.',
    },
    {
      category: 'Payments',
      question: 'Which payment methods are supported?',
      answer: 'We support all major credit cards, debit cards, and Stripe payments. All transactions are encrypted with enterprise-grade SSL protection.',
    },
    {
      category: 'Payments',
      question: 'Are there any platform service fees?',
      answer: 'Sellers pay a standard 10% platform fee on completed orders to cover payment processing, hosting, and 24/7 customer support.',
    },
    {
      category: 'Security',
      question: 'Is my personal and payment data safe?',
      answer: 'Yes. We use JWT authentication, encrypted passwords, HTTPS connections, and PCI-compliant Stripe tokenization for all transaction processing.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Knowledge Base
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Find answers to common questions about hiring, selling, order status, payments, and account security.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
        <input
          type="text"
          className="input-field pl-11 py-3 text-sm shadow-soft-sm"
          placeholder="Search questions or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center p-8 card text-slate-500 dark:text-slate-400">
            No matching questions found for "{search}". Try searching for another term.
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="card transition-all duration-200">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white"
                >
                  <span className="flex items-center gap-3 text-base">
                    <FaQuestionCircle className="text-emerald-500 shrink-0 text-sm" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <FaChevronUp className="text-emerald-500 shrink-0 text-xs" />
                  ) : (
                    <FaChevronDown className="text-slate-400 shrink-0 text-xs" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FAQ;
