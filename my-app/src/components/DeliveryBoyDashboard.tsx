"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    MapPin,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    User,
    Phone,
    Navigation,
    ChevronDown,
    ChevronUp,
    Package
} from "lucide-react"
import { initSocket } from "@/lib/socket.io"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import Image from "next/image"
import Link from "next/link"


interface Address {
    name: string
    mobile: string
    city: string
    state: string
    pincode: string
    houseNumber?: string
    fullAddress: string
}

interface DeliveryBoy {
    _id: string;
    name: string;
    mobile: string;
    email: string;
}

interface Location {
    latitude: number;
    longitude: number;
}

interface OrderItem {
    [key: string]: any
}

interface Order {
    _id: string
    address: Address
    totalAmount: number
    paymentMethod: "online" | "cod" | string
    status: string
    isPaid: boolean
    items: OrderItem[]
    user: string
    assignedDeliveryBoy?: DeliveryBoy
    createdAt: string
    updatedAt: string
}

interface Assignment {
    _id: string
    status: "broadcasted" | "accepted" | "rejected" | string
    order: Order
    totalDeliveryBoys: string[]
    createdAt: string
    updatedAt: string
}

// --- Main Dashboard Component ---

export default function DeliveryBoyDashboard() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [activeOrder, setActiveOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [userLocation, setUserLocation] = useState<Location>({ latitude: 0, longitude: 0 })
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<Location>({ latitude: 0, longitude: 0 })

    useEffect(() => {
        const socket = initSocket();
        if (!userData?._id || !navigator.geolocation) return;
        const watcher = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords
            setDeliveryBoyLocation({
                latitude,
                longitude
            })
            socket.emit("updateLocation", { userId: userData?._id, latitude, longitude })
        }, (err) => {
            console.log(`Error in GeoLocationUpdater: ${err}`)
        },
            {
                enableHighAccuracy: true
            })
        return () => {
            navigator.geolocation.clearWatch(watcher)
        }
    }, [userData?._id])


    // 1. Fetch available assignments (Broadcasted)
    const getAllOrderAssignments = async () => {
        try {
            const res = await axios.get<Assignment[]>(`/api/delivery/get-all-order-assignments`)
            setAssignments(res.data)
        } catch (error) {
            console.error(`Error in getAllOrderAssignments`, error)
        }
    }

    // 2. Fetch active/assigned order details (Accepted)
    const getAssignedOrderDetails = async () => {
        try {
            const res = await axios.get(`/api/delivery/assigned-order-details`)
            console.log("Active Order Data:", res.data);
            if (res.data) {
                setUserLocation({ latitude: res.data[0].address.latitude, longitude: res.data[0].address.longitude })
            }
            console.log("Active location:", res.data[0].address.latitude);
            if (res.data && res.data.length > 0) {
                setActiveOrder(res.data[0] || res.data);
            } else {
                setActiveOrder(null);
            }
        } catch (error) {
            console.log(`Error in getAssignedOrderDetails`, error);
        } finally {
            setLoading(false)
        }
    }

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([getAllOrderAssignments(), getAssignedOrderDetails()]);
            setLoading(false);
        };
        fetchData();
    }, [userData])

    // Socket Listener
    useEffect(() => {
        const socket = initSocket()
        const handleNewAssignment = (deliveryAssignment: Assignment) => {
            if (activeOrder) return;

            setAssignments((prev) => {
                const isAlreadyHere = prev.some((item) => item._id === deliveryAssignment._id);
                if (isAlreadyHere) return prev;
                return [...prev, deliveryAssignment]
            })
        }
        socket.on("new-order-assignment", handleNewAssignment)
        return () => {
            socket.off("new-order-assignment", handleNewAssignment)
        }
    }, [activeOrder])

    // Handlers
    const handleAccept = async (assignmentId: string) => {
        try {
            const res = await axios.get(`/api/delivery/assignment/${assignmentId}/accept-assignment`)
            setAssignments((prev) => prev.filter((item) => item._id !== assignmentId))
            setLoading(true);
            await getAssignedOrderDetails();
            setLoading(false);

        } catch (error) {
            console.log(`Error in handleAccept`, error);
        }
    }

    const handleReject = async (assignmentId: string) => {
        setAssignments((prev) => prev.filter((item) => item._id !== assignmentId))
    }

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 font-sans">
            <main className="max-w-3xl mx-auto px-4 pt-6">

                {/* CONDITIONAL RENDERING */}
                {activeOrder ? (
                    // --- VIEW 1: Active Order (The "Active Delivery" UI) ---
                    <div className="mt-24 space-y-6">
                        <div className="mb-4">
                            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                                <Navigation className="w-6 h-6 text-blue-600" />
                                Active Delivery
                            </h2>
                            <p className="text-slate-500 text-sm">You are currently assigned to this order.</p>
                        </div>
                        <ActiveOrderCard order={activeOrder} userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
                    </div>
                ) : (
                    // --- VIEW 2: Assignment List (Accept/Reject) ---
                    <div className="mt-24 space-y-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-slate-800">New Assignments</h2>
                            <p className="text-slate-500 text-sm">Available orders in your area</p>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {assignments.length > 0 ? (
                                assignments.map((item) => (
                                    <AssignmentCard
                                        key={item._id}
                                        data={item}
                                        onAccept={() => handleAccept(item._id)}
                                        onReject={() => handleReject(item._id)}
                                    />
                                ))
                            ) : (
                                <EmptyState />
                            )}
                        </AnimatePresence>
                    </div>
                )}

            </main>
        </div>
    )
}

