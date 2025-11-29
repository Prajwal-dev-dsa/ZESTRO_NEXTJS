"use client";
import axios from "axios";
import { Bike, Loader, User, UserCog2 } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

function EditRoleAndMobilePage() {
    const router = useRouter();
    const { update } = useSession();
    const [role, setRole] = useState([
        {
            id: "admin", name: "Admin", icon: UserCog2
        },
        {
            id: "user", name: "User", icon: User
        },
        {
            id: "deliveryBoy", name: "Delivery Boy", icon: Bike
        }
    ])
    const [selectedRole, setSelectedRole] = useState("")
    const [mobile, setMobile] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const res = await axios.post(`/api/user/edit-role-mobile`, {
                role: selectedRole,
                mobile
            })
            console.log(res.data)
            update({
                role: selectedRole,
                mobile
            })
            router.refresh();
            router.push("/");
        } catch (error) {
            console.log(`Error in EditRoleAndMobilePage ${error}`)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex flex-col justify-center items-center p-6 w-full min-h-screen">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-extrabold text-blue-700 mt-8 text-center"
            >
                Select Your Role
            </motion.h1>
            <div className="flex flex-col md:flex-row justify-center gap-6 mt-10 items-center">
                {role.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            key={role.id}
                            className={`flex flex-col cursor-pointer items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${isSelected ? "border-blue-600 bg-blue-100" : "border-gray-300 bg-gray-50 hover:bg-blue-100"}`}
                            onClick={() => setSelectedRole(role.id)}
                        >
                            <Icon className="w-16 h-16" />
                            <span className="font-semibold mt-3 text-blue-800">{role.name}</span>
                        </motion.div>
                    )
                })}
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col items-center mt-10"
            >
                <label htmlFor="mobile" className="text-gray-700 font-mdeium mb-2">Enter Your Mobile Number</label>
                <input value={mobile} type="tel" id="mobile" placeholder="XXXX XXX XXXX" className="w-42 md:w-64 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800" onChange={(e) => setMobile(e.target.value)} />
            </motion.div>
            <motion.button
                onClick={handleSubmit}
                type="submit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                disabled={mobile.length !== 10 || !selectedRole}
                className={`inline-flex items-center gap-2 justify-center font-semibold py-3 px-8 rounded-4xl shadow-md transition-all duration-200 w-[75px] md:w-[100px] mt-5 ${mobile.length !== 10 || !selectedRole ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"}`}
            >
                {loading ? <Loader className="size-6 animate-spin" /> : "Submit"}
            </motion.button>
        </div>
    )
}

export default EditRoleAndMobilePage
