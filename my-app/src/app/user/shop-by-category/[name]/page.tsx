"use client"

import GroceryItemCard, { IGrocery } from "@/components/GroceryItemCard";
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, SearchX, ShoppingBag } from "lucide-react"

function Page() {
  const params = useParams();
  const router = useRouter();
  const decodedCategory = decodeURIComponent(params.name?.toString() || "")

  const [grocery, setGrocery] = useState<IGrocery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getGroceriesByCategory = async () => {
      try {
        setLoading(true)
        const res = await axios.post(`/api/user/shop-by-category`, { category: decodedCategory })
        setGrocery(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    if (decodedCategory) {
      getGroceriesByCategory()
    }
  }, [decodedCategory])

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">

        {/* --- Back Button --- */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 cursor-pointer"
        >
          <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </div>
          <span className="font-medium hidden md:inline text-sm">Back to Aisles</span>
        </motion.button>

        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 capitalize tracking-tight">
            {decodedCategory}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-1.5 w-16 bg-linear-to-r from-blue-500 to-blue-300 rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {loading ? "Checking stock..." : `${grocery.length} items found`}
            </p>
          </div>
        </motion.div>

        {/* --- CONTENT STATES --- */}

        {loading ? (
          /* 1. LOADING SKELETON STATE */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-[320px] flex flex-col gap-3 animate-pulse">
                <div className="w-full h-40 bg-slate-200 rounded-xl"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded-full mt-2"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded-full"></div>
                <div className="mt-auto flex justify-between items-center">
                  <div className="h-6 w-16 bg-slate-200 rounded-md"></div>
                  <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

        ) : grocery.length > 0 ? (
          /* 2. DATA LOADED STATE */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
          >
            {grocery.map((item: IGrocery, idx: number) => (
              <motion.div key={idx} variants={itemVariants}>
                <GroceryItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>

        ) : (
          /* 3. EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="relative mb-6">
              {/* Background decoration circles */}
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-full shadow-md border border-slate-100">
                <SearchX className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
              </div>
              {/* Floating decoration */}
              <div className="absolute -right-2 -top-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white">
                <ShoppingBag size={14} />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Shelf Empty
            </h3>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
              We couldn't find any items in the <span className="font-semibold text-blue-600 capitalize">{decodedCategory}</span> aisle right now. Our stockers are working on restocking!
            </p>

            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Browse other Categories
            </button>
          </motion.div>
        )}

      </div>
    </div>
  )
}

export default Page