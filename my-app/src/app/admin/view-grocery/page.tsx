"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  ArrowLeft,
  Search,
  Pencil,
  Trash2,
  X,
  UploadCloud,
  Loader2,
  Save,
  Package,
  IndianRupee
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// --- Types ---
interface Grocery {
  _id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  image: string;
}

// --- Constants ---
const CATEGORIES = [
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

const UNITS = ["kg", "g", "l", "ml", "pcs", "pack", "dozen"];

export default function ViewGroceriesPage() {
  const router = useRouter();
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [filteredGroceries, setFilteredGroceries] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedGrocery, setSelectedGrocery] = useState<Grocery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Fetch Data ---
  const getAllGroceries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/get-all-groceries`);
      setGroceries(res.data);
      setFilteredGroceries(res.data);
    } catch (error) {
      console.log(`Error in getAllGroceries ${error}`);
      toast.error("Failed to load groceries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllGroceries();
  }, []);

  // --- Search Logic ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGroceries(groceries);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = groceries.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery)
      );
      setFilteredGroceries(filtered);
    }
  }, [searchQuery, groceries]);

  // --- Handlers ---
  const handleEditClick = (grocery: Grocery) => {
    setSelectedGrocery(grocery);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGrocery(null);
  };

  const handleUpdateSuccess = (updatedGrocery: Grocery) => {
    const updatedList = groceries.map((g) =>
      g._id === updatedGrocery._id ? updatedGrocery : g
    );
    setGroceries(updatedList);
    setFilteredGroceries(updatedList);
    closeModal();
    toast.success("Grocery updated successfully!");
  };

  const handleDeleteSuccess = (deletedId: string) => {
    const updatedList = groceries.filter((g) => g._id !== deletedId);
    setGroceries(updatedList);
    setFilteredGroceries(updatedList);
    closeModal();
    toast.success("Grocery deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">

      {/* --- Sticky Header --- */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Title & Back */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 bg-slate-100 cursor-pointer hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                Manage Groceries
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm shadow-inner"
                placeholder="Search by name or category..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading your pantry...</p>
          </div>
        ) : filteredGroceries.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4"
          >
            <AnimatePresence>
              {filteredGroceries.map((item) => (
                <GroceryCard key={item._id} item={item} onEdit={handleEditClick} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-blue-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No groceries found</h3>
            <p className="text-slate-500">Add groceries to see and update them here.</p>
          </motion.div>
        )}
      </div>

      {/* --- Edit Modal --- */}
      <AnimatePresence>
        {isModalOpen && selectedGrocery && (
          <EditGroceryModal
            grocery={selectedGrocery}
            onClose={closeModal}
            onUpdate={handleUpdateSuccess}
            onDelete={handleDeleteSuccess}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SUB-COMPONENT: Grocery List Item Card ---

function GroceryCard({ item, onEdit }: { item: Grocery; onEdit: (g: Grocery) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-sm transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden p-1">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain mix-blend-multiply cursor-pointer group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-bold text-slate-800 truncate">{item.name}</h3>
        <p className="text-xs text-slate-500 mb-1">{item.category}</p>
        <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
          <IndianRupee className="w-3.5 h-3.5" />
          {item.price}
          <span className="text-slate-400 font-normal text-xs ml-1">/ {item.unit}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onEdit(item)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
      >
        <Pencil className="w-4 h-4" />
        <span className="hidden md:inline">Edit</span>
      </button>
    </motion.div>
  );
}

// --- SUB-COMPONENT: Edit Modal ---

function EditGroceryModal({
  grocery,
  onClose,
  onUpdate,
  onDelete
}: {
  grocery: Grocery;
  onClose: () => void;
  onUpdate: (g: Grocery) => void;
  onDelete: (id: string) => void;
}) {
  const [formData, setFormData] = useState({
    name: grocery.name,
    category: grocery.category,
    price: grocery.price,
    unit: grocery.unit,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(grocery.image);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const data = new FormData();
      data.append("groceryId", grocery._id);

      // Send fields
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price.toString());
      data.append("unit", formData.unit);

      // Only send image if NEW file is selected
      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await axios.post(`/api/admin/update-grocery`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpdate(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this grocery?")) return;

    setIsDeleting(true);
    try {
      await axios.post(`/api/admin/delete-grocery`, { groceryId: grocery._id });
      onDelete(grocery._id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete grocery.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Edit Grocery</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 cursor-pointer rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">

          {/* Image Upload Area */}
          <div className="flex justify-center mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-40 h-40 group cursor-pointer"
            >
              <div className="w-full h-full rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 overflow-hidden relative flex items-center justify-center">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-contain p-2 mix-blend-multiply z-10"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <UploadCloud className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium">Change Image</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 appearance-none"
              >
                {CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 appearance-none"
                >
                  {UNITS.map((u, idx) => (
                    <option key={idx} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="flex-1 py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer gap-2 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            {isDeleting ? "Deleting..." : "Delete Grocery"}
          </button>

          <button
            onClick={handleUpdate}
            disabled={isDeleting || isUpdating}
            className="flex-1 py-3 bg-green-500 text-white hover:bg-green-600 rounded-xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
}