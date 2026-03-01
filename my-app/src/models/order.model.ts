import mongoose from "mongoose";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      unit: string;
      image: string;
      quantity: number;
      price: string;
    },
  ];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    name: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out of delivery" | "delivered";
  isPaid: boolean;
  orderAssignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: mongoose.Types.ObjectId;
  OTP: string | null;
  isOtpVerified: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        grocery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: String,
        unit: String,
        image: String,
        quantity: Number,
        price: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    address: {
      name: String,
      mobile: String,
      city: String,
      state: String,
      pincode: String,
      fullAddress: String,
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["pending", "out of delivery", "delivered"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    orderAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    OTP: {
      type: String,
      default: null,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const OrderModel =
  mongoose.models?.Order || mongoose.model("Order", OrderSchema);
export default OrderModel;