// --- COMPONENT: Active Order Card ---

function ActiveOrderCard({ order, userLocation, deliveryBoyLocation }: { order: Order, userLocation: Location, deliveryBoyLocation: Location }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-100/50 overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-50 bg-blue-50/30">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-800">Order <span className="text-blue-600">#{order._id.slice(-6)}</span></h3>
                        <p className="text-xs text-slate-400 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-200">
                            {order.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 pt-4">

                {/* 1. Address Details (Where to go) */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="min-w-[24px] mt-0.5">
                            <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Delivery Location</p>
                            <p className="font-medium text-slate-700 text-sm leading-relaxed">{order.address.fullAddress}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="min-w-[24px]">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Payment Method</p>
                            <span className="font-semibold text-slate-700 capitalize">{order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod}</span>
                        </div>
                    </div>
                </div>

                {/* 2. CUSTOMER CONTACT Section */}
                <div className="bg-blue-50/50 rounded-2xl p-4 mb-5 border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-blue-100 text-blue-600 shadow-sm">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-500 font-bold uppercase mb-0.5">Customer</p>
                            <p className="text-sm font-bold text-slate-800">{order.address.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{order.address.mobile}</p>
                        </div>
                    </div>
                    {/* Calls the CUSTOMER */}
                    <a href={`tel:${order.address.mobile}`} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors active:scale-95">
                        Call
                    </a>
                </div>

                {/* 3. TRACKING BUTTON */}
                <Link
                    href={`/delivery/track/${order._id}`}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all mb-6 active:translate-y-0"
                >
                    <Navigation className="w-5 h-5" />
                    Track Order
                </Link>

                {/* 4. Items Accordion */}
                <div className="border-t border-gray-100 pt-4">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                                {isOpen ? "Hide Items" : `View ${order.items.length} Items`}
                            </span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2 space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 py-2 border-b border-dashed border-gray-100 last:border-0">
                                            <div className="relative w-10 h-10 bg-slate-50 rounded border border-gray-200 shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.quantity} x {item.unit}</p>
                                            </div>
                                            <p className="text-sm font-bold text-slate-800">₹{item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Total */}
            <div className="bg-slate-50/50 p-5 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Total Amount</span>
                <span className="text-xl font-extrabold text-slate-800">₹{order.totalAmount}</span>
            </div>
        </motion.div>
    )
}

// --- COMPONENT: Assignment Card (Accept/Reject) ---

interface AssignmentCardProps {
    data: Assignment
    onAccept: () => void
    onReject: () => void
}

function AssignmentCard({ data, onAccept, onReject }: AssignmentCardProps) {
    const { order } = data
    const address = order.address

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
            <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
                    <span className="text-slate-800 font-bold font-mono">#{order._id.slice(-6)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    Broadcasted
                </div>
            </div>

            <div className="p-5">
                <div className="flex gap-3 mb-5">
                    <div className="mt-1 min-w-[32px] h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-lg leading-tight mb-1">{address.name}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {address.houseNumber ? `${address.houseNumber}, ` : ''}
                            {address?.fullAddress}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex flex-col pl-2">
                        <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><DollarSign size={12} /> Amount</span>
                        <span className="font-bold text-slate-800 text-lg">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-4">
                        <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><CreditCard size={12} /> Payment</span>
                        <span className={`font-bold capitalize text-sm flex items-center h-full ${order.paymentMethod === 'cod' ? 'text-blue-600' : 'text-green-600'}`}>
                            {order.paymentMethod === "cod" ? "Cash On Delivery" : "Online"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onReject}
                    className="flex items-center cursor-pointer justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors text-sm"
                >
                    <XCircle size={18} />
                    Reject
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onAccept}
                    className="flex items-center cursor-pointer justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors text-sm"
                >
                    <CheckCircle size={18} />
                    Accept
                </motion.button>
            </div>
        </motion.div>
    )
}

// --- Sub Components ---

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
        >
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-300 ring-4 ring-blue-50/50">
                <Clock size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Assignments Yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">
                We are looking for orders near you. Please stay online and wait for a notification.
            </p>
        </motion.div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 pt-24 max-w-3xl mx-auto space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse mb-6"></div>
            {[1, 2].map(i => (
                <div key={i} className="h-64 bg-white rounded-2xl animate-pulse shadow-sm" />
            ))}
        </div>
    )
}