"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Package,
    ChevronDown,
    ChevronUp,
    MapPin,
    CreditCard,
    Calendar,
    HandCoins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IOrder } from "@/models/order.model";
import { initSocket } from "@/lib/socket.io";

interface OrderCardProps {
    order: IOrder;
    index: number;
}

export default function OrderCard({ order, index }: OrderCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<string>(order.status)
    // Helper: Status Badge Colors 
    const statusColors = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "out of delivery":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "delivered":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    }

    const paymentColors = {
        Paid: "bg-green-50 text-green-600 border-green-100",
        Unpaid: "bg-red-50 text-red-600 border-red-100",
    };

    useEffect(() => {
        const socket = initSocket();
        socket.on("update-order-status", (data) => {
            console.log(data.orderId.toString(), order?._id?.toString())
            if (data.orderId.toString() === order?._id?.toString()) {
                setStatus(data.status.toLowerCase())
            }
        })
        return () => {
            socket.off("update-order-status")
        }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden mb-6"
        >
            {/* --- Card Header --- */}
            <div className="p-5 md:p-6 border-b border-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Order ID & Date */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg md:text-xl font-extrabold text-blue-600 tracking-tight">
                                <span className="text-slate-800">Order</span> #{order?._id?.toString()?.slice(0, 15)}
                            </h3>
                            {/* Mobile Status Badge */}
                            <span className={`md:hidden px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${paymentColors[order.isPaid ? "Paid" : "Unpaid"]}`}>
                                {order.isPaid ? "Paid" : "Unpaid"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs md:text-sm font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt!).toLocaleString()}
                        </div>
                    </div>

                    {/* Desktop Status Badges */}
                    <div className="hidden md:flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${paymentColors[order.isPaid ? "Paid" : "Unpaid"]}`}>
                            {order.isPaid ? "Paid" : "Unpaid"}
                        </span>
                    </div>
                </div>
            </div>

            {/* --- Card Body --- */}
            <div className="p-5 md:p-6">

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Payment Method */}
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-full">
                            {order.paymentMethod == "cod" ? <HandCoins className="w-4 h-4 text-blue-600" /> : <CreditCard className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-0.5">Payment</p>
                            <p className="text-slate-700 font-medium text-sm">{order.paymentMethod == "cod" ? "Cash On Delivery" : "Online"}</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-full">
                            <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-0.5">Delivery To</p>
                            <p className="text-slate-700 font-medium text-sm">{order.address.fullAddress}</p>
                        </div>
                    </div>
                </div>

                {/* --- Accordion Toggle --- */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between cursor-pointer group bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">
                            {isOpen ? "Hide Order Items" : `View ${order.items.length} Items`}
                        </span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {/* --- Accordion Content (Items) --- */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-dashed border-gray-100 last:border-0">
                                        <div className="relative w-14 h-14 bg-white rounded-lg border border-gray-100 p-1 shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain mix-blend-multiply"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{item.quantity}x {item.unit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-800">₹{Number(item.price) * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- Card Footer --- */}
            <div className="p-4 md:p-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full animate-pulse`} />
                    <span className="text-slate-600 font-medium">
                        Delivery: <span className={`text-xs font-bold uppercase ${statusColors(status)}`}>{status.toUpperCase()}</span>
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">Order Total:</span>
                    <span className="text-xl font-extrabold text-slate-800">₹{order.totalAmount}</span>
                </div>
            </div>

        </motion.div>
    );
}