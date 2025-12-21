"use client"

import { Minus, Plus, ShoppingCart, Timer } from "lucide-react";
import mongoose from "mongoose";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface IGrocery {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  category: string;
  unit: string;
  price: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function GroceryItemCard({ item }: { item: IGrocery }) {
  const [quantity, setQuantity] = useState(0);
  const [randomTime, setRandomTime] = useState<number>(8);

  const price = Number(item.price);
  const mrp = price + Math.floor(price * 0.2) + 15;
  const discount = Math.round(((mrp - price) / mrp) * 100);

  useEffect(() => {
    const time = Math.floor(Math.random() * (25 - 6 + 1)) + 6;
    setRandomTime(time);
  }, []);

  const handleAdd = () => setQuantity(1);
  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.15)" }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col h-full bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* --- Image Section (Changed to 4:3 Aspect Ratio) --- */}
      <div className="relative w-full aspect-4/3 p-4 bg-white flex items-center justify-center">

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5 z-10">
          <div className="bg-blue-600 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-sm w-fit">
            {discount}% OFF
          </div>
          <div className="bg-gray-100/90 backdrop-blur-md border border-gray-200 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md flex items-center gap-1 w-fit">
            <Timer className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-500" />
            <span className="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase">{randomTime} M</span>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="flex flex-col grow p-3 md:p-4 pt-0">

        {/* Category */}
        <span className="text-[10px] md:text-xs text-gray-400 font-medium mb-1 block">
          {item.category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-sm md:text-lg leading-tight mb-2 md:mb-3 line-clamp-2 min-h-10 md:min-h-14">
          {item.name}
        </h3>

        {/* Unit & Price Row */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="bg-gray-100 text-gray-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold">
            {item.unit}
          </div>

          <div className="text-right flex flex-col md:block">
            <span className="text-[10px] md:text-xs text-gray-400 line-through mr-0 md:mr-2">₹{mrp}</span>
            <span className="text-sm md:text-lg font-bold text-blue-700">₹{price}</span>
          </div>
        </div>

        {/* --- Button Section --- */}
        <div className="mt-auto">
          <AnimatePresence mode="wait">
            {quantity === 0 ? (
              <motion.button
                key="add-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="w-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 font-bold py-2 md:py-2.5 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs md:text-sm cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Add
              </motion.button>
            ) : (
              <motion.div
                key="counter-btn"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="w-full flex items-center justify-between bg-blue-600 text-white rounded-lg md:rounded-xl py-1 px-1 shadow-md h-[34px] md:h-[42px] cursor-pointer"
              >
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleDecrement}
                  className="w-8 h-full flex items-center justify-center hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3 md:w-5 md:h-5" />
                </motion.button>

                <span className="font-bold text-sm md:text-lg">{quantity}</span>

                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleIncrement}
                  className="w-8 h-full flex items-center justify-center hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3 md:w-5 md:h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default GroceryItemCard