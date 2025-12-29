"use client"

import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    MapPin,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    User,
    Navigation,
    ChevronDown,
    ChevronUp,
    Package,
    Loader2,
    CheckCheck,
    KeyRound
} from "lucide-react"
import { initSocket } from "@/lib/socket.io"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import Image from "next/image"
import dynamic from "next/dynamic"
import DeliveryChat from "./DeliveryChat"
import toast from "react-hot-toast"

// --- Dynamic Map Import ---
const LiveMapTracking = dynamic(() => import("@/components/LiveMapTracking"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading Map...</span>
        </div>
    )
})

// --- Interfaces ---
interface Address {
    name: string
    mobile: string
    city: string
    state: string
    pincode: string
    houseNumber?: string
    fullAddress: string
    latitude: number;
    longitude: number;
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

interface AssignmentCardProps {
    data: Assignment
    onAccept: () => void
    onReject: () => void
}

// --- Main Dashboard Component ---

export default function DeliveryBoyDashboard() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [activeOrder, setActiveOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Default 0,0. Map won't render until these are populated.
    const [userLocation, setUserLocation] = useState<Location>({ latitude: 0, longitude: 0 })
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<Location>({ latitude: 0, longitude: 0 })

    // --- 1. Geolocation Tracking ---
    useEffect(() => {
        if (!userData?._id || !navigator.geolocation) return;

        const socket = initSocket();

        const watcher = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setDeliveryBoyLocation({ latitude, longitude })
                socket.emit("updateLocation", { userId: userData._id, latitude, longitude })
            },
            (err) => console.log(`Error in GeoLocationUpdater: ${err.message}`),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        )

        return () => {
            navigator.geolocation.clearWatch(watcher)
        }
    }, [userData?._id])


    // --- 2. API Fetching ---
    const getAllOrderAssignments = async () => {
        try {
            const res = await axios.get<Assignment[]>(`/api/delivery/get-all-order-assignments`)
            setAssignments(res.data)
        } catch (error) {
            console.error(`Error in getAllOrderAssignments`, error)
        }
    }

    const getAssignedOrderDetails = async () => {
        try {
            const res = await axios.get(`/api/delivery/assigned-order-details`)

            if (res.data && res.data.length > 0) {
                // Filter to find the active order (not delivered/completed)
                const active = res.data.find((o: Order) => o.status !== 'delivered' && o.status !== 'completed');

                if (active) {
                    setActiveOrder(active);
                    if (active.address && active.address.latitude && active.address.longitude) {
                        setUserLocation({
                            latitude: active.address.latitude,
                            longitude: active.address.longitude
                        })
                    }
                } else {
                    setActiveOrder(null);
                }
            } else {
                setActiveOrder(null);
            }
        } catch (error) {
            console.log(`Error in getAssignedOrderDetails`, error);
        } finally {
            setLoading(false)
        }
    }

    // Initial Data Load
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([getAllOrderAssignments(), getAssignedOrderDetails()]);
            setLoading(false);
        };
        fetchData();
    }, [userData])

    // Socket Listener for New Assignments
    useEffect(() => {
        const socket = initSocket()
        const handleNewAssignment = (deliveryAssignment: Assignment) => {
            // Only add if we don't have an active order
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

    // --- Action Handlers ---

    const handleAccept = async (assignmentId: string) => {
        // 1. Find the assignment locally so we can update UI instantly
        const selectedAssignment = assignments.find(a => a._id === assignmentId);

        if (!selectedAssignment) return;

        try {
            // 2. Call API to accept
            await axios.get(`/api/delivery/assignment/${assignmentId}/accept-assignment`)

            // 3. OPTIMISTIC UPDATE:
            // Remove from assignments list
            setAssignments((prev) => prev.filter((item) => item._id !== assignmentId))

            // Immediately set the active order so the UI switches views instantly
            // We use the order data from the assignment object
            setActiveOrder({
                ...selectedAssignment.order,
                status: 'out of delivery'
            });

            // Set user location for map immediately
            if (selectedAssignment.order.address) {
                setUserLocation({
                    latitude: selectedAssignment.order.address.latitude,
                    longitude: selectedAssignment.order.address.longitude
                })
            }

            // 4. Fetch fresh data in background to ensure sync (without loading spinner)
            await getAssignedOrderDetails();

        } catch (error) {
            console.log(`Error in handleAccept`, error);
            toast.error("Failed to accept order. It might be taken.");
            getAllOrderAssignments();
        }
    }

    const handleReject = async (assignmentId: string) => {
        setAssignments((prev) => prev.filter((item) => item._id !== assignmentId))
    }

    const handleDeliverySuccess = () => {
        setActiveOrder(null);
        toast.success("Order Delivered Successfully!");
        getAllOrderAssignments();
    }

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 font-sans">
            <main className="max-w-3xl mx-auto px-4 pt-6">

                {activeOrder ? (
                    // --- Active Delivery View ---
                    <div className="mt-24 space-y-6">
                        <div className="mb-4">
                            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                                <Navigation className="w-6 h-6 text-blue-600" />
                                Active Delivery
                            </h2>
                            <p className="text-slate-500 text-sm">You are currently assigned to this order.</p>
                        </div>
                        <ActiveOrderCard
                            order={activeOrder}
                            userLocation={userLocation}
                            deliveryBoyLocation={deliveryBoyLocation}
                            onDeliverySuccess={handleDeliverySuccess}
                        />
                    </div>
                ) : (
                    // --- Assignments List View ---
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
            {activeOrder && userData?._id && (
                <DeliveryChat
                    orderId={activeOrder._id}
                    currentUserId={userData._id.toString()}
                    otherPartyName={activeOrder.address.name || "Customer"}
                    role="delivery_boy"
                />
            )}
        </div>
    )
}

// --- ACTIVE ORDER CARD (With OTP Logic) ---

interface ActiveOrderCardProps {
    order: Order;
    userLocation: Location;
    deliveryBoyLocation: Location;
    onDeliverySuccess: () => void;
}

function ActiveOrderCard({ order, userLocation, deliveryBoyLocation, onDeliverySuccess }: ActiveOrderCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleSendOTP = async () => {
        setIsSendingOtp(true);
        try {
            await axios.post(`/api/delivery/otp/send-otp`, { orderId: order._id });
            toast.success("OTP Sent to Customer!");
            setShowOtpModal(true);
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to send OTP");
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOTP = async () => {
        const otpCode = otp.join("");
        if (otpCode.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }

        setIsVerifying(true);
        try {
            await axios.post(`/api/delivery/otp/verify-otp`, {
                orderId: order._id,
                otp: otpCode,
            });
            setShowOtpModal(false);
            onDeliverySuccess();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Invalid OTP";
            toast.error(msg);
            setOtp(["", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-100/50 overflow-hidden relative"
        >
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

            <div className="p-6 pt-4">
                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Delivery Location</p>
                            <p className="font-medium text-slate-700 text-sm leading-relaxed">{order.address.fullAddress}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Payment Method</p>
                            <span className="font-semibold text-slate-700 capitalize">{order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod}</span>
                        </div>
                    </div>
                </div>

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
                    <a href={`tel:${order.address.mobile}`} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors active:scale-95">
                        Call
                    </a>
                </div>

                <div className="mb-6">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendOTP}
                        disabled={isSendingOtp}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all mb-4 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSendingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCheck className="w-5 h-5" />}
                        {isSendingOtp ? "Sending OTP..." : "Mark as Delivered"}
                    </motion.button>

                    {(userLocation.latitude !== 0 && deliveryBoyLocation.latitude !== 0) ? (
                        <div className="w-full h-64 rounded-2xl overflow-hidden border border-blue-100 shadow-inner relative z-0">
                            <LiveMapTracking userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
                        </div>
                    ) : (
                        <div className="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm border border-dashed border-gray-200">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Waiting for location signal...
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">
                                {isOpen ? "Hide Items" : `View ${order.items.length} Items`}
                            </span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
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

            <div className="bg-slate-50/50 p-5 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Total Amount</span>
                <span className="text-xl font-extrabold text-slate-800">₹{order.totalAmount}</span>
            </div>

            <AnimatePresence>
                {showOtpModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                    <KeyRound className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Verify Delivery</h3>
                                <p className="text-slate-500 text-sm mt-1">Ask the customer for the 4-digit OTP sent to their email.</p>
                            </div>
                            <div className="flex justify-center gap-3 mb-8">
                                {otp.map((digit, idx) => (
                                    <input key={idx} ref={(el) => { inputRefs.current[idx] = el }} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(idx, e.target.value)} onKeyDown={(e) => handleKeyDown(idx, e)} className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-2xl font-bold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all bg-white shadow-sm" />
                                ))}
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={handleVerifyOTP} disabled={isVerifying} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                                    {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Complete"}
                                </button>
                                <button onClick={() => setShowOtpModal(false)} className="w-full text-slate-500 font-semibold py-3 hover:text-slate-700 transition-colors">Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function AssignmentCard({ data, onAccept, onReject }: AssignmentCardProps) {
    const { order } = data
    const address = order.address
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
    }
    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
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
                <motion.button whileTap={{ scale: 0.97 }} onClick={onReject} className="flex items-center cursor-pointer justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors text-sm">
                    <XCircle size={18} /> Reject
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={onAccept} className="flex items-center cursor-pointer justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors text-sm">
                    <CheckCircle size={18} /> Accept
                </motion.button>
            </div>
        </motion.div>
    )
}

function EmptyState() {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-300 ring-4 ring-blue-50/50">
                <Clock size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Assignments Yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">We are looking for orders near you. Please stay online and wait for a notification.</p>
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