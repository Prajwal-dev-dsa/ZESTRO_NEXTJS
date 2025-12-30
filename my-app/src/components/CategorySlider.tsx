"use client";

import {
    Carrot,
    Milk,
    Wheat,
    CookingPot,
    Popcorn,
    CupSoda,
    Coffee,
    Cookie,
    Snowflake,
    Drumstick,
    Popsicle,
    Pill,
    Sparkles,
    Bath,
    Baby,
    Bone,
    NotebookPen,
    Smartphone,
    Gift,
    Leaf,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    LucideIcon
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Category {
    id: number;
    name: string;
    icon: LucideIcon;
    color: string;
}

function CategorySlider() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [showLeftIcon, setShowLeftIcon] = useState<boolean>(false);
    const [showRightIcon, setShowRightIcon] = useState<boolean>(false);

    const categories: Category[] = [
        { id: 1, name: "Vegetables & Fruits", icon: Carrot, color: "bg-green-300" },
        { id: 2, name: "Dairy, Bread & Milk", icon: Milk, color: "bg-blue-300" },
        { id: 3, name: "Atta, Rice & Dal", icon: Wheat, color: "bg-yellow-300" },
        { id: 4, name: "Oil, Masala & Dry Fruits", icon: CookingPot, color: "bg-orange-300" },
        { id: 5, name: "Munchies & Chips", icon: Popcorn, color: "bg-red-300" },
        { id: 6, name: "Cold Drinks & Juices", icon: CupSoda, color: "bg-purple-300" },
        { id: 7, name: "Tea, Coffee & Health Drinks", icon: Coffee, color: "bg-amber-300" },
        { id: 8, name: "Biscuits & Bakery", icon: Cookie, color: "bg-orange-300" },
        { id: 9, name: "Instant & Frozen Food", icon: Snowflake, color: "bg-cyan-300" },
        { id: 10, name: "Meats, Fish & Eggs", icon: Drumstick, color: "bg-rose-300" },
        { id: 11, name: "Ice Creams & Frozen Desserts", icon: Popsicle, color: "bg-pink-300" },
        { id: 12, name: "Pharma & Wellness", icon: Pill, color: "bg-teal-300" },
        { id: 13, name: "Cleaning & Household", icon: Sparkles, color: "bg-indigo-300" },
        { id: 14, name: "Personal Care", icon: Bath, color: "bg-fuchsia-300" },
        { id: 15, name: "Baby Care", icon: Baby, color: "bg-violet-300" },
        { id: 16, name: "Pet Care", icon: Bone, color: "bg-stone-300" },
        { id: 17, name: "Stationery & Office", icon: NotebookPen, color: "bg-slate-300" },
        { id: 18, name: "Electronics & Accessories", icon: Smartphone, color: "bg-zinc-300" },
        { id: 19, name: "Gifting & Flowers", icon: Gift, color: "bg-red-300" },
        { id: 20, name: "Paan Corner", icon: Leaf, color: "bg-lime-300" }
    ];

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current
        setShowLeftIcon(scrollLeft > 0)
        setShowRightIcon(scrollLeft + clientWidth <= scrollWidth - 10)
    }

    useEffect(() => {
        scrollRef.current?.addEventListener("scroll", checkScroll)
        return () => scrollRef.current?.removeEventListener("scroll", checkScroll)
    })

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

                const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

                if (isAtEnd) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section
            className="w-full pt-12 px-4 md:px-8 bg-white"
        >

            {/* Header Section */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <ShoppingCart className="text-blue-600 size-6 md:size-8" />
                <h2 className="text-2xl md:text-3xl font-bold text-blue-700">
                    Shop by Category
                </h2>
            </div>

            {/* Slider Container */}
            <div className="relative group" onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}>

                {/* Left Arrow Button - Hidden on mobile, visible on desktop */}
                {showLeftIcon && <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-3 hidden md:flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors -ml-4"
                >
                    <ChevronLeft className="size-6" />
                </motion.button>}

                {/* Scrollable List */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2 -mx-2 touch-pan-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`min-w-[140px] md:min-w-[160px] h-[160px] md:h-[180px] flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all ${category.color}`}
                        >
                            <div className="bg-white/40 p-3 rounded-full mb-3 backdrop-blur-sm">
                                {/* Dynamically render the icon component */}
                                <category.icon className="size-8 md:size-10 text-gray-800" strokeWidth={1.5} />
                            </div>
                            <span className="text-sm md:text-base font-semibold text-center text-gray-800 leading-tight">
                                {category.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Right Arrow Button - Hidden on mobile */}
                {showRightIcon && <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-3 hidden md:flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors -mr-4"
                >
                    <ChevronRight className="size-6" />
                </motion.button>}

            </div>
        </section>
    );
}

export default CategorySlider;