"use client"

import {
    Carrot,
    Pill,
    Smartphone,
    Dog,
    SprayCan,
    Baby,
    Pencil,
    Gift,
    Fish,
    IceCream,
    ChevronRight
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

function HeroSection() {
    const slides = [
        {
            id: 1,
            icon: <Carrot className="size-12 md:size-20 text-green-400 drop-shadow-lg" />,
            title: "Farm Fresh",
            subTitle: "Vegetables & fruits harvested daily.",
            btnText: "Shop Greens",
            bgImg: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 2,
            icon: <Pill className="size-12 md:size-20 text-blue-400 drop-shadow-lg" />,
            title: "Pharmacy",
            subTitle: "Essential medicines & first-aid delivered.",
            btnText: "Order Meds",
            bgImg: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 3,
            icon: <Dog className="size-12 md:size-20 text-orange-400 drop-shadow-lg" />,
            title: "Pet Care",
            subTitle: "Premium food & treats for your furry friends.",
            btnText: "Pamper Pets",
            bgImg: "https://plus.unsplash.com/premium_photo-1661962620229-614e281fe009?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 4,
            icon: <Smartphone className="size-12 md:size-20 text-gray-200 drop-shadow-lg" />,
            title: "Electronics",
            subTitle: "Chargers, cables & earphones in minutes.",
            btnText: "Get Gadgets",
            bgImg: "https://plus.unsplash.com/premium_photo-1661304671477-37c77d0c6930?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 5,
            icon: <SprayCan className="size-12 md:size-20 text-yellow-400 drop-shadow-lg" />,
            title: "Cleaning Essentials",
            subTitle: "Detergents, sprays & supplies for a tidy home.",
            btnText: "Clean Up",
            bgImg: "https://plus.unsplash.com/premium_photo-1663047022624-2e573ccd0682?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 6,
            icon: <Baby className="size-12 md:size-20 text-pink-300 drop-shadow-lg" />,
            title: "Baby Care",
            subTitle: "Diapers, wipes & baby food for emergencies.",
            btnText: "Baby Needs",
            bgImg: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 7,
            icon: <Pencil className="size-12 md:size-20 text-indigo-400 drop-shadow-lg" />,
            title: "Stationery",
            subTitle: "Notebooks, pens & craft supplies for school.",
            btnText: "Restock Desk",
            bgImg: "https://images.unsplash.com/photo-1654931800100-2ecf6eee7c64?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 8,
            icon: <Gift className="size-12 md:size-20 text-red-400 drop-shadow-lg" />,
            title: "Gifting & Flowers",
            subTitle: "Last-minute gifts, wrappers & fresh bouquets.",
            btnText: "Send Love",
            bgImg: "https://images.unsplash.com/photo-1668127494508-72d882001969?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 9,
            icon: <Fish className="size-12 md:size-20 text-teal-400 drop-shadow-lg" />,
            title: "Meats & Seafood",
            subTitle: "Fresh cuts, chemical-free & cold stored.",
            btnText: "Cook Fresh",
            bgImg: "https://images.unsplash.com/photo-1556906851-99df9cb88ad2?w=1920&auto=format&fit=crop&q=80"
        },
        {
            id: 10,
            icon: <IceCream className="size-12 md:size-20 text-purple-400 drop-shadow-lg" />,
            title: "Cool Cravings",
            subTitle: "Ice creams, sodas & desserts frozen delivered.",
            btnText: "Treat Yourself",
            bgImg: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1920&auto=format&fit=crop&q=80"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [slides.length])

    return (
        <section className="w-full pt-32 px-4 md:px-8 bg-gray-50">
            <div className="relative w-full h-[65vh] md:h-[75vh] rounded-3xl overflow-hidden shadow-2xl bg-gray-900 group ring-1 ring-gray-200">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={slides[currentSlide]?.bgImg}
                            alt={slides[currentSlide]?.title}
                            fill
                            priority
                            quality={100}
                            className="object-cover opacity-90"
                            sizes="100vw"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="mb-4 md:mb-6"
                            >
                                {slides[currentSlide].icon}
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-3xl md:text-6xl font-extrabold text-white mb-2 md:mb-4 drop-shadow-md tracking-tight"
                            >
                                {slides[currentSlide].title}
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-sm md:text-xl text-gray-200 mb-6 md:mb-10 max-w-xs md:max-w-xl font-medium leading-relaxed"
                            >
                                {slides[currentSlide].subTitle}
                            </motion.p>

                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white hover:bg-blue-100 cursor-pointer text-black px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-lg flex items-center gap-2 shadow-lg hover:shadow-white/25 transition-shadow"
                            >
                                {slides[currentSlide].btnText}
                                <ChevronRight className="size-4 md:size-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-1 md:h-1.5 rounded-full transition-all duration-300 backdrop-blur-sm ${index === currentSlide
                                ? "w-6 md:w-8 bg-white"
                                : "w-2 bg-white/40 hover:bg-white/70"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HeroSection