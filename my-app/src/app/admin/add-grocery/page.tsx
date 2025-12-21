"use client"

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    UploadCloud,
    DollarSign,
    Package,
    Tag,
    Scale,
    X,
    Loader
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddGrocery() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [unit, setUnit] = useState("")
    const [price, setPrice] = useState("")
    const [loading, setLoading] = useState(false)
    const [frontendImage, setFrontendImage] = useState<string | null>()
    const [backendImage, setBackendImage] = useState<File | null>()

    const categories = [
        "Vegetables & Fruits",
        "Dairy, Bread & Milk",
        "Atta, Rice & Dal",
        "Oil, Masala & Dry Fruits",
        "Munchies & Chips",
        "Cold Drinks & Juices",
        "Tea, Coffee & Health Drinks",
        "Biscuits & Bakery",
        "Instant & Frozen Food",
        "Meats, Fish & Eggs",
        "Ice Creams & Frozen Desserts",
        "Pharma & Wellness",
        "Cleaning & Household",
        "Personal Care",
        "Baby Care",
        "Pet Care",
        "Stationery & Office",
        "Electronics & Accessories",
        "Gifting & Flowers",
        "Paan Corner"
    ];

    const units = ["kg", "g", "l", "ml", "pcs", "pack", "dozen"];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
        else return null;
    };

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setFrontendImage(null);
        setBackendImage(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append("name", name)
        formData.append("category", category)
        formData.append("unit", unit)
        formData.append("price", price)
        formData.append("image", backendImage as Blob)
        try {
            const res = await axios.post(`/api/admin/add-grocery`, formData, {
                withCredentials: true
            })
            console.log(res.data)
            setName("")
            setCategory("")
            setUnit("")
            setPrice("")
            setBackendImage(null)
            setFrontendImage(null)
            router.push("/")
        } catch (error) {
            console.log(`Error in adding grocery: ${error}`)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-dvh w-full bg-slate-50 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">

            {/* --- Background Decor --- */}
            <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-blue-50 to-transparent -z-10" />

            {/* --- Back Button (Absolute positioned) --- */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                <Link href="/">
                    <button className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-full shadow-sm border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all font-medium text-xs sm:text-sm group">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:block">Back</span>
                    </button>
                </Link>
            </div>

            {/* --- Main Card --- */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                // max-h-full ensures the card never overflows the screen height
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[95dvh]"
            >
                {/* Compact Header */}
                <div className="pt-6 pb-2 text-center shrink-0">
                    <div className="inline-flex items-center justify-center size-10 bg-blue-100 text-blue-600 rounded-full mb-2 shadow-inner">
                        <Plus className="size-6 stroke-3" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Add Grocery</h1>
                </div>

                {/* Scrollable Form Section */}
                <div className="p-6 pt-2 overflow-y-auto custom-scrollbar">
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Grocery Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                <Package className="size-3.5 text-blue-500" />
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="e.g. Fresh Brown Bread"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-gray-700 text-sm"
                            />
                        </div>

                        {/* Row: Category & Unit */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Category */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                    <Tag className="size-3.5 text-blue-500" />
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none text-gray-700 bg-white text-sm"
                                    >
                                        <option value="" disabled>Select</option>
                                        {categories.map((cat, idx) => (
                                            <option key={idx} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Unit */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                    <Scale className="size-3.5 text-blue-500" />
                                    Unit
                                </label>
                                <div className="relative">
                                    <select
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none text-gray-700 bg-white text-sm"
                                    >
                                        <option value="" disabled>Select</option>
                                        {units.map((u, idx) => (
                                            <option key={idx} value={u}>{u}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                <DollarSign className="size-3.5 text-blue-500" />
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                                <input
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    type="number"
                                    placeholder="120"
                                    className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-gray-700 text-sm"
                                />
                            </div>
                        </div>

                        {/* Image Upload / Preview Section */}
                        <div>
                            {!frontendImage ? (
                                <label className="block w-full group cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <div className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all">
                                        <div className="p-1.5 rounded-full bg-white text-blue-600 shadow-sm">
                                            <UploadCloud className="size-4" />
                                        </div>
                                        <span className="font-medium text-blue-700 text-sm">
                                            Upload Image
                                        </span>
                                    </div>
                                </label>
                            ) : (
                                <div className="flex items-center justify-between p-2 rounded-xl border border-gray-200 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="relative size-12 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={frontendImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                                                {backendImage?.name}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {(backendImage?.size as number / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeImage}
                                        className="p-1.5 cursor-pointer rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button disabled={loading || !name || !category || !unit || !price || !frontendImage} className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                            {!loading && <Plus className="size-5" />}
                            {loading ? <Loader className="size-6 animate-spin" /> : "Add Grocery"}
                        </button>

                    </form>
                </div>
            </motion.div>
        </div>
    );
}