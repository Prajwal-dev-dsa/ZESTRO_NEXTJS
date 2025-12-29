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
    User,
    Phone,
    Truck,
    Loader2,
    HandCoins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import mongoose from "mongoose";
import { initSocket } from "@/lib/socket.io";


interface IUser {
    _id: string;
    name: string;
    mobile: string;
    email: string;
    image?: string;
}

interface IOrder {
    _id?: mongoose.Types.ObjectId | string;
    user: mongoose.Types.ObjectId;
    items: [
        {
            grocery: mongoose.Types.ObjectId;
            name: string;
            unit: string;
            image: string;
            quantity: number;
            price: string;
        }
    ];
    totalAmount: number;
    paymentMethod: "cod" | "online";
    address: {
        name: string;
        mobile: string;
        city: string;
        state: string;
        pincode: string;
        fullAddress: string;
        latitude: number;
        longitude: number;
    };
    status: "pending" | "out of delivery" | "delivered";
    isPaid: boolean;
    orderAssignment?: mongoose.Types.ObjectId;
    assignedDeliveryBoy?: IUser;
    createdAt?: Date | string;
    updatedAt?: Date;
}

interface AdminOrderCardProps {
    order: IOrder;
    index: number;
}

export default function AdminOrderCard({ order, index }: AdminOrderCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState<string>(order.status)

    // --- Helpers for Styles ---
    const getStatusColor = (currentStatus: string) => {
        switch (currentStatus) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'out of delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        setStatus(status)
        try {
            const res = await axios.put(`/api/admin/update-order-status/${orderId}`, { status })
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const socket = initSocket()
        socket.on("update-order-status", ({ orderId, status }) => {
            if (orderId == order._id) {
                setStatus(status)
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
            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300 overflow-hidden mb-6 group relative"
        >
            {/* Loading Overlay during update */}
            {isUpdating && (
                <div className="absolute inset-0 bg-white/60 z-20 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            )}

            {/* --- Card Header --- */}
            <div className="p-5 md:p-6 border-b border-gray-50 relative">
                <div className="flex flex-col md:flex-row justify-between gap-4">

                    {/* Left: Order Info */}
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                                Order <span className="text-blue-600">#{order?._id?.toString()?.slice(0, 8)}</span>
                            </h3>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400 text-xs md:text-sm font-medium pl-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt!).toLocaleString()}
                        </div>
                    </div>

                    {/* Right: Admin Status Dropdown */}
                    {status != "delivered" && <div className="absolute top-5 right-5 md:static md:flex md:flex-col md:items-end">
                        <div className="relative group/dropdown">
                            <select
                                disabled={isUpdating}
                                onChange={(e) => updateOrderStatus(order?._id?.toString()!, e.target.value)}
                                value={status}
                                className={`appearance-none cursor-pointer pl-4 pr-10 py-2 bg-amber-100 rounded-xl font-bold text-xs  tracking-wider border transition-all outline-none`}
                            >
                                <option value="pending">Pending</option>
                                <option value="out of delivery">Out of Delivery</option>
                            </select>

                            {/* Custom Arrow */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>

            {/* --- Customer & Delivery Details --- */}
            {status != 'delivered' && <div className="p-5 md:p-6">
                <div className="grid grid-cols-1 gap-4 mb-6">

                    {/* Customer Name */}
                    <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-400" />
                        <p className="text-sm font-bold text-slate-700">
                            {order?.address?.name}
                        </p>
                    </div>

                    {/* Customer Phone */}
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <p className="text-sm font-medium text-slate-600">{order?.address?.mobile}</p>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <p className="text-sm font-medium text-slate-600 leading-snug w-full md:w-2/3">
                            {order?.address?.fullAddress}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center gap-3">
                        {order.paymentMethod === 'cod' ? <HandCoins className="w-4 h-4 text-slate-400" /> : <CreditCard className="w-4 h-4 text-slate-400" />}
                        <p className="text-sm font-medium text-slate-600 capitalize">
                            {order.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Online Payment'}
                        </p>
                    </div>

                </div>

                {/* --- Assigned Delivery Boy Section --- */}
                {order.assignedDeliveryBoy && (
                    <div className="bg-blue-50/50 rounded-2xl p-4 mb-6 border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Avatar Icon */}
                            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 border border-blue-100">
                                <User className="w-6 h-6" />
                            </div>

                            {/* Details */}
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-500 font-medium leading-none mb-2">
                                    Assigned To: <span className="text-slate-800 font-bold">{order.assignedDeliveryBoy.name}</span>
                                </span>
                                <div className="flex items-center gap-1 text-slate-600">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm font-bold font-mono">+91 {order.assignedDeliveryBoy.mobile}</span>
                                </div>
                            </div>
                        </div>

                        {/* Call Button */}
                        <a
                            href={`tel:${order.assignedDeliveryBoy.mobile}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-transform active:scale-95"
                        >
                            Call
                        </a>
                    </div>
                )}


                {/* --- Accordion Toggle --- */}
                <div className="border-t border-gray-100 pt-4">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                                {isOpen ? "Hide Items" : `View ${order.items.length} Items`}
                            </span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
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
                            <div className="pt-2 space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-3 border-b border-dashed border-gray-100 last:border-0 bg-slate-50/50 rounded-xl px-3 mt-2">
                                        <div className="relative w-12 h-12 bg-white rounded-lg border border-gray-200 p-1 shrink-0">
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
            </div>}

            {/* --- Card Footer --- */}
            <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 font-medium hidden xs:inline">Delivery:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm font-medium">Total:</span>
                    <span className="text-lg font-extrabold text-slate-800">₹{order.totalAmount}</span>
                </div>
            </div>

        </motion.div>
    );
}