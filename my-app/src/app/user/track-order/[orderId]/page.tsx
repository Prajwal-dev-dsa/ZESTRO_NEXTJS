"use client"

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { initSocket } from "@/lib/socket.io"
import { ArrowLeft, Phone, User, Loader2, Navigation } from "lucide-react"
import dynamic from "next/dynamic"

const LiveMapTracking = dynamic(() => import("@/components/LiveMapTracking"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading Map...</span>
        </div>
    )
})

interface Location {
    latitude: number;
    longitude: number;
}

export default function TrackOrderPage() {
    const { orderId } = useParams()
    const router = useRouter()

    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [userLocation, setUserLocation] = useState<Location>({ latitude: 0, longitude: 0 })
    const [driverLocation, setDriverLocation] = useState<Location>({ latitude: 0, longitude: 0 })

    useEffect(() => {
        const getOrderDetails = async () => {
            try {
                const res = await axios.get(`/api/user/get-particular-order-details/${orderId}`)
                const data = res.data;
                setOrder(data);

                if (data.address) {
                    setUserLocation({
                        latitude: data.address.latitude,
                        longitude: data.address.longitude
                    })
                }

                if (data.assignedDeliveryBoy?.location?.coordinates) {
                    const [lng, lat] = data.assignedDeliveryBoy.location.coordinates;
                    setDriverLocation({ latitude: lat, longitude: lng });
                }

            } catch (error) {
                console.log(`Error in getOrderDetails`, error);
            } finally {
                setLoading(false);
            }
        }

        if (orderId) getOrderDetails();
    }, [orderId])

    useEffect(() => {
        if (!order || !order.assignedDeliveryBoy?._id) return;

        const socket = initSocket();
        const deliveryBoyId = order.assignedDeliveryBoy._id;

        const handleLocationUpdate = (data: any) => {
            if (data.userId === deliveryBoyId) {
                setDriverLocation({
                    latitude: data.location.coordinates[1],
                    longitude: data.location.coordinates[0]
                })
            }
        };

        socket.on("update-deliveryBoy-location", handleLocationUpdate);

        return () => {
            socket.off("update-deliveryBoy-location", handleLocationUpdate);
        }
    }, [order])


    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Locating your delivery partner...</p>
            </div>
        )
    }

    if (!order) return <div className="p-10 text-center">Order not found</div>;

    const deliveryBoy = order.assignedDeliveryBoy;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-4 shadow-sm">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Tracking Order
                            <span className="text-blue-600">#{order._id.toString().slice(-6)}</span>
                        </h1>
                        <p className="text-xs text-slate-500">
                            {order.status === 'out of delivery' ? 'Arriving Soon' : order.status}
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto p-4 space-y-6">
                <div className="bg-white p-2 rounded-3xl border border-blue-100 shadow-xl shadow-blue-100/50">
                    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden">
                        {(userLocation.latitude !== 0 && driverLocation.latitude !== 0) ? (
                            <LiveMapTracking
                                userLocation={userLocation}
                                deliveryBoyLocation={driverLocation}
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-400" />
                                    <p>Connecting to GPS...</p>
                                </div>
                            </div>
                        )}

                        <div className="absolute top-4 left-4 z-400 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-green-100">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center border-2 border-white shadow-md text-blue-600 relative">
                                <User className="w-7 h-7" />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                                    <Navigation className="w-2.5 h-2.5 text-white" />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Delivery Partner</p>
                                <h3 className="text-lg font-bold text-slate-800">{deliveryBoy?.name || "Partner"}</h3>
                                <div className="flex items-center gap-1 text-slate-500 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    <span>On the way</span>
                                </div>
                            </div>
                        </div>

                        {deliveryBoy?.mobile && (
                            <a
                                href={`tel:${deliveryBoy.mobile}`}
                                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 transition-transform active:scale-95"
                            >
                                <Phone className="w-5 h-5" />
                            </a>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-100 pt-5">
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-50"></div>
                                <div className="w-0.5 h-10 bg-gray-100"></div>
                                <div className="w-3 h-3 border-2 border-slate-300 rounded-full bg-white"></div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-sm font-bold text-slate-800 leading-none mb-1">On the way</p>
                                    <p className="text-xs text-slate-500">Your order is being delivered</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 leading-none mb-1">Destination</p>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                                        {order.address.fullAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}