"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MapPin, CreditCard, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react"
import { initSocket } from "@/lib/socket.io"


interface Address {
    name: string
    mobile: string
    city: string
    state: string
    pincode: string
    houseNumber?: string
    fullAddress: string
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

export default function DeliveryBoyDashboard() {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const getAllOrderAssignments = async () => {
            try {
                const res = await axios.get<Assignment[]>(`/api/delivery/get-all-order-assignments`)
                console.log("Fetched Assignments:", res.data);
                setAssignments(res.data)
            } catch (error) {
                console.error(`Error in getAllOrderAssignments`, error)
            } finally {
                setLoading(false)
            }
        }
        getAllOrderAssignments()
    }, [])

    useEffect(() => {
        const socket = initSocket()
        const handleNewAssignment = (deliveryAssignment: Assignment) => {
            setAssignments((prev) => {
                // 1. Check if this ID already exists in our current list
                const isAlreadyHere = prev.some((item) => item._id === deliveryAssignment._id);

                // 2. If it exists, return the list exactly as is (ignore the duplicate)
                if (isAlreadyHere) {
                    console.log("Duplicate prevented:", deliveryAssignment._id);
                    return prev;
                }

                // 3. If it's new, add it to the list
                return [...prev, deliveryAssignment]
            })
        }
        socket.on("new-order-assignment", handleNewAssignment)
        return () => {
            socket.off("new-order-assignment", handleNewAssignment)
        }
    }, [])

    const handleAccept = async (assignmentId: string) => {
        console.log("Accepted:", assignmentId)
        setAssignments((prev) => prev.filter((item) => item._id !== assignmentId))
    }

    const handleReject = async (assignmentId: string) => {
        console.log("Rejected:", assignmentId)
        setAssignments((prev) => prev.filter((item) => item._id !== assignmentId))
    }

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 font-sans">

            {/* --- Main Content --- */}
            <main className="max-w-3xl mx-auto px-4 pt-6">

                <div className="mb-6 mt-24">
                    <h2 className="text-xl font-bold text-slate-800">Delivery Assignments</h2>
                    <p className="text-slate-500 text-sm">New orders in your area</p>
                </div>

                {loading ? (
                    // Loading Skeleton
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-white rounded-xl animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
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

// --- Sub Component: Assignment Card ---

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
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
            {/* Card Header */}
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

            {/* Card Body */}
            <div className="p-5">
                {/* Location */}
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

                {/* Details Grid */}
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

            {/* Card Footer: Actions */}
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

// --- Sub Component: Empty State ---

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