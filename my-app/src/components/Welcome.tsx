'use client'
import { ArrowRight, Bike, ShoppingBasket } from "lucide-react"
import { motion } from "motion/react"

type propType = {
    nextStep: (num: number) => void
}

function Welcome({ nextStep }: propType) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="flex items-center gap-3">
                <ShoppingBasket className="size-10 md:size-12 mb-2 text-sky-600" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700 mb-4">Zestro</h1>
            </motion.div>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
                className="flex items-center gap-3">
                <p className="text-gray-700 text-lg md:text-xl max-w-lg">Your one-stop solution for all your grocery needs. Groceries. Delivered. Done.</p>
            </motion.div>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.7 }}
                className="flex items-center gap-10 mt-6">
                <ShoppingBasket className="size-24 md:size-32 drop-shadow-md text-green-600" />
                <Bike className="size-24 md:size-32 drop-shadow-md text-orange-600" />
            </motion.div>
            <motion.button
                onClick={() => nextStep(2)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut', delay: 1 }}
                className="bg-sky-600 cursor-pointer text-white font-semibold px-6 inline-flex py-2 gap-2 rounded-full mt-6 hover:bg-sky-700 transition-colors shadow-md duration-200">Get Started <ArrowRight />
            </motion.button>
        </div>
    )
}

export default Welcome
