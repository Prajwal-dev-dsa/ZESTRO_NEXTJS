import ConnectDB from "@/lib/db"
import CategorySlider from "./CategorySlider"
import HeroSection from "./HeroSection"
import groceryModel from "@/models/grocery.model"
import GroceryItemCard, { IGrocery } from "./GroceryItemCard"
import { Flame } from "lucide-react"

async function UserDashboard() {
    await ConnectDB()

    const grocery = await groceryModel.find({}).sort({ createdAt: -1 }).lean();

    const plainGrocery: IGrocery[] = grocery.map((doc: any) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
    }));

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <HeroSection />
            <CategorySlider />

            <section className="max-w-[1440px] mx-auto px-3 md:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center mb-8 gap-2">
                    <div className="bg-blue-100 p-2 md:p-3 rounded-full shadow-sm animate-pulse">
                        <Flame className="text-blue-600 w-5 h-5 md:w-6 md:h-6 fill-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                            Recommended for you
                        </h2>
                        <p className="text-xs md:text-base text-slate-500 font-medium mt-1">
                            Top picks based on your location
                        </p>
                    </div>
                </div>

                {/* --- Grid Layout Adjusted for Mobile --- */}
                {plainGrocery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {plainGrocery.map((item) => (
                            <GroceryItemCard key={item._id as string} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="text-4xl mb-4">🥗</div>
                        <h3 className="text-lg font-bold text-gray-800">No items available</h3>
                    </div>
                )}
            </section>
        </div>
    )
}

export default UserDashboard