"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import OrderCard from "@/components/OrderCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { IOrder } from "@/models/order.model";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const res = await axios.get(`/api/user/my-orders`)
                setOrders(res.data)
                setLoading(false)
            } catch (error) {
                console.log("Error in fetching all orders");
            }
        }
        fetchAllOrders()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">

            {/* --- Sticky Header --- */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md  supports-backdrop-filter:bg-white/60">
                <div className="max-w-3xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">My Orders</h1>
                </div>
            </div>

            {/* --- Page Content --- */}
            <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">

                {loading ? (
                    // Loading State
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Fetching your orders...</p>
                    </div>
                ) : orders.length > 0 ? (
                    // Order List
                    <div>
                        {orders.map((order, index) => (
                            <OrderCard key={index} order={order} index={index} />
                        ))}

                        <div className="text-center mt-10 mb-6">
                            <p className="text-slate-400 text-sm font-medium">Showing all recent orders</p>
                        </div>
                    </div>
                ) : (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="bg-blue-50 p-6 rounded-full mb-6">
                            <ShoppingBag className="w-16 h-16 text-blue-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders yet</h2>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                            It looks like you haven't placed any orders yet. Start shopping to fill your pantry!
                        </p>
                        <Link href="/">
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                                Start Shopping
                            </button>
                        </Link>
                    </motion.div>
                )}

            </div>
        </div>
    );
}