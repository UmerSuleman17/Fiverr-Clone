import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-lg">
                F
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                fiverr<span className="text-emerald-400">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier freelance marketplace connecting businesses with world-class digital specialists in design, development, AI, and marketing.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <FaTwitter />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Marketplace Col */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/?category=Programming%20%26%20Tech" className="hover:text-emerald-400 transition-colors">Programming & Tech</Link></li>
              <li><Link to="/?category=Graphics%20%26%20Design" className="hover:text-emerald-400 transition-colors">Graphics & Design</Link></li>
              <li><Link to="/?category=Digital%20Marketing" className="hover:text-emerald-400 transition-colors">Digital Marketing</Link></li>
              <li><Link to="/?category=Video%20%26%20Animation" className="hover:text-emerald-400 transition-colors">Video & Animation</Link></li>
              <li><Link to="/?category=AI%20Services" className="hover:text-emerald-400 transition-colors">AI Services</Link></li>
            </ul>
          </div>

          {/* Company Col */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">Help & FAQ</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Become a Freelancer</Link></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">Security & Escrow</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Trust Center</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            © {currentYear} Fiverr Clone Inc. All rights reserved. Built for modern digital teams.
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5"><FaGlobe className="text-emerald-500" /> English (US)</span>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;