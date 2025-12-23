"use client";

import Link from "next/link";
import { ArrowLeft, Search, Loader2, PackageX } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { IOrder } from "@/models/order.model";
import AdminOrderCard from "@/components/AdminOrderCard";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // --- Fetch Orders ---
    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const res = await axios.get(`/api/admin/get-all-orders`);
                console.log(res.data);
                setOrders(res.data);
                setFilteredOrders(res.data);
            } catch (error) {
                console.error("Error fetching admin orders", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, []);

    // --- Search Logic ---
    useEffect(() => {
        if (!searchQuery) {
            setFilteredOrders(orders);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = orders.filter(order =>
                order._id?.toString().toLowerCase().includes(query) ||
                order.paymentMethod.toLowerCase().includes(query) ||
                order.status.toLowerCase().includes(query)
            );
            setFilteredOrders(filtered);
        }
    }, [searchQuery, orders]);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">

            {/* --- Sticky Header --- */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-white/60">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Manage Orders</h1>
                        </div>
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            {orders.length} Total
                        </div>
                    </div>

                    {/* --- Search Bar --- */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-200 rounded-xl text-sm font-medium outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* --- Page Content --- */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">

                {loading ? (
                    // Loading State
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium animate-pulse">Loading orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    // Order List
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {filteredOrders.map((order, index) => (
                            <AdminOrderCard key={order._id?.toString() || index} order={order} index={index} />
                        ))}

                        <div className="text-center mt-10 mb-6">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">End of list</p>
                        </div>
                    </motion.div>
                ) : (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="bg-slate-100 p-6 rounded-full mb-6">
                            <PackageX className="w-16 h-16 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders found</h2>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                            {searchQuery ? `No results for "${searchQuery}"` : "There are no orders in the system yet."}
                        </p>
                    </motion.div>
                )}

            </div>
        </div>
    );
}