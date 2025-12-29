"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { motion } from "motion/react";
import {
    Package,
    Users,
    ShoppingBag,
    Truck,
    IndianRupee,
    TrendingUp,
} from "lucide-react";

interface AdminDashboardClientProps {
    stats: { title: string; value: number; icon: string }[];
    revenue: { total: number; today: number; sevenDays: number };
    chartData: { name: string; orders: number }[];
}

export default function AdminDashboardClient({ stats, revenue, chartData }: AdminDashboardClientProps) {
    const [revenueFilter, setRevenueFilter] = useState<"total" | "today" | "sevenDays">("total");

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    // Helper to get Icon Component
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "package": return <Package className="w-6 h-6" />;
            case "users": return <Users className="w-6 h-6" />;
            case "shopping-bag": return <ShoppingBag className="w-6 h-6" />;
            case "truck": return <Truck className="w-6 h-6" />;
            default: return <Package className="w-6 h-6" />;
        }
    };

    // Displayed Revenue based on selection
    const currentRevenue = revenue[revenueFilter];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">

            {/* --- Header Section --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 mt-22 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div className="flex items-center flex-col justify-center w-full">
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Overview of your store's performance</p>
                </div>
            </motion.div>

            {/* --- Main Content Grid --- */}
            <div className="space-y-8">

                {/* 1. Revenue Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-100/50 relative overflow-hidden text-center"
                >
                    {/* Decorative Background Blob */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>

                    <div className="flex flex-col items-center">
                        <h2 className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" /> Total Earnings
                        </h2>

                        {/* Big Animated Number */}
                        <motion.div
                            key={revenueFilter} // Re-animate when filter changes
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-6"
                        >
                            {formatCurrency(currentRevenue)}
                        </motion.div>

                        {/* Custom Select Dropdown */}
                        <div className="relative group">
                            <select
                                value={revenueFilter}
                                onChange={(e) => setRevenueFilter(e.target.value as any)}
                                className="appearance-none bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 pl-5 pr-10 rounded-xl cursor-pointer outline-none ring-2 ring-transparent focus:ring-blue-200 transition-all text-sm"
                            >
                                <option value="total">All Time</option>
                                <option value="today">Today</option>
                                <option value="sevenDays">Last 7 Days</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
                                <ChevronDownIcon />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Stats Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    {getIcon(stat.icon)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stat.value}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* 3. Charts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Orders Overview</h3>
                        <span className="text-sm text-slate-400 font-medium ml-2">(Last 7 Days)</span>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#eff6ff', opacity: 0.5 }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        backgroundColor: '#1e293b',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar
                                    dataKey="orders"
                                    radius={[6, 6, 0, 0]}
                                    barSize={50}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#3b82f6" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

// Simple Chevron Icon for the Select Dropdown
function ChevronDownIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}