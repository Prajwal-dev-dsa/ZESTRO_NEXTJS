"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    Phone,
    User,
    Building,
    Globe,
    Search,
    CreditCard,
    Truck,
    CheckCircle2,
    Home,
    LocateFixed,
    Loader2,
    Loader
} from "lucide-react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const CheckoutMap = dynamic(() => import('@/components/CheckoutMap'), { ssr: false });


export default function CheckoutPage() {
    const router = useRouter()
    const { userData } = useSelector((state: RootState) => state.user)
    const { cartData } = useSelector((state: RootState) => state.cart)
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('cod');
    const [name, setName] = useState(userData?.name)
    const [mobile, setMobile] = useState(userData?.mobile)
    const [fullAddress, setFullAddress] = useState<String>("")
    const [city, setCity] = useState<String>("")
    const [state, setState] = useState<String>("")
    const [pincode, setPincode] = useState<String>("")
    const [searchQuery, setSearchQuery] = useState("")
    const [position, setPosition] = useState<[number, number] | null>(null)
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    // Calculations
    const subtotal = cartData.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
    const deliveryFee = subtotal > 500 ? 0 : 40; // Free delivery logic
    const total = subtotal + deliveryFee;

    // --- Logic to Get Current Location ---
    const handleGetCurrentLocation = () => {
        setIsLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    setPosition([latitude, longitude])
                    setIsLoadingLocation(false);
                },
                (err) => {
                    console.log(`Location error: ${err}`);
                    setIsLoadingLocation(false);
                    alert("Could not detect location. Please ensure location services are enabled.");
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
            )
        } else {
            setIsLoadingLocation(false);
            alert("Geolocation is not supported by this browser.");
        }
    }

    // Run once on mount
    useEffect(() => {
        handleGetCurrentLocation();
    }, [])

    // Fetch address when position changes
    useEffect(() => {
        const fetchAddress = async () => {
            if (!position) return;
            try {
                const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
                const { address } = res.data
                setFullAddress(res.data?.display_name)
                setCity(address.city || address.town || address.village || address.county)
                setState(address.state)
                setPincode(address.postcode)
            } catch (error) {
                console.log(`Error in fetch address ${error}`);
            }
        }
        fetchAddress()
    }, [position])

    const handleSearchQuery = async () => {
        setSearchLoading(true)
        const { OpenStreetMapProvider } = await import('leaflet-geosearch')
        const provider = new OpenStreetMapProvider()
        const results = await provider.search({ query: searchQuery })
        if (results && results.length > 0) {
            setPosition([results[0].y, results[0].x])
        }
        setSearchQuery("")
        setSearchLoading(false)
    }



    const handleCodOrder = async () => {
        if (!userData || !position) return null
        setLoading(true)
        try {
            const res = await axios.post(`/api/user/order`, {
                userId: userData._id,
                items: cartData.map((item) => ({
                    grocery: item._id,
                    name: item.name,
                    unit: item.unit,
                    image: item.image,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                address: {
                    name,
                    mobile,
                    city,
                    state,
                    pincode,
                    fullAddress,
                    latitude: position[0],
                    longitude: position[1],
                }
            }, {
                withCredentials: true
            })
            console.log(res.data);
            setName("")
            setMobile("")
            setFullAddress("")
            setCity("")
            setState("")
            setPincode("")
            router.push("/user/checkout/order-placed")
        } catch (error) {
            console.log(`Error in creating order ${error}`);
        } finally {
            setLoading(false)
        }
    }

    const handleOnlineOrder = async () => {
        if (!userData || !position) return null
        setLoading(true)
        try {
            const res = await axios.post(`/api/user/payment`, {
                userId: userData._id,
                items: cartData.map((item) => ({
                    grocery: item._id,
                    name: item.name,
                    unit: item.unit,
                    image: item.image,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                address: {
                    name,
                    mobile,
                    city,
                    state,
                    pincode,
                    fullAddress,
                    latitude: position[0],
                    longitude: position[1],
                }
            }, {
                withCredentials: true
            })
            setName("")
            setMobile("")
            setFullAddress("")
            setCity("")
            setState("")
            setPincode("")
            window.location.href = res.data?.url;
        } catch (error) {
            console.log(`Error in creating order ${error}`);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">

            {/* --- Top Navigation --- */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 mb-8">
                <Link
                    href="/user/cart"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="md:inline hidden">Back to Cart</span>
                </Link>
            </div>

            {/* --- Page Content --- */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-extrabold text-slate-800"
                    >
                        Checkout
                    </motion.h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* --- Left Column: Delivery Address --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Address Form Card */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Delivery Address</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-slate-700 placeholder:text-gray-400"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-slate-700"
                                    />
                                </div>

                                {/* Address */}
                                <div className="relative group">
                                    <Home className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <textarea
                                        placeholder="Address (Area and Street)"
                                        value={fullAddress as string}
                                        onChange={(e) => setFullAddress(e.target.value)}
                                        rows={2}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-slate-700 resize-none"
                                    />
                                </div>

                                {/* City / State / pincode Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="relative group">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={city as string}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="State"
                                            value={state as string}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Pin Code"
                                            value={pincode as string}
                                            onChange={(e) => setPincode(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Search & Map Action Row */}
                                <div className="flex gap-2">
                                    <div className="relative grow group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search city or area..."
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                        />
                                    </div>
                                    <button onClick={handleSearchQuery} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-200">
                                        {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                                    </button>
                                </div>
                            </div>

                            {/* --- Map Preview (Actual Map) --- */}
                            <div className="mt-6 relative w-full h-52 md:h-84 rounded-2xl overflow-hidden border border-gray-200 group z-0">
                                {position ? (
                                    <>
                                        <CheckoutMap position={position} setPosition={setPosition} />

                                        {/* --- RECENTER BUTTON --- */}
                                        <button
                                            onClick={handleGetCurrentLocation}
                                            className="absolute cursor-pointer bottom-4 right-4 z-400 bg-white p-2.5 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 text-blue-600 transition-colors"
                                            title="Use Current Location"
                                        >
                                            {isLoadingLocation ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <LocateFixed className="w-6 h-6" />
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                            <p>Loading Map...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Right Column: Payment & Summary --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1 space-y-6 sticky top-6"
                    >
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm shadow-blue-100/50">

                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl font-bold text-slate-800">Payment Method</h2>
                            </div>

                            {/* Payment Selectors */}
                            <div className="space-y-3 mb-8">
                                {/* Option 1: Stripe */}
                                <div
                                    onClick={() => setPaymentMethod('stripe')}
                                    className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 ${paymentMethod === 'stripe'
                                        ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                                        : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-blue-600' : 'border-gray-300'
                                        }`}>
                                        {paymentMethod === 'stripe' && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                                    </div>
                                    <div className="flex items-center gap-2 font-medium text-slate-700">
                                        <CreditCard className="w-5 h-5 text-slate-400" />
                                        Pay Online (Stripe)
                                    </div>
                                </div>

                                {/* Option 2: COD */}
                                <div
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 ${paymentMethod === 'cod'
                                        ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                                        : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-300'
                                        }`}>
                                        {paymentMethod === 'cod' && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                                    </div>
                                    <div className="flex items-center gap-2 font-medium text-slate-700">
                                        <Truck className="w-5 h-5 text-slate-400" />
                                        Cash on Delivery
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Delivery Fee</span>
                                    <span className={deliveryFee === 0 ? "text-green-500" : ""}>
                                        {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xl font-extrabold text-slate-800 pt-2">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <motion.button
                                onClick={() => {
                                    paymentMethod === "cod" ? handleCodOrder() : handleOnlineOrder()
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 cursor-pointer hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                {paymentMethod === "cod" ? loading ? <Loader className="w-5 h-5 animate-spin" /> : "Place Order" : loading ? <Loader className="w-5 h-5 animate-spin" /> : "Pay & Place Order"}
                                {!loading && <CheckCircle2 className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}