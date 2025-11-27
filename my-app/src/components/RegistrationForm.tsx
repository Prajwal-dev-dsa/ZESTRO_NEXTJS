'use client'

import { ArrowLeft, Eye, EyeOff, Leaf, Loader, Lock, Mail, User } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import React, { useState } from "react"
import googleImage from "@/assets/google.png"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type propType = {
    prevStep: (num: number) => void
}

function RegistrationForm({ prevStep }: propType) {
    const router = useRouter()
    const session = useSession()
    console.log(session.data?.user)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post(`/api/auth/register`, { name, email, password }, { withCredentials: true })
            console.log(res.data);
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.log(`Error in RegistrationForm: ${error}`);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-sky-100 relative">
            <div className="absolute top-6 left-6 flex items-center gap-1 text-sky-600 hover:text-sky-800 transition-colors cursor-pointer" onClick={() => prevStep(1)}>
                <ArrowLeft className="size-6" />
                <span className="font-semibold text-lg">Back</span>
            </div>
            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="text-4xl md:text-5xl font-extrabold text-sky-700 mb-4">
                Register
            </motion.h1>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
                className="flex items-center gap-3">
                <p className="text-gray-700 text-lg inline-flex md:text-xl max-w-lg">Create an account to start shopping with us <Leaf className="size-6 text-sky-600" /></p>
            </motion.div>
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
                className="flex flex-col w-full max-w-sm gap-3 mt-7">
                <div className="relative">
                    <User className="absolute left-3 top-3 size-6 text-gray-400" />
                    <input type="text" placeholder="Name" className="w-full py-3 pr-4 text-gray-800 focus:ring-2 focus:ring-sky-500 pl-10 border focus:outline-none border-gray-300 rounded-xl transition-all duration-500" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 size-6 text-gray-400" />
                    <input type="email" placeholder="Email" className="w-full py-3 pr-4 text-gray-800 focus:ring-2 focus:ring-sky-500 pl-10 border focus:outline-none border-gray-300 rounded-xl transition-all duration-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 size-6 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full py-3 pr-4 text-gray-800 focus:ring-2 focus:ring-sky-500 pl-10 border focus:outline-none border-gray-300 rounded-xl transition-all duration-500" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {!showPassword ? <Eye className="cursor-pointer absolute right-3 top-3 size-6 text-gray-400" onClick={() => setShowPassword(!showPassword)} /> : <EyeOff className="cursor-pointer absolute right-3 top-3 size-6 text-gray-400" onClick={() => setShowPassword(!showPassword)} />}
                </div>
                <button disabled={!name || !email || !password || loading} className={`w-full cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 shadow-md inline-flex items-center justify-center gap-2 ${name && email && password ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                    {loading ? <Loader className="size-6 animate-spin" /> : "Register"}
                </button>
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-3">
                    <span className="flex-1 h-px bg-gray-300"></span>
                    <span className="font-semibold">OR</span>
                    <span className="flex-1 h-px bg-gray-300"></span>
                </div>
                <button className="w-full mt-2 flex items-center justify-center gap-3 border-gray-300 hover:border-sky-600 border-2 cursor-pointer py-3 rounded-xl text-gray-700 font-medium transition-all duration-500">
                    <Image src={googleImage} alt="Google" width={24} height={24} />
                    <span>Register with Google</span>
                </button>
            </motion.form>
            <p className="mt-4 text-gray-600">Already have an account? <span onClick={() => router.push("/login")} className="text-sky-600 font-semibold cursor-pointer hover:underline">Login</span></p>
        </div>
    )
}

export default RegistrationForm