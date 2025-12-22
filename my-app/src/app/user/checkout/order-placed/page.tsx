"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    ArrowRight,
    Package,
    Calendar,
    MapPin
} from "lucide-react";

export default function OrderSuccessPage() {
    // Mock Order Data
    const orderId = "#ORD-7829-XJ";
    const estimatedDelivery = "Tomorrow, 10:00 AM - 2:00 PM";

    // Confetti-like state for decoration
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">

            {/* --- Animated Background Blobs (Decoration) --- */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none"
            />

            {/* --- Main Card --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-blue-200/50 overflow-hidden border border-white/50"
            >

                {/* Top Decorative Bar */}
                <div className="h-2 w-full bg-linear-to-r from-blue-400 via-blue-600 to-blue-400" />

                <div className="p-8 md:p-12 text-center">

                    {/* --- Animated Checkmark Icon --- */}
                    <div className="flex justify-center mb-8 relative">
                        {/* Pulsing Rings */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ delay: 0.2, duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 bg-blue-100 rounded-full z-0"
                        />
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 0 }}
                            transition={{ delay: 0.4, duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 bg-blue-50 rounded-full z-0"
                        />

                        {/* Main Circle */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                            className="w-24 h-24 bg-linear-to-tr from-blue-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-300 z-10 relative"
                        >
                            <svg
                                className="w-12 h-12 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                                    d="M20 6L9 17l-5-5"
                                />
                            </svg>
                        </motion.div>
                    </div>

                    {/* --- Text Content --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">
                            Order Confirmed!
                        </h1>
                        <p className="text-slate-500 text-lg mb-8">
                            Hurray! Your order has been placed successfully.
                        </p>
                    </motion.div>

                    {/* --- Order Details Card --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                            <span className="text-slate-500 text-sm font-medium">Order ID</span>
                            <span className="text-slate-800 font-bold font-mono">{orderId}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimated Delivery</p>
                                    <p className="text-slate-800 font-semibold">{estimatedDelivery}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Delivery Address</p>
                                    <p className="text-slate-800 font-medium text-sm line-clamp-1">
                                        Jhansi, Uttar Pradesh, 284003...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Action Buttons --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col gap-3"
                    >
                        {/* Primary Button */}
                        <Link href="/user/my-orders" className="w-full">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                Track My Order
                                <Package className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>

                        {/* Secondary Button */}
                        <Link href="/" className="w-full">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-white text-slate-600 font-bold py-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center cursor-pointer gap-2"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                                Continue Shopping
                            </motion.button>
                        </Link>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
}