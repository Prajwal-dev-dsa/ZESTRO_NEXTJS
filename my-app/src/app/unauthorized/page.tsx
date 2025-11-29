"use client"

import { motion } from "motion/react";
import { ShieldAlert, ArrowLeft, LockKeyhole, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">

            {/* --- Background Decor (Subtle Blue Glows) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-400/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-400/10 rounded-full blur-[100px]" />

            {/* --- Main Card --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md mx-4 p-8 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center"
            >

                {/* Animated Icon Container */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                        className="relative"
                    >
                        <div className="size-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-inner">
                            <ShieldAlert className="size-10" />
                        </div>

                        {/* Floating Lock Icon Badge */}
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="absolute -top-1 -right-1 size-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-gray-600"
                        >
                            <LockKeyhole className="size-4" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Text Content */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight"
                >
                    Access Denied
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-500 mb-8 leading-relaxed"
                >
                    Oops! It looks like you don't have the required permissions to view this page. This area is restricted.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    {/* Go Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer hover:border-gray-300 transition-all flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                    {/* Home Button (Primary) */}
                    <Link href="/">
                        <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-2">
                            <Home className="size-4" />
                            Back to Home
                        </button>
                    </Link>
                </motion.div>

                {/* Footer Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-xs text-gray-400"
                >
                    Error Code: 403 • Zestro Security
                </motion.div>

            </motion.div>
        </div>
    );
}