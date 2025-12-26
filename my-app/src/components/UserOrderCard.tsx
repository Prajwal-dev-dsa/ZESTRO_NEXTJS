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
    HandCoins,
    User,
    Phone,
    Truck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { initSocket } from "@/lib/socket.io";
import Link from "next/link";

import mongoose from "mongoose";
import { IUser } from "@/models/user.model";


interface IOrder {
    _id?: mongoose.Types.ObjectId;
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
    createdAt?: Date;
    updatedAt?: Date;
}

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
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs md:text-sm font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt!).toLocaleString()}
                        </div>
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
                            <p className="text-slate-700 font-medium text-sm capitalize">{order.paymentMethod == "cod" ? "Cash On Delivery" : "Online"}</p>
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

                {/* --- ASSIGNED DELIVERY BOY SECTION --- */}
                {/* Only show if a delivery boy is assigned */}
                {order.assignedDeliveryBoy && (
                    <div className="mb-6 space-y-4">
                        {/* Delivery Boy Info Card */}
                        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
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
                                        <span className="text-sm font-semibold font-mono">{order.assignedDeliveryBoy.mobile}</span>
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

                        {/* Track Order Button */}
                        {/* Only show if out of delivery or assigned */}
                        {(status === 'out of delivery' || status === 'assigned') && (
                            <Link
                                href={`/user/track-order/${order._id}`}
                                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <Truck className="w-5 h-5" />
                                Track Your Order
                            </Link>
                        )}
                    </div>
                )}

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
                    <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`} />
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