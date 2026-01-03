"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  ShoppingBag,
  Send,
  Heart
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-linear-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden mt-20 font-sans border-t border-blue-500">

      {/* --- Decorative Background Blobs (White/Light opacity) --- */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-400 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl pointer-events-none opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">

        {/* --- Newsletter Section (Reversed: White Card) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 mb-16 shadow-2xl shadow-blue-900/20 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Subtle pattern overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          <div className="text-center lg:text-left max-w-lg relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center lg:justify-start gap-3">
              <Send className="w-6 h-6 text-blue-600" />
              Join the Zestro Family
            </h3>
            <p className="text-slate-500 text-sm md:text-base font-medium">Get the latest updates, exclusive deals, and grocery tips delivered straight to your inbox.</p>
          </div>

          <div className="w-full max-w-md relative group z-10">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full pl-6 pr-36 py-4 bg-blue-50 border-2 border-blue-100 rounded-full text-slate-800 focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-200 transition-all placeholder:text-slate-400 shadow-inner"
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2">
              Subscribe
            </button>
          </div>
        </motion.div>

        {/* --- Main Links Grid --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-lg">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Zestro</h2>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed font-medium">
              Fresh groceries delivered to your doorstep with love. We ensure quality, speed, and the best prices for your daily needs.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm backdrop-blur-sm">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-300 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['Home', 'Shop', 'About Us', 'Delivery Areas', 'Track Order'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2 group text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white group-hover:w-3 transition-all duration-300"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-300 rounded-full"></span>
              Categories
            </h4>
            <ul className="space-y-3">
              {['Vegetables & Fruits', 'Dairy & Breakfast', 'Munchies', 'Cold Drinks', 'Instant Food'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2 group text-sm font-medium">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white group-hover:w-3 transition-all duration-300"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-300 rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-2 bg-white/10 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors backdrop-blur-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm text-blue-100 leading-relaxed font-medium">123 Market Street, Tech City, Innovation Hub, India 834001</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors backdrop-blur-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm text-blue-100 font-medium">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors backdrop-blur-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm text-blue-100 font-medium">support@zestro.com</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-blue-500/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-200 font-medium flex items-center gap-1">
            © {currentYear} <span className="text-white font-bold">Zestro.</span> Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse" /> in India.
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs font-semibold text-blue-200 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs font-semibold text-blue-200 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs font-semibold text-blue-200 hover:text-white transition-colors">Cookie Policy</Link>
          </div>

          <div className="flex items-center gap-2 opacity-90">
            {/* Payment Icons (White/Glass version) */}
            <div className="h-8 px-3 bg-white/10 rounded border border-white/20 flex items-center justify-center text-white backdrop-blur-sm"><CreditCard className="w-4 h-4" /></div>
            <div className="h-8 px-3 bg-white/10 rounded border border-white/20 flex items-center justify-center text-white text-[10px] font-bold tracking-wider backdrop-blur-sm">VISA</div>
            <div className="h-8 px-3 bg-white/10 rounded border border-white/20 flex items-center justify-center text-white text-[10px] font-bold tracking-wider backdrop-blur-sm">UPI</div>
          </div>
        </div>
      </div>
    </footer>
  );
}