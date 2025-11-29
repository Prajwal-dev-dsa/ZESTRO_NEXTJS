import mongoose from "mongoose";

interface IGrocery {
  _id?: string;
  name: string;
  category: string;
  unit: string;
  price: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const grocerySchema = new mongoose.Schema<IGrocery>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Vegetables & Fruits",
        "Dairy, Bread & Milk",
        "Atta, Rice & Dal",
        "Oil, Masala & Dry Fruits",
        "Munchies & Chips",
        "Cold Drinks & Juices",
        "Tea, Coffee & Health Drinks",
        "Biscuits & Bakery",
        "Instant & Frozen Food",
        "Meats, Fish & Eggs",
        "Ice Creams & Frozen Desserts",
        "Pharma & Wellness",
        "Cleaning & Household",
        "Personal Care",
        "Baby Care",
        "Pet Care",
        "Stationery & Office",
        "Electronics & Accessories",
        "Gifting & Flowers",
        "Paan Corner",
      ],
      required: true,
    },
    unit: {
      type: String,
      enum: ["kg", "g", "l", "ml", "piece", "pack", "dozen"],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const groceryModel =
  mongoose.models?.Grocery || mongoose.model("Grocery", grocerySchema);
export default groceryModel;
