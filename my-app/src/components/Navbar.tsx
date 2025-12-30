"use client"
import { LogOut, Package, PlusCircle, Search, ShoppingCart, User, X, ClipboardCheck, Boxes } from "lucide-react";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IUser {
    _id?: string;
    name: string;
    email: string;
    mobile?: string;
    password?: string;
    image?: string;
    role: "user" | "admin" | "deliveryBoy";
    createdAt?: string;
    updatedAt?: string;
}

function Navbar({ user }: { user: IUser }) {
    const router = useRouter()
    const { cartData } = useSelector((state: RootState) => state.cart)
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchBarOpen, setSearchBarOpen] = useState(false)
    const profileDropDownRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropDownRef.current && !profileDropDownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [profileDropDownRef])

    const handleLogout = async () => {
        await signOut()
        redirect("/login")
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = search.trim();
        setSearch("")
        setSearchBarOpen(false)
        if (!query) return router.push("/")
        router.push(`/?q=${encodeURIComponent(query)}`)
    }
    return (
        <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-blue-500 to-blue-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50">
            <Link href={"/"} className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform">
                Zestro
            </Link>
            {
                user?.role == "user" && <form onSubmit={(e) => handleSearch(e)} className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
                    <Search className="w-5 h-5 text-gray-500 mr-2" />
                    <input type="text" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search Groceries..." className="w-full text-gray-700 placeholder-gray-400 bg-transparent outline-none" />
                </form>
            }
            <div className="flex items-center gap-4 md:gap-6 relative">
                {
                    user?.role == "user" && <>
                        <div onClick={() => setSearchBarOpen(!searchBarOpen)} className="md:hidden relative bg-white rounded-full size-11 flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                            <Search className="text-blue-500 size-5" />
                        </div>
                        <Link href={"/user/cart"} className="relative bg-white rounded-full size-11 flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                            <ShoppingCart className="text-blue-500 w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs size-5 flex items-center justify-center rounded-full font-semibold shadow">{cartData?.length}</span>
                        </Link>
                    </>
                }
                {
                    user?.role == "admin" && <>
                        <div className="hidden md:flex items-center gap-4">
                            <Link href={"/admin/add-grocery"} className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition-all">
                                <PlusCircle className="w-5 h-5" /> Add Grocery
                            </Link>
                            <Link href={"/admin/view-grocery"} className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition-all">
                                <Boxes className="w-5 h-5" /> View Grocery
                            </Link>
                            <Link href={"/admin/manage-orders"} className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition-all">
                                <ClipboardCheck className="w-5 h-5" /> Manage Orders
                            </Link>
                        </div>
                    </>
                }
                <div className="relative" ref={profileDropDownRef}>
                    <div onClick={() => setOpen(!open)} className="bg-white cursor-pointer rounded-full size-11 flex items-center justify-center shadow-md hover:scale-105 overflow-hidden transition-transform">
                        {user?.image ? <Image src={user?.image} className="rounded-full object-cover" alt="User Image" fill /> : <User className="w-5 h-5" />}
                    </div>
                    <AnimatePresence>
                        {open && <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-99">
                            <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                                <div className="size-10 rounded-full relative bg-blue-600 flex items-center justify-center overflow-hidden">
                                    {user?.image ? <Image src={user?.image} className="rounded-full object-cover" alt="User Image" fill /> : <User className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className="text-gray-700 font-semibold">{user?.name?.split(" ")[0]}</div>
                                    <div className="text-xs capitalize text-gray-500">{user?.role}</div>
                                </div>
                            </div>
                            {
                                user?.role == "user" && <Link onClick={() => setOpen(false)} href={"/user/my-orders"} className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 rounded-lg text-gray-700 font-medium">
                                    <Package className="size-6 text-blue-600" />
                                    My Orders
                                </Link>
                            }
                            {
                                user?.role == "admin" && <Link onClick={() => setOpen(false)} href={"/admin/add-grocery"} className="sm:hidden flex items-center gap-2 px-3 py-2 hover:bg-blue-100 rounded-lg text-gray-700 font-medium">
                                    <PlusCircle className="size-6 text-blue-600" />
                                    Add Grocery
                                </Link>
                            }
                            {
                                user?.role == "admin" && <Link onClick={() => setOpen(false)} href={"/admin/view-grocery"} className="sm:hidden flex items-center gap-2 px-3 py-2 hover:bg-blue-100 rounded-lg text-gray-700 font-medium">
                                    <Boxes className="size-6 text-blue-600" />
                                    View Groceries
                                </Link>
                            }
                            {
                                user?.role == "admin" && <Link onClick={() => setOpen(false)} href={"/admin/manage-orders"} className="sm:hidden flex items-center gap-2 px-3 py-2 hover:bg-blue-100 rounded-lg text-gray-700 font-medium">
                                    <ClipboardCheck className="size-6 text-blue-600" />
                                    Manage Orders
                                </Link>
                            }
                            <button onClick={handleLogout} className="flex items-center cursor-pointer gap-2 w-full text-left px-3 py-2 hover:bg-red-100 rounded-lg text-gray-700 font-medium">
                                <LogOut className="size-6 text-red-600" />
                                Logout
                            </button>
                        </motion.div>}
                    </AnimatePresence>
                    <AnimatePresence>
                        {
                            searchBarOpen && <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40p-3 flex items-center px-4 py-2">
                                <Search className="text-gray-500 mr-2 size-6" />
                                <form onSubmit={(e) => handleSearch(e)} className="grow">
                                    <input type="text" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search Groceries..." className="w-full text-gray-700 placeholder-gray-500 bg-transparent outline-none" />
                                </form>
                                <button onClick={() => setSearchBarOpen(false)}>
                                    <X className="text-gray-500 size-6" />
                                </button>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default Navbar
