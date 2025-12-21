"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingCart,
    Trash2,
    CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";
import { decreaseItemQuantity, increaseItemQuantity, removeFromCart } from "@/redux/cartSlice";

export default function CartPage() {
    const { cartData } = useSelector((state: RootState) => state.cart)
    const dispatch = useDispatch<AppDispatch>()

    // Calculations
    const subtotal = cartData.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
    const deliveryFee = subtotal > 500 ? 0 : 40; // Free delivery logic
    const total = subtotal + deliveryFee;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">

            {/* --- Top Navigation --- */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back to Home</span>
                </Link>
            </div>

            {/* --- Page Content --- */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Page Title */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <ShoppingCart className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                        Your Shopping Cart
                    </h1>
                </div>

                {cartData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* --- Left Column: Cart Items --- */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {cartData.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Item Image */}
                                        <div className="relative w-52 h-24 md:w-32 md:h-24 bg-gray-50 rounded-2xl p-2 shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain mix-blend-multiply"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 text-center sm:text-left w-full">
                                            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-slate-500 text-sm font-medium mb-2">
                                                {item.unit}
                                            </p>
                                            <p className="text-blue-600 font-bold text-lg">
                                                ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Actions: Quantity & Delete */}
                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">

                                            {/* Quantity Counter */}
                                            <div className="flex items-center bg-blue-50 rounded-xl p-1">
                                                <button
                                                    onClick={() => dispatch(decreaseItemQuantity(item._id))}
                                                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                                                >
                                                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                                <span className="w-10 md:w-12 text-center font-bold text-slate-800 text-sm md:text-base">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => dispatch(increaseItemQuantity(item._id))}
                                                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                                                >
                                                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => dispatch(removeFromCart(item._id))}
                                                className="text-red-400 hover:text-red-600 cursor-pointer hover:bg-red-50 p-2 rounded-xl transition-all"
                                                aria-label="Remove Item"
                                            >
                                                <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* --- Right Column: Order Summary --- */}
                        <div className="lg:col-span-1 sticky top-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-lg shadow-blue-100/50"
                            >
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Delivery Fee</span>
                                        <span className={deliveryFee === 0 ? "text-green-500" : ""}>
                                            {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-400 my-2" />
                                    <div className="flex justify-between text-lg md:text-xl font-extrabold text-slate-800">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center cursor-pointer gap-2 mb-4"
                                >
                                    Proceed to Checkout
                                    <CreditCard className="w-5 h-5" />
                                </motion.button>

                            </motion.div>
                        </div>
                    </div>
                ) : (
                    /* --- Empty Cart State --- */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
                    >
                        <div className="bg-blue-50 p-6 rounded-full mb-6">
                            <ShoppingCart className="w-16 h-16 text-blue-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                        <p className="text-slate-500 mb-8 text-center max-w-sm">
                            Looks like you haven't added anything to your cart yet. Go ahead and explore our products!
                        </p>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                                Start Shopping
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}